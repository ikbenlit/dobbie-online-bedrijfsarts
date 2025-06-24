// Test script voor Vertex AI / Gemini Pro
// Run met: node test-vertex.js

import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testVertexAI() {
  console.log('🚀 Testing Vertex AI connection...\n');
  
  const projectId = process.env.VERTEX_PROJECT_ID;
  if (!projectId) {
    console.error('❌ Missing environment variable: VERTEX_PROJECT_ID');
    return;
  }

  try {
    // Initialize Vertex AI
    const vertex_ai = new VertexAI({
      project: projectId,
      location: 'europe-west1', // EU regio voor AVG compliance
    });

    // Get the generative model (Gemini 2.0 Flash)
    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.0-flash', // Stable Gemini 2.0 model
    });

    // Test prompt - simpele DoBie vraag
    const prompt = `Je bent DoBie, de online bedrijfsarts. Beantwoord kort en to-the-point:

"Een medewerker is 3 weken ziek en de werkgever vraagt wanneer hij weer kan werken. Wat adviseer je?"`;

    console.log('📤 Sending prompt to Gemini Pro...');
    console.log('Prompt:', prompt);
    console.log('\n⏱️  Waiting for response...\n');

    // Generate response
    const response = await model.generateContent(prompt);
    const text = response.response.candidates[0].content.parts[0].text;

    console.log('✅ Response received!');
    console.log('📝 DoBie says:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    
    console.log('\n🎯 Test successful! Vertex AI is working correctly.');
    console.log('💰 This request probably costs < €0.01');
    console.log('🇪🇺 Data processed in EU region (europe-west1)');
    
  } catch (error) {
    console.error('❌ Error testing Vertex AI:');
    console.error(error.message);
    
    if (error.message.includes('permission')) {
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check if Vertex AI API is enabled');
      console.log('2. Verify project ID is correct');
      console.log('3. Make sure you have Vertex AI User role');
    }
  }
}

// Run the test
testVertexAI();
