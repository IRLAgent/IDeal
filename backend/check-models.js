// Quick script to check available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Checking API Key:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('');
    
    // Try all possible model names for 2025-2026
    const modelsToTry = [
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash',
    ];

    console.log('Testing models...\n');
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS!`);
      } catch (error) {
        const errorMsg = error.message;
        if (errorMsg.includes('API key not valid')) {
          console.log(`❌ ${modelName} - API KEY NOT VALID`);
        } else if (errorMsg.includes('429')) {
          console.log(`❌ ${modelName} - QUOTA EXCEEDED`);
        } else if (errorMsg.includes('404')) {
          console.log(`❌ ${modelName} - MODEL NOT FOUND`);
        } else {
          console.log(`❌ ${modelName} - ${errorMsg.substring(0, 80)}...`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
