// Quick script to check available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Checking API Key:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('');
    
    // Try the most common models
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
    ];

    console.log('Testing models...\n');
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS!`);
      } catch (error) {
        console.log(`❌ ${modelName} - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
