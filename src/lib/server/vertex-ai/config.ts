import { VertexAI } from '@google-cloud/vertexai';
import { writeFileSync } from 'fs';

const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'dobbie-online-bedrijfsarts';

// Voor productie (Vercel): gebruik JSON credentials uit environment variable
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    console.log('🔍 DEBUG: JSON env var exists:', !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('🔍 DEBUG: JSON length:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.length);
    
    try {
        console.log('🔍 DEBUG: Attempting to parse JSON...');
        // Parse de JSON credentials en schrijf naar tijdelijk bestand
        const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        console.log('🔍 DEBUG: JSON parsed successfully, project_id:', credentials.project_id);
        
        const path = '/tmp/gcp-key.json';
        
        writeFileSync(path, JSON.stringify(credentials));
        process.env.GOOGLE_APPLICATION_CREDENTIALS = path;
        console.log('🔍 DEBUG: File written to:', path);
        
        console.log('✅ Google Cloud credentials configured from environment variable');
    } catch (error) {
        console.error('❌ Failed to setup Google Cloud credentials:', error);
        console.error('🔍 DEBUG: Error details:', error instanceof Error ? error.message : String(error));
    }
} else {
    console.log('🏠 Using Application Default Credentials (local development)');
    console.log('🔍 DEBUG: No GOOGLE_APPLICATION_CREDENTIALS_JSON found');
}

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