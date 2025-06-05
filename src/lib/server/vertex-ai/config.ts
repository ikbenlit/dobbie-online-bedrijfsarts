import { VertexAI } from '@google-cloud/vertexai';

// Gebruik process.env direct voor server-side environment variabelen
const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'dobbie-online-bedrijfsarts';

// Initialiseer Vertex AI client
export const vertexAI = new VertexAI({
    project: VERTEX_PROJECT_ID,
    location: 'europe-west1', // EU regio voor AVG compliance
});

// DoBie specifieke configuratie
const dobieConfig = {
    model: 'gemini-2.0-flash',
    generationConfig: {
        temperature: 0.3,        // Lage temp voor consistente, feitelijke antwoorden
        maxOutputTokens: 500,    // Kort en bondig (zoals Talar wil)
        topP: 0.8,              // Nucleus sampling voor kwaliteit
        topK: 40,               // Beperkt aantal kandidaten
        candidateCount: 1,       // Eén antwoord per keer
    }
};

// Haal het generative model op met DoBie configuratie
export const getModel = () => vertexAI.preview.getGenerativeModel(dobieConfig);