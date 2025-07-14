import { getModel } from './config';
import { ReadableStream } from 'node:stream/web';
import { createPromptWithContext } from './prompt-config';
import { trimMessagesToTokenLimit, estimateTokens, DEFAULT_TOKEN_LIMIT } from '../utils/token-helper';

export async function createChatStream(messages: Array<{ role: string; content: string }>) {
    try {
        const model = getModel();
        
        // Bereken token statistieken voor performance monitoring
        const originalTokenCount = messages.reduce((total, msg) => total + estimateTokens(msg.content), 0);
        
        // Trim berichten tot een veilige token limiet met fallback
        let trimmedMessages = messages;
        try {
            trimmedMessages = trimMessagesToTokenLimit(messages, DEFAULT_TOKEN_LIMIT);
            const trimmedTokenCount = trimmedMessages.reduce((total, msg) => total + estimateTokens(msg.content), 0);
            
            console.log(`Token trimming stats:`, {
                originalMessages: messages.length,
                trimmedMessages: trimmedMessages.length,
                originalTokens: originalTokenCount,
                trimmedTokens: trimmedTokenCount,
                tokensSaved: originalTokenCount - trimmedTokenCount,
                trimmingOccurred: messages.length !== trimmedMessages.length
            });
        } catch (error) {
            console.error('Token trimming failed, using original messages:', error);
            // Fallback naar originele berichten als trimming faalt
            trimmedMessages = messages;
        }
        
        // Gebruik de prompt configuratie om de context correct op te bouwen
        const prompt = createPromptWithContext(trimmedMessages);

        // Genereer de response met streaming
        const response = await model.generateContentStream(prompt);

        // Creëer een ReadableStream voor de response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                
                try {
                    for await (const chunk of response.stream) {
                        if (chunk.candidates && chunk.candidates[0]?.content?.parts?.[0]?.text) {
                            const text = chunk.candidates[0].content.parts[0].text;
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
            cancel() {
                console.log("Stream cancelled by client.");
            }
        });

        return stream;
    } catch (error) {
        console.error('Error in createChatStream:', error);
        throw error;
    }
} 