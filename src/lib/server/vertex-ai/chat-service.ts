import { getModel } from './config';
import { ReadableStream } from 'node:stream/web';
import { createPromptWithContext } from './prompt-config';

export async function createChatStream(messages: Array<{ role: string; content: string }>) {
    try {
        const model = getModel();
        
        // Gebruik de prompt configuratie om de context correct op te bouwen
        const prompt = createPromptWithContext(messages);

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