#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🚀 Property Ingestion Setup\n');
  
  try {
    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
      console.log('✅ Found existing .env file\n');
    } catch {
      console.log('📄 Creating new .env file\n');
    }

    // Parse existing env
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    console.log('📋 Configuration Setup:');
    console.log('─'.repeat(50));

    // STRAPI_URL
    const currentStrapiUrl = envVars.STRAPI_URL || 'http://localhost:1337';
    const strapiUrl = await question(`Strapi URL [${currentStrapiUrl}]: `) || currentStrapiUrl;

    // STRAPI_API_TOKEN
    let strapiToken = envVars.STRAPI_API_TOKEN || '';
    if (!strapiToken) {
      console.log('\n🔑 Strapi API Token Setup:');
      console.log('1. Open your Strapi admin panel');
      console.log('2. Go to Settings → API Tokens');
      console.log('3. Create new token with "Full access" permissions');
      console.log('4. Copy the token\n');
    }
    strapiToken = await question(`Strapi API Token [${strapiToken ? '***hidden***' : 'required'}]: `) || strapiToken;

    // GEMINI_API_KEY
    let geminiKey = envVars.GEMINI_API_KEY || '';
    if (!geminiKey) {
      console.log('\n🤖 Gemini API Key Setup:');
      console.log('1. Go to https://makersuite.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Copy the key\n');
    }
    geminiKey = await question(`Gemini API Key [${geminiKey ? '***hidden***' : 'required'}]: `) || geminiKey;

    // Validate required fields
    if (!strapiToken || !geminiKey) {
      console.error('\n❌ Both API keys are required!');
      process.exit(1);
    }

    // Write .env file
    const newEnvContent = `# Strapi Configuration
STRAPI_URL=${strapiUrl}
STRAPI_API_TOKEN=${strapiToken}

# Gemini AI Configuration
GEMINI_API_KEY=${geminiKey}

# Optional: Database connection for direct access
# DATABASE_URL=postgresql://user:password@localhost:5432/database_name
`;

    await fs.writeFile(envPath, newEnvContent);
    console.log('\n✅ Configuration saved to .env file');

    // Test connections
    console.log('\n🔍 Testing connections...');
    
    // Test Strapi
    try {
      const axios = require('axios');
      const strapiAPI = axios.create({
        baseURL: strapiUrl,
        headers: {
          'Authorization': `Bearer ${strapiToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      await strapiAPI.get('/api/features?pagination[pageSize]=1');
      console.log('✅ Strapi connection successful');
    } catch (error) {
      console.log('❌ Strapi connection failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.log('💡 Make sure Strapi is running: yarn backend:dev');
      }
    }

    // Test Gemini
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      await model.generateContent("Hello");
      console.log('✅ Gemini API connection successful');
    } catch (error) {
      console.log('❌ Gemini API connection failed:', error.message);
      if (error.message.includes('API key')) {
        console.log('💡 Check your Gemini API key');
      }
    }

    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Start Strapi: yarn backend:dev');
    console.log('2. Test the script: yarn property:examples');
    console.log('3. Process your own data: node main.js "your property data"');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };