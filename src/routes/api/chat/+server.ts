import { json, type RequestEvent } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createChatStream } from '$lib/server/vertex-ai/chat-service';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    try {
        const { messages } = await request.json();
        
        if (!messages || !Array.isArray(messages)) {
            console.error('Invalid messages format:', messages);
            return json({ error: 'Ongeldige berichten format.' }, { status: 400 });
        }
        
        console.log('🔍 Processing chat request with', messages.length, 'messages');
        
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
        console.error('Error stack:', error instanceof Error ? error.stack : String(error));
        
        let errorMessage = 'Er ging iets mis bij het verwerken van je vraag.';
        
        if (error instanceof Error) {
            if (error.message.includes('credentials')) {
                errorMessage = 'Google Cloud authenticatie niet geconfigureerd. Controleer de credentials.';
            } else if (error.message.includes('permission')) {
                errorMessage = 'Geen toegang tot Vertex AI. Controleer de API permissies.';
            } else if (error.message.includes('quota')) {
                errorMessage = 'API quota overschreden. Probeer het later opnieuw.';
            }
        }
        
        return json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
        }, { status: 500 });
    }
}; 