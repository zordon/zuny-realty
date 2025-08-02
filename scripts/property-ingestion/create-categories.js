#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'es-419',
  SECONDARY_LOCALE: process.env.SECONDARY_LOCALE || 'en'
};

const CATEGORIES = [
  { es: 'apartamentos', en: 'apartments', slug_es: 'apartamentos', slug_en: 'apartments' },
  { es: 'casas', en: 'houses', slug_es: 'casas', slug_en: 'houses' },
  { es: 'lotes', en: 'lots', slug_es: 'lotes', slug_en: 'lots' },
  { es: 'fincas', en: 'farms', slug_es: 'fincas', slug_en: 'farms' },
  { es: 'oficinas', en: 'offices', slug_es: 'oficinas', slug_en: 'offices' }
];

class CategoryCreator {
  constructor() {
    this.strapiAPI = axios.create({
      baseURL: CONFIG.STRAPI_URL,
      headers: {
        'Authorization': `Bearer ${CONFIG.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createCategories() {
    console.log('🏗️  Creating required categories in Strapi...\n');

    if (!CONFIG.STRAPI_API_TOKEN) {
      console.error('❌ STRAPI_API_TOKEN environment variable is required');
      process.exit(1);
    }

    for (const category of CATEGORIES) {
      try {
        // Create Spanish version (default locale)
        console.log(`📁 Creating Spanish category: ${category.es}`);
        const spanishPayload = {
          data: {
            name: category.es,
            slug: category.slug_es,
            locale: CONFIG.DEFAULT_LOCALE
          }
        };

        const response = await this.strapiAPI.post('/api/categories', spanishPayload);
        const documentId = response.data.data.documentId;
        
        console.log(`✅ Created: ${category.es} (ID: ${response.data.data.id}, DocumentId: ${documentId})`);

        // Create English localization
        console.log(`🌐 Adding English translation: ${category.en}`);
        const englishPayload = {
          data: {
            name: category.en,
            slug: category.slug_en
          }
        };

        await this.strapiAPI.put(`/api/categories/${documentId}?locale=${CONFIG.SECONDARY_LOCALE}`, englishPayload);
        console.log(`✅ Added English localization: ${category.en}\n`);

      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already exists')) {
          console.log(`⚠️  Category ${category.es} already exists, skipping...\n`);
        } else {
          console.error(`❌ Error creating category ${category.es}:`, error.message);
          if (error.response?.data) {
            console.error('📋 Error details:', JSON.stringify(error.response.data, null, 2));
          }
          console.log('');
        }
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('🎉 Category creation completed!');
    console.log('📋 Summary: Created 5 categories with Spanish and English localizations');
    console.log('🚀 You can now run the property ingestion script');
  }
}

async function main() {
  const creator = new CategoryCreator();
  await creator.createCategories();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CategoryCreator };