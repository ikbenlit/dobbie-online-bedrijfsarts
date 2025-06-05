import { VertexAI } from '@google-cloud/vertexai';

const VERTEX_PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'dobbie-online-bedrijfsarts';

// Setup voor Workload Identity (Vercel) vs Application Default Credentials (lokaal)
let vertexAIOptions: any = {
    project: VERTEX_PROJECT_ID,
    location: 'europe-west1',
};

// Als we op Vercel draaien (Workload Identity environment variables aanwezig)
if (process.env.GOOGLE_CLOUD_WORKLOAD_IDENTITY_PROVIDER && process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT) {
    console.log('🔧 Using Workload Identity for Vercel deployment');
    
    try {
        // Import alleen wanneer nodig (Vercel deployment)
        const { GoogleAuth } = require('google-auth-library');
        
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
            credentials: {
                type: 'external_account',
                audience: `//iam.googleapis.com/${process.env.GOOGLE_CLOUD_WORKLOAD_IDENTITY_PROVIDER}`,
                subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
                subject_token_url: 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
                service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT}:generateAccessToken`,
            }
        });
        
        vertexAIOptions.authClient = auth;
    } catch (error) {
        console.error('❌ Failed to setup Workload Identity:', error);
        console.log('🔄 Falling back to Application Default Credentials');
    }
} else {
    console.log('🏠 Using Application Default Credentials for local development');
}

// Initialiseer Vertex AI client
export const vertexAI = new VertexAI(vertexAIOptions);

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