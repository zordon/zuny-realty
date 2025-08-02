#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const CONFIG = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN
};

const strapiAPI = axios.create({
  baseURL: CONFIG.STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${CONFIG.STRAPI_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testStrapiConnection() {
  console.log('🔍 Testing Strapi API Connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const healthCheck = await strapiAPI.get('/api/features?pagination[pageSize]=1');
    console.log('✅ Basic connection successful');

    // Test creating a simple category
    console.log('\n2. Testing category creation...');
    const categoryPayload = {
      data: {
        name: 'Test Category',
        slug: 'test-category',
        locale: 'es'
      }
    };
    
    console.log('📤 Sending category payload:', JSON.stringify(categoryPayload, null, 2));
    const categoryResponse = await strapiAPI.post('/api/categories', categoryPayload);
    console.log('✅ Category created with ID:', categoryResponse.data.data.id);
    
    // Clean up - delete the test category
    try {
      await strapiAPI.delete(`/api/categories/${categoryResponse.data.data.id}`);
      console.log('🧹 Test category cleaned up');
    } catch (cleanupError) {
      console.log('⚠️  Could not clean up test category:', cleanupError.message);
    }

    // Test creating a simple feature
    console.log('\n3. Testing feature creation...');
    const featurePayload = {
      data: {
        name: 'Test Feature',
        locale: 'es'
      }
    };
    
    console.log('📤 Sending feature payload:', JSON.stringify(featurePayload, null, 2));
    const featureResponse = await strapiAPI.post('/api/features', featurePayload);
    console.log('✅ Feature created with ID:', featureResponse.data.data.id);
    
    // Clean up - delete the test feature
    try {
      await strapiAPI.delete(`/api/features/${featureResponse.data.data.id}`);
      console.log('🧹 Test feature cleaned up');
    } catch (cleanupError) {
      console.log('⚠️  Could not clean up test feature:', cleanupError.message);
    }

    console.log('\n🎉 All Strapi API tests passed!');

  } catch (error) {
    console.error('❌ Strapi API test failed:', error.message);
    
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📋 Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure Strapi is running: yarn backend:dev');
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('💡 Check your STRAPI_API_TOKEN in .env file');
    } else if (error.response?.status === 400) {
      console.error('💡 API payload format issue - check the request structure');
    }
  }
}

if (require.main === module) {
  if (!CONFIG.STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN environment variable is required');
    process.exit(1);
  }
  
  testStrapiConnection();
}

module.exports = { testStrapiConnection };