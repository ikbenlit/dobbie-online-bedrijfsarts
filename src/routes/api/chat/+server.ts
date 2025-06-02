import { json, type RequestEvent } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createChatStream } from '$lib/server/vertex-ai/chat-service';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    try {
        const { messages } = await request.json();
        
        // Gebruik Vertex AI voor de chat stream
        const stream = await createChatStream(messages);

        // Stuur de stream terug als response
        return new Response(stream as any, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error bij het aanroepen van de Vertex AI API:', error);
        return json({ error: 'Er ging iets mis bij het verwerken van je vraag.' }, { status: 500 });
    }
}; 