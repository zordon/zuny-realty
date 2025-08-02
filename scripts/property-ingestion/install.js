#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function install() {
  console.log('🚀 Setting up Property Ingestion Tool...\n');

  try {
    // Check if npm/yarn is available
    let packageManager = 'npm';
    try {
      execSync('yarn --version', { stdio: 'ignore' });
      packageManager = 'yarn';
      console.log('📦 Using Yarn package manager');
    } catch {
      console.log('📦 Using NPM package manager');
    }

    // Install dependencies
    console.log('📥 Installing dependencies...');
    execSync(`${packageManager} install`, { stdio: 'inherit' });

    // Setup environment file
    const envPath = path.join(__dirname, '.env');
    const envExamplePath = path.join(__dirname, 'env.example');
    
    try {
      await fs.access(envPath);
      console.log('✅ .env file already exists');
    } catch {
      try {
        const envExample = await fs.readFile(envExamplePath, 'utf-8');
        await fs.writeFile(envPath, envExample);
        console.log('✅ Created .env file from template');
      } catch (error) {
        console.log('⚠️  Please create .env file manually');
      }
    }

    console.log('\n🎉 Installation complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Edit .env file with your API keys:');
    console.log('   - STRAPI_API_TOKEN (from Strapi admin)');
    console.log('   - GEMINI_API_KEY (from Google AI Studio)');
    console.log('2. Run examples: npm run examples');
    console.log('3. Or process your own data: node main.js "your data"');
    console.log('\n📚 See README.md for detailed instructions');

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  install();
}

module.exports = { install };