# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd scripts/property-ingestion
node install.js
```

### 2. Configure API Keys
Edit the `.env` file with your credentials:
```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting API Keys:**
- **Strapi Token**: Admin Panel → Settings → API Tokens → Create Token (Full Access)
- **Gemini Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Run Examples
```bash
npm run examples
```

## ⚡ Quick Usage

### Interactive Setup (Recommended)
```bash
npm run setup
```

### Process Encuentra24 URL
```bash
node main.js "https://www.encuentra24.com/panama-es/..."
```

### Process WhatsApp Text
```bash
node main.js "Se vende hermoso dúplex en El Avance 1, Bethania de 430 mts..."
```

### Batch Process Multiple Sources
```bash
node main.js "url1" "text description" "url2"
```

## 🎯 What It Does

- ✅ Scrapes property data from URLs
- ✅ Parses unstructured text with AI
- ✅ Translates Spanish → English automatically
- ✅ Creates properties, features, and categories in Strapi
- ✅ Avoids duplicates
- ✅ Handles relationships properly

## 📊 Example Output

```
🚀 Initializing Property Ingestion Service...
📋 Loaded 15 existing features
📁 Loaded 8 existing categories

🔄 Processing 2 property sources...

[1/2] Processing source...
🌐 Scraping URL: https://www.encuentra24.com/panama-es/...
🤖 Parsing data with Gemini AI...
🌐 Translating data to English...
🏠 Processing property for Strapi...
📁 Created new category: duplex (duplex)
📋 Created new feature: jacuzzi (jacuzzi)
✅ Property created successfully with ID: 123
✅ Source processed successfully

📊 Processing Summary:
✅ Successful: 2
❌ Failed: 0
```

## 🆘 Need Help?

- Check `README.md` for full documentation
- Ensure Strapi backend is running
- Verify API keys are correct
- Check network connectivity