#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const CONFIG_FILE = require('./config');

// Simple fuzzy matching function
function calculateSimilarity(str1, str2) {
  const a = str1.toLowerCase();
  const b = str2.toLowerCase();
  
  if (a === b) return 1;
  
  // Levenshtein distance implementation
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i] + 1,     // deletion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLength = Math.max(a.length, b.length);
  const distance = matrix[b.length][a.length];
  return (maxLength - distance) / maxLength;
}

// Predefined category mapping
const CATEGORY_MAPPING = {
  // Spanish variations to standard categories
  'apartamento': 'apartamentos',
  'apartamentos': 'apartamentos',
  'apart': 'apartamentos',
  'depto': 'apartamentos',
  'departamento': 'apartamentos',
  'departamentos': 'apartamentos',
  'piso': 'apartamentos',
  'pisos': 'apartamentos',
  'condominio': 'apartamentos',
  'condominios': 'apartamentos',
  'penthouse': 'apartamentos',
  'loft': 'apartamentos',
  'estudio': 'apartamentos',
  
  'casa': 'casas',
  'casas': 'casas',
  'vivienda': 'casas',
  'viviendas': 'casas',
  'residencia': 'casas',
  'residencias': 'casas',
  'chalet': 'casas',
  'duplex': 'casas',
  'dúplex': 'casas',
  'villa': 'casas',
  'villas': 'casas',
  'townhouse': 'casas',
  'quintas': 'casas',
  'quinta': 'casas',
  
  'lote': 'lotes',
  'lotes': 'lotes',
  'terreno': 'lotes',
  'terrenos': 'lotes',
  'solar': 'lotes',
  'solares': 'lotes',
  'parcela': 'lotes',
  'parcelas': 'lotes',
  'predio': 'lotes',
  'predios': 'lotes',
  'lot': 'lotes',
  'lots': 'lotes',
  'land': 'lotes',
  
  'finca': 'fincas',
  'fincas': 'fincas',
  'hacienda': 'fincas',
  'haciendas': 'fincas',
  'granja': 'fincas',
  'granjas': 'fincas',
  'farm': 'fincas',
  'farms': 'fincas',
  'ranch': 'fincas',
  'rancho': 'fincas',
  'ranchos': 'fincas',
  'campo': 'fincas',
  'rural': 'fincas',
  
  'oficina': 'oficinas',
  'oficinas': 'oficinas',
  'office': 'oficinas',
  'offices': 'oficinas',
  'edificio': 'oficinas',
  'edificios': 'oficinas',
  'local': 'oficinas',
  'locales': 'oficinas',
  'comercial': 'oficinas',
  'comerciales': 'oficinas',
  'negocio': 'oficinas',
  'negocios': 'oficinas',
  'consultorio': 'oficinas',
  'consultorios': 'oficinas',
  'clinica': 'oficinas',
  'clinicas': 'oficinas',
  'centro': 'oficinas'
};

// Configuration
const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  DEFAULT_LOCALE: 'es-419',
  SECONDARY_LOCALE: 'en'
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

class PropertyIngestionService {
  constructor() {
    this.existingFeatures = new Map(); // stores: name -> {id, documentId, locales: {es: name, en: name}}
    this.existingCategories = new Map(); // stores: name -> {id, documentId, locales: {es: name, en: name}}
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
    await this.validateRequiredCategories();
  }

  async loadExistingData() {
    try {
      // Test Strapi connection first
      await this.strapiAPI.get('/api/features?pagination[pageSize]=1');
      
      // Load existing features from both locales
      await this.loadFeaturesByLocale(CONFIG.DEFAULT_LOCALE);
      await this.loadFeaturesByLocale(CONFIG.SECONDARY_LOCALE);
      console.log(`📋 Loaded ${this.existingFeatures.size} existing features`);

      // Load existing categories from both locales
      await this.loadCategoriesByLocale(CONFIG.DEFAULT_LOCALE);
      await this.loadCategoriesByLocale(CONFIG.SECONDARY_LOCALE);
      console.log(`📁 Loaded ${this.existingCategories.size} existing categories`);
      
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

  async loadFeaturesByLocale(locale) {
    try {
      const response = await this.strapiAPI.get(`/api/features?locale=${locale}&pagination[pageSize]=1000`);
      if (response.data && response.data.data) {
        response.data.data.forEach(feature => {
          if (feature.name) {
            const name = feature.name.toLowerCase();
            const documentId = feature.documentId;
            
            if (!this.existingFeatures.has(name)) {
              this.existingFeatures.set(name, {
                id: feature.id,
                documentId: documentId,
                locales: {}
              });
            }
            
            // Store the locale-specific name
            this.existingFeatures.get(name).locales[locale] = feature.name;
          }
        });
      }
    } catch (error) {
      console.log(`⚠️  Could not load features for locale ${locale}:`, error.message);
    }
  }

  async loadCategoriesByLocale(locale) {
    try {
      const response = await this.strapiAPI.get(`/api/categories?locale=${locale}&pagination[pageSize]=1000`);
      if (response.data && response.data.data) {
        response.data.data.forEach(category => {
          if (category.name) {
            const name = category.name.toLowerCase();
            const documentId = category.documentId;
            
            if (!this.existingCategories.has(name)) {
              this.existingCategories.set(name, {
                id: category.id,
                documentId: documentId,
                locales: {}
              });
            }
            
            // Store the locale-specific name
            this.existingCategories.get(name).locales[locale] = category.name;
          }
        });
      }
    } catch (error) {
      console.log(`⚠️  Could not load categories for locale ${locale}:`, error.message);
    }
  }

  // Fuzzy matching for finding existing entries
  findBestMatch(searchTerm, existingMap, threshold = 0.8) {
    let bestMatch = null;
    let bestScore = 0;
    
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const firstWord = searchWords[0];
    
    for (const [key, data] of existingMap.entries()) {
      // Check if it starts with the first word (as requested)
      if (key.startsWith(firstWord)) {
        const similarity = calculateSimilarity(searchTerm.toLowerCase(), key);
        if (similarity > bestScore && similarity >= threshold) {
          bestScore = similarity;
          bestMatch = { key, data, similarity };
        }
      }
    }
    
    // If no good match starting with first word, try general fuzzy matching
    if (!bestMatch) {
      for (const [key, data] of existingMap.entries()) {
        const similarity = calculateSimilarity(searchTerm.toLowerCase(), key);
        if (similarity > bestScore && similarity >= threshold) {
          bestScore = similarity;
          bestMatch = { key, data, similarity };
        }
      }
    }
    
    return bestMatch;
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
  "category": "apartamentos", "casas", "lotes", "fincas", or "oficinas",
  "features": ["feature1", "feature2", ...],
  "characteristics": [
    {"label": "Área", "value": "114", "suffix": "m²"},
    {"label": "Estacionamiento", "value": "1", "suffix": "espacios"}
  ],
  "location": {
    "neighborhood": "neighborhood name",
    "city": "city name",
    "country": "country name"
  }
}

Property Data:
${typeof rawData === 'object' ? JSON.stringify(rawData, null, 2) : rawData}

IMPORTANT CATEGORY CLASSIFICATION:
- "apartamentos": Any apartment, condo, departamento, penthouse, loft, studio, or unit in a building
- "casas": Any house, villa, duplex, townhouse, chalet, or standalone residential building
- "lotes": Any lot, land, terreno, solar, parcela, or undeveloped property for building
- "fincas": Any farm, ranch, hacienda, granja, or large rural property with agricultural use
- "oficinas": Any office, commercial space, local, edificio, consultorio, clinic, or business premises

Other requirements:
- Extract exact numbers for price, bedrooms, bathrooms
- Identify property type (sale/rent) from context
- Extract all features/amenities mentioned
- Create characteristics for measurable attributes (without "key" field - only use label, value, suffix)
- Be precise with location details
- Currency should be USD or PAB (Panamanian Balboa)
- MUST use one of the 5 categories: apartamentos, casas, lotes, fincas, or oficinas
- Beautify the description
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

      // Process characteristics to remove 'key' field (since it's been removed from Strapi schema)
      const processedCharacteristics = (spanishData.characteristics || []).map(char => {
        const { key, ...characteristicWithoutKey } = char;
        return characteristicWithoutKey;
      });

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
          characteristics: processedCharacteristics,
          isFeatured: false,
          locale: CONFIG.DEFAULT_LOCALE,
          publishedAt: new Date().toISOString()
        }
      };

      console.log('🔍 Creating property with payload:', JSON.stringify(propertyPayload, null, 2));
      
      // Create property in Strapi
      const response = await this.strapiAPI.post('/api/properties', propertyPayload);
      const propertyId = response.data.data.id;
      const documentId = response.data.data.documentId;
      console.log('✅ Property created successfully with ID:', propertyId, 'DocumentId:', documentId);

      // Create English localization using correct Strapi v5 API
      try {
        // Process English characteristics to remove 'key' field
        const processedEnglishCharacteristics = (englishData.characteristics || []).map(char => {
          const { key, ...characteristicWithoutKey } = char;
          return characteristicWithoutKey;
        });

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
            characteristics: processedEnglishCharacteristics,
            isFeatured: false
          }
        };
        
        // Use correct Strapi v5 locale API
        await this.strapiAPI.put(`/api/properties/${documentId}?locale=${CONFIG.SECONDARY_LOCALE}`, englishPayload);
        console.log('✅ Added English localization for property');
      } catch (localizationError) {
        console.log(`⚠️  Created property but failed to add English localization: ${localizationError.message}`);
        console.log('📋 Localization error details:', localizationError.response?.data);
      }

      return response.data.data;
    } catch (error) {
      console.error('❌ Error processing property:', error.message);
      throw error;
    }
  }

  async getOrCreateCategory(spanishName, englishName) {
    // Normalize the category name using predefined mapping
    const normalizedCategory = this.normalizeCategoryName(spanishName);
    
    if (!normalizedCategory) {
      console.log(`⚠️  Unknown category "${spanishName}", defaulting to "casas"`);
      const defaultCategory = 'casas';
      return this.findCategoryId(defaultCategory);
    }
    
    console.log(`🔍 Mapped category: ${spanishName} → ${normalizedCategory}`);
    return this.findCategoryId(normalizedCategory);
  }

  normalizeCategoryName(categoryName) {
    const normalized = categoryName.toLowerCase().trim();
    
    // Check direct mapping first
    if (CATEGORY_MAPPING[normalized]) {
      return CATEGORY_MAPPING[normalized];
    }
    
    // Check if any key contains the category name or vice versa
    for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
      if (key.includes(normalized) || normalized.includes(key)) {
        return value;
      }
    }
    
    // Fuzzy matching for category mapping
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
      const similarity = calculateSimilarity(normalized, key);
      if (similarity > bestScore && similarity >= 0.7) {
        bestScore = similarity;
        bestMatch = value;
      }
    }
    
    return bestMatch;
  }

  findCategoryId(categoryName) {
    // Find the category ID from loaded categories
    const categoryData = this.existingCategories.get(categoryName.toLowerCase());
    
    if (!categoryData) {
      console.error(`❌ Category "${categoryName}" not found in Strapi. Please ensure all 5 categories are created: apartamentos, casas, lotes, fincas, oficinas`);
      throw new Error(`Category "${categoryName}" not found. Please create it in Strapi first.`);
    }
    
    return categoryData.id;
  }

  async validateRequiredCategories() {
    const requiredCategories = ['apartamentos', 'casas', 'lotes', 'fincas', 'oficinas'];
    const missingCategories = [];
    
    for (const category of requiredCategories) {
      if (!this.existingCategories.has(category)) {
        missingCategories.push(category);
      }
    }
    
    if (missingCategories.length > 0) {
      console.error('❌ Missing required categories in Strapi:', missingCategories.join(', '), 'returned from Strapi API', this.existingCategories);
      console.error('💡 Please create these categories with both Spanish and English localizations first');
      throw new Error(`Missing required categories: ${missingCategories.join(', ')}`);
    }
    
    console.log('✅ All required categories found:', requiredCategories.join(', '));
  }

  // Note: Categories must be pre-created in Strapi with both Spanish and English localizations:
  // apartamentos/apartments, casas/houses, lotes/lots, fincas/farms, oficinas/offices

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
      
      // Try fuzzy matching first
      const bestMatch = this.findBestMatch(spanishFeature, this.existingFeatures, 0.8);
      
      if (bestMatch) {
        console.log(`🔍 Found existing feature: ${spanishFeature} matches ${bestMatch.key} (similarity: ${bestMatch.similarity.toFixed(2)})`);
        
              // Check if English translation exists
      if (!bestMatch.data.locales[CONFIG.SECONDARY_LOCALE]) {
        console.log(`🌐 Adding missing English translation for feature: ${englishFeature}`);
        await this.addFeatureTranslation(bestMatch.data.documentId, englishFeature);
      }
        
        featureIds.push(bestMatch.data.id);
      } else {
        try {
          // Create new Spanish feature (default locale)
          const featurePayload = {
            data: {
              name: spanishFeature,
              locale: CONFIG.DEFAULT_LOCALE
            }
          };

          const response = await this.strapiAPI.post('/api/features', featurePayload);
          const featureId = response.data.data.id;
          const documentId = response.data.data.documentId;
          
          // Add to cache
          const key = featureLowerCase;
          this.existingFeatures.set(key, {
            id: featureId,
            documentId: documentId,
            locales: { [CONFIG.DEFAULT_LOCALE]: spanishFeature }
          });
          
          // Create English localization using correct API
          await this.addFeatureTranslation(documentId, englishFeature);
          
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

  async addFeatureTranslation(documentId, englishName) {
    try {
      const englishPayload = {
        data: {
          name: englishName
        }
      };
      
      await this.strapiAPI.put(`/api/features/${documentId}?locale=${CONFIG.SECONDARY_LOCALE}`, englishPayload);
    } catch (localizationError) {
      console.log(`⚠️  Failed to add English translation for feature: ${localizationError.message}`);
    }
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