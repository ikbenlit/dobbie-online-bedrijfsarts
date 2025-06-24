import baseSystemPromptContent from '$lib/server/prompts/chat_baseprompt.md?raw';

export function createPromptWithContext(messages: Array<{ role: string; content: string }>) {
    // Filter system messages eruit, die behandelen we apart
    const userMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => {
            // Maak onderscheid tussen gebruiker en assistent berichten
            if (msg.role === 'user') {
                return `Vraag: ${msg.content}`;
            } else if (msg.role === 'assistant') {
                return `DoBbie: ${msg.content}`;
            }
            return msg.content;
        })
        .join('\n\n');

    // Combineer de base prompt met de gebruikers berichten
    return `${baseSystemPromptContent}

CONVERSATIE:

${userMessages}

DoBbie: `;
} 