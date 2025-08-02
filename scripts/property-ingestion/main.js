#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CONFIG_FILE = require('./config');

// Configuration
const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DEFAULT_LOCALE: 'es',
  SECONDARY_LOCALE: 'en'
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

class PropertyIngestionService {
  constructor() {
    this.existingFeatures = new Map();
    this.existingCategories = new Map();
    this.strapiAPI = axios.create({
      baseURL: CONFIG.STRAPI_URL,
      headers: {
        'Authorization': `Bearer ${CONFIG.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async initialize() {
    console.log('🚀 Initializing Property Ingestion Service...');
    await this.loadExistingData();
  }

  async loadExistingData() {
    try {
      // Test Strapi connection first
      await this.strapiAPI.get('/api/features?pagination[pageSize]=1');
      
      // Load existing features
      const featuresResponse = await this.strapiAPI.get('/api/features?pagination[pageSize]=1000');
      if (featuresResponse.data && featuresResponse.data.data) {
        featuresResponse.data.data.forEach(feature => {
          if (feature.attributes && feature.attributes.name) {
            this.existingFeatures.set(feature.attributes.name.toLowerCase(), feature.id);
          }
        });
        console.log(`📋 Loaded ${this.existingFeatures.size} existing features`);
      }

      // Load existing categories
      const categoriesResponse = await this.strapiAPI.get('/api/categories?pagination[pageSize]=1000');
      if (categoriesResponse.data && categoriesResponse.data.data) {
        categoriesResponse.data.data.forEach(category => {
          if (category.attributes && category.attributes.name) {
            this.existingCategories.set(category.attributes.name.toLowerCase(), category.id);
          }
        });
        console.log(`📁 Loaded ${this.existingCategories.size} existing categories`);
      }
    } catch (error) {
      console.error('❌ Error loading existing data:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error('💡 Make sure your Strapi backend is running on', CONFIG.STRAPI_URL);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('💡 Check your STRAPI_API_TOKEN in .env file');
      }
      console.log('⚠️  Continuing without existing data (may create duplicates)');
    }
  }

  async processPropertySource(source) {
    console.log('\n🔄 Processing property source...');

    let rawData;
    if (source.startsWith('http')) {
      rawData = await this.scrapeURL(source);
    } else {
      rawData = source;
    }

    const structuredData = await this.parseWithGemini(rawData);
    const translatedData = await this.translateData(structuredData);
    const processedProperty = await this.processProperty(translatedData);

    return processedProperty;
  }

  async scrapeURL(url) {
    try {
      console.log(`🌐 Scraping URL: ${url}`);
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extract relevant text content
      const title = $('title').text() || $('h1').first().text();
      const description = $('meta[name="description"]').attr('content') || '';
      const price = $('[class*="price"], [id*="price"]').text();
      const features = $('[class*="feature"], [class*="amenity"], [class*="benefit"]')
        .map((i, el) => $(el).text()).get().join(', ');

      // Get main content areas
      const mainContent = $('body').text().replace(/\s+/g, ' ').trim();

      return {
        url,
        title,
        description,
        price,
        features,
        content: mainContent.substring(0, 5000) // Limit content size
      };
    } catch (error) {
      console.error('❌ Error scraping URL:', error.message);
      throw error;
    }
  }

  async parseWithGemini(rawData) {
    try {
      console.log('🤖 Parsing data with Gemini AI...');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
Analyze this real estate property data and extract structured information. Return a JSON object with the following structure:

{
  "title": "Property title",
  "description": "Detailed description",
  "address": "Property address/location",
  "price": 000000,
  "currency": "USD" or "PAB",
  "bedrooms": 0,
  "bathrooms": 0,
  "propertyType": "sale" or "rent",
  "category": "apartment", "house", "duplex", "lot", etc.,
  "features": ["feature1", "feature2", ...],
  "characteristics": [
    {"key": "area", "label": "Área", "value": "114", "suffix": "m²"},
    {"key": "parking", "label": "Estacionamiento", "value": "1", "suffix": "espacios"}
  ],
  "location": {
    "neighborhood": "neighborhood name",
    "city": "city name",
    "country": "country name"
  }
}

Property Data:
${typeof rawData === 'object' ? JSON.stringify(rawData, null, 2) : rawData}

Important:
- Extract exact numbers for price, bedrooms, bathrooms
- Identify property type (sale/rent) from context
- Extract all features/amenities mentioned
- Create characteristics for measurable attributes
- Be precise with location details
- Currency should be USD or PAB (Panamanian Balboa)
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Clean and parse JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('✅ Data parsed successfully');
      return parsedData;
    } catch (error) {
      console.error('❌ Error parsing with Gemini:', error.message);
      throw error;
    }
  }

  async translateData(data) {
    try {
      console.log('🌐 Translating data to English...');
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
Translate this real estate property data from Spanish to English. Keep the same JSON structure but translate text fields. Keep prices, numbers, and technical terms accurate.

Original data:
${JSON.stringify(data, null, 2)}

Return the translated JSON with English text while preserving all numbers, structure, and technical details.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in translation response');
      }

      const translatedData = JSON.parse(jsonMatch[0]);

      // Return both Spanish (original) and English versions
      return {
        es: data,
        en: translatedData
      };
    } catch (error) {
      console.error('❌ Error translating data:', error.message);
      // Return original data if translation fails
      return { es: data, en: data };
    }
  }

  async processProperty(bilingualData) {
    try {
      console.log('🏠 Processing property for Strapi...');

      const { es: spanishData, en: englishData } = bilingualData;

      // Process category
      const categoryId = await this.getOrCreateCategory(spanishData.category, englishData.category);

      // Process features
      const featureIds = await this.getOrCreateFeatures(spanishData.features, englishData.features);

      // Create Spanish property first (default locale)
      const propertyPayload = {
        data: {
          title: spanishData.title,
          description: spanishData.description,
          address: spanishData.address,
          price: spanishData.price,
          currency: spanishData.currency || 'USD',
          bedrooms: spanishData.bedrooms || 0,
          bathrooms: spanishData.bathrooms || 0,
          propertyType: spanishData.propertyType,
          category: categoryId,
          features: featureIds,
          characteristics: spanishData.characteristics || [],
          isFeatured: false,
          locale: 'es',
          publishedAt: new Date().toISOString()
        }
      };

      console.log('🔍 Creating property with payload:', JSON.stringify(propertyPayload, null, 2));
      
      // Create property in Strapi
      const response = await this.strapiAPI.post('/api/properties', propertyPayload);
      const propertyId = response.data.data.id;
      console.log('✅ Property created successfully with ID:', propertyId);

      // Create English localization
      try {
        const englishPayload = {
          data: {
            title: englishData.title,
            description: englishData.description,
            address: englishData.address,
            price: spanishData.price, // Keep same price
            currency: spanishData.currency || 'USD', // Keep same currency
            bedrooms: spanishData.bedrooms || 0, // Keep same numbers
            bathrooms: spanishData.bathrooms || 0,
            propertyType: spanishData.propertyType, // Keep same type
            category: categoryId, // Keep same category
            features: featureIds, // Keep same features
            characteristics: englishData.characteristics || [],
            isFeatured: false,
            locale: 'en'
          }
        };
        
        await this.strapiAPI.post(`/api/properties/${propertyId}/localizations`, englishPayload);
        console.log('✅ Added English localization for property');
      } catch (localizationError) {
        console.log(`⚠️  Created property but failed to add English localization: ${localizationError.message}`);
      }

      return response.data.data;
    } catch (error) {
      console.error('❌ Error processing property:', error.message);
      throw error;
    }
  }

  async getOrCreateCategory(spanishName, englishName) {
    const key = spanishName.toLowerCase();

    if (this.existingCategories.has(key)) {
      return this.existingCategories.get(key);
    }

    try {
      // Create Spanish version first (default locale)
      const slug = spanishName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      
      const categoryPayload = {
        data: {
          name: spanishName,
          slug: slug,
          locale: 'es'
        }
      };

      console.log('🔍 Creating category with payload:', JSON.stringify(categoryPayload, null, 2));
      const response = await this.strapiAPI.post('/api/categories', categoryPayload);
      const categoryId = response.data.data.id;
      
      // Create English localization
      try {
        const englishSlug = englishName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const englishPayload = {
          data: {
            name: englishName,
            slug: englishSlug,
            locale: 'en'
          }
        };
        
        await this.strapiAPI.post(`/api/categories/${categoryId}/localizations`, englishPayload);
        console.log(`📁 Created category with localizations: ${spanishName} (${englishName})`);
      } catch (localizationError) {
        console.log(`⚠️  Created category but failed to add English localization: ${localizationError.message}`);
      }

      this.existingCategories.set(key, categoryId);
      return categoryId;
    } catch (error) {
      console.error('❌ Error creating category:', error.message);
      if (error.response?.data) {
        console.error('📋 Error details:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  async getOrCreateFeatures(spanishFeatures, englishFeatures) {
    const featureIds = [];

    for (let i = 0; i < spanishFeatures.length; i++) {
      const spanishFeature = spanishFeatures[i];
      let englishFeature = englishFeatures[i] || spanishFeature;
      
      // Use predefined mapping if available for more accurate translation
      const featureLowerCase = spanishFeature.toLowerCase().trim();
      if (CONFIG_FILE.FEATURE_MAPPING[featureLowerCase]) {
        englishFeature = CONFIG_FILE.FEATURE_MAPPING[featureLowerCase];
        console.log(`🔄 Using predefined mapping: ${spanishFeature} → ${englishFeature}`);
      }
      
      const key = featureLowerCase;

      if (this.existingFeatures.has(key)) {
        featureIds.push(this.existingFeatures.get(key));
      } else {
        try {
          // Create Spanish version first (default locale)
          const featurePayload = {
            data: {
              name: spanishFeature,
              locale: 'es'
            }
          };

          const response = await this.strapiAPI.post('/api/features', featurePayload);
          const featureId = response.data.data.id;
          
          // Create English localization
          try {
            const englishPayload = {
              data: {
                name: englishFeature,
                locale: 'en'
              }
            };
            
            await this.strapiAPI.post(`/api/features/${featureId}/localizations`, englishPayload);
          } catch (localizationError) {
            console.log(`⚠️  Created feature but failed to add English localization: ${localizationError.message}`);
          }

          this.existingFeatures.set(key, featureId);
          featureIds.push(featureId);
          console.log(`📋 Created new feature: ${spanishFeature} (${englishFeature})`);
        } catch (error) {
          console.error(`❌ Error creating feature ${spanishFeature}:`, error.message);
          if (error.response?.data) {
            console.error('📋 Feature error details:', JSON.stringify(error.response.data, null, 2));
          }
        }
      }
    }

    return featureIds;
  }

  async batchProcess(sources) {
    console.log(`\n🔄 Processing ${sources.length} property sources...`);
    const results = [];

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      console.log(`\n[${i + 1}/${sources.length}] Processing source...`);

      try {
        const result = await this.processPropertySource(source);
        results.push({ success: true, data: result });
        console.log('✅ Source processed successfully');
      } catch (error) {
        console.error('❌ Error processing source:', error.message);
        results.push({ success: false, error: error.message, source });
      }

      // Add delay between requests
      if (i < sources.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🏠 Property Ingestion Tool

Usage:
  node main.js <source1> [source2] [source3] ...

Sources can be:
  - URLs (https://www.encuentra24.com/...)
  - Text descriptions (wrapped in quotes)
  - File paths containing property data

Environment Variables:
  STRAPI_URL=http://localhost:1337
  STRAPI_API_TOKEN=your_strapi_token
  GEMINI_API_KEY=your_gemini_api_key

Examples:
  node main.js "https://www.encuentra24.com/panama-es/..."
  node main.js "Se vende hermoso dúplex en El Avance..."
  node main.js property1.txt property2.txt
    `);
    process.exit(1);
  }

  // Validate environment variables
  if (!CONFIG.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY environment variable is required');
    console.error('💡 Get your API key from: https://makersuite.google.com/app/apikey');
    process.exit(1);
  }

  if (!CONFIG.STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN environment variable is required');
    console.error('💡 Create a token in Strapi admin: Settings → API Tokens');
    process.exit(1);
  }

  const service = new PropertyIngestionService();
  await service.initialize();

  // Process sources
  const sources = [];
  for (const arg of args) {
    if (arg.startsWith('http')) {
      sources.push(arg);
    } else if (arg.endsWith('.txt') || arg.endsWith('.json')) {
      try {
        const content = await fs.readFile(arg, 'utf-8');
        sources.push(content);
      } catch (error) {
        console.error(`❌ Error reading file ${arg}:`, error.message);
      }
    } else {
      sources.push(arg);
    }
  }

  const results = await service.batchProcess(sources);

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n📊 Processing Summary:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed sources:');
    results.filter(r => !r.success).forEach((result, i) => {
      console.log(`${i + 1}. ${result.error}`);
    });
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PropertyIngestionService };