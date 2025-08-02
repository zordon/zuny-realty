#!/usr/bin/env node

const CONFIG = require('./config');

// Demo showing how feature translation works
function demonstrateFeatureTranslation() {
  console.log('🌐 Feature Translation Demo\n');
  
  const sampleSpanishFeatures = [
    'Piscina',
    'Gimnasio', 
    'Seguridad 24 horas',
    'Estacionamiento',
    'Aire acondicionado',
    'Balcón',
    'Terraza',
    'Jardín',
    'Ascensor',
    'Jacuzzi', // Not in predefined mapping - will use AI translation
    'Vista al mar', // Not in predefined mapping
    'Área de BBQ'
  ];

  console.log('📋 Feature Translation Results:\n');
  
  sampleSpanishFeatures.forEach(feature => {
    const featureLowerCase = feature.toLowerCase().trim();
    const englishTranslation = CONFIG.FEATURE_MAPPING[featureLowerCase];
    
    if (englishTranslation) {
      console.log(`✅ ${feature} → ${englishTranslation} (predefined)`);
    } else {
      console.log(`🤖 ${feature} → [Will use AI translation] (not in mapping)`);
    }
  });

  console.log('\n📚 Predefined Feature Mappings:');
  console.log('────────────────────────────────');
  Object.entries(CONFIG.FEATURE_MAPPING).forEach(([spanish, english]) => {
    console.log(`${spanish} → ${english}`);
  });

  console.log('\n💡 How it works:');
  console.log('1. Check predefined mappings first (more accurate)');
  console.log('2. Fall back to AI translation for unmapped features');
  console.log('3. Store both Spanish and English in Strapi with i18n');
  console.log('4. Avoid duplicates by checking existing features');
}

if (require.main === module) {
  demonstrateFeatureTranslation();
}