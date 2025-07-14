import { VertexAI } from '@google-cloud/vertexai';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// Load environment variables manually for SvelteKit server context
function loadEnvVariables() {
    try {
        const envContent = readFileSync('.env', 'utf8');
        const envLines = envContent.split('\n');
        for (const line of envLines) {
            if (line.includes('=') && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value && !process.env[key.trim()]) {
                    process.env[key.trim()] = value.trim();
                }
            }
        }
    } catch (error) {
        console.log('No .env file found, using system environment variables');
    }
}

loadEnvVariables();

const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID;

if (!VERTEX_PROJECT_ID) {
    throw new Error("Missing required environment variable: VERTEX_PROJECT_ID");
}

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
    console.log('🔍 DEBUG: GOOGLE_APPLICATION_CREDENTIALS path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Check if credentials file exists
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        try {
            if (!existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
                console.error('❌ GOOGLE_APPLICATION_CREDENTIALS file not found:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
                console.error('🔧 Please create the service account key file or set GOOGLE_APPLICATION_CREDENTIALS_JSON');
            } else {
                console.log('✅ Found credentials file:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
            }
        } catch (error) {
            console.error('❌ Error checking credentials file:', error);
        }
    }
}

// Initialiseer Vertex AI client
let vertexAI: VertexAI;

try {
    vertexAI = new VertexAI({
        project: VERTEX_PROJECT_ID,
        location: 'europe-west1', // EU regio voor AVG compliance
    });
    console.log('✅ Vertex AI client initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize Vertex AI client:', error);
    throw error;
}

export { vertexAI };

// DoBie specifieke configuratie
const dobieConfig = {
    model: 'gemini-2.5-flash',
    generationConfig: {
        temperature: 0.3,        // Lage temp voor consistente, feitelijke antwoorden
        maxOutputTokens: 2048,    // Verhoogd voor langere antwoorden
        topP: 0.8,              // Nucleus sampling voor kwaliteit
        topK: 40,               // Beperkt aantal kandidaten
        candidateCount: 1,       // Eén antwoord per keer
    }
};

// Haal het generative model op met DoBie configuratie
export const getModel = () => {
    try {
        if (!vertexAI) {
            throw new Error('Vertex AI client not initialized');
        }
        
        const model = vertexAI.preview.getGenerativeModel(dobieConfig);
        console.log('✅ Model created with config:', dobieConfig.model);
        return model;
    } catch (error) {
        console.error('❌ Failed to create model:', error);
        throw error;
    }
};