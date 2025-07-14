interface Message {
    role: string;
    content: string;
}

// Configuratie voor token estimatie
export const DEFAULT_CHARACTERS_PER_TOKEN = 4;
export const DEFAULT_TOKEN_LIMIT = 100000;

export function estimateTokens(text: string, charactersPerToken: number = 4): number {
    if (!text || text.length === 0) {
        return 0;
    }
    
    // Verbeterde schatting voor Nederlandse tekst
    let adjustedText = text;
    
    // Nederlandse leestekens en spaties tellen anders
    const dutchPunctuationCount = (text.match(/[.,!?;:""'']/g) || []).length;
    const whitespaceCount = (text.match(/\s/g) || []).length;
    
    // Nederlandse lange woorden (samengestelde woorden) tellen vaak als meer tokens
    const longWordCount = (text.match(/\b\w{12,}\b/g) || []).length;
    
    // Basis berekening
    let baseTokens = Math.ceil(text.length / charactersPerToken);
    
    // Aanpassingen voor Nederlands:
    // - Lange woorden krijgen een kleine boost (samengestelde woorden)
    // - Leestekens worden vaak als aparte tokens gezien
    const dutchAdjustment = Math.ceil(longWordCount * 0.3 + dutchPunctuationCount * 0.2);
    
    return Math.max(1, baseTokens + dutchAdjustment);
}

export function trimMessagesToTokenLimit(messages: Message[], limit: number): Message[] {
    if (messages.length === 0) {
        return [];
    }

    // Zoek naar systeem berichten die we altijd willen behouden
    const systemMessages = messages.filter(msg => msg.role === 'system');
    const nonSystemMessages = messages.filter(msg => msg.role !== 'system');

    // Bereken tokens voor systeem berichten
    const systemTokens = systemMessages.reduce((total, msg) => {
        return total + estimateTokens(msg.content);
    }, 0);

    // Resterende tokens voor conversatie berichten
    const availableTokens = limit - systemTokens;
    
    if (availableTokens <= 0) {
        // Als systeem berichten al over de limiet gaan, return alleen systeem berichten
        return systemMessages;
    }

    // Voeg berichten toe van achteren naar voren tot limiet bereikt
    const result: Message[] = [];
    let currentTokens = 0;

    // Start van achteren (nieuwste berichten eerst)
    for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
        const message = nonSystemMessages[i];
        const messageTokens = estimateTokens(message.content);
        
        if (currentTokens + messageTokens <= availableTokens) {
            result.unshift(message); // Voeg toe aan het begin
            currentTokens += messageTokens;
        } else {
            // Stop als we de limiet zouden overschrijden
            break;
        }
    }

    // Combineer systeem berichten met getrimde conversatie berichten
    return [...systemMessages, ...result];
}