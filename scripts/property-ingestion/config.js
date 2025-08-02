require('dotenv').config();

module.exports = {
  STRAPI_URL: process.env.STRAPI_URL || 'http://localhost:1337',
  STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // Locale settings
  DEFAULT_LOCALE: 'es',
  SECONDARY_LOCALE: 'en',
  
  // Processing settings
  BATCH_SIZE: 5,
  DELAY_BETWEEN_REQUESTS: 2000, // 2 seconds
  MAX_RETRIES: 3,
  
  // Gemini settings
  GEMINI_MODEL: 'gemini-2.5-flash',
  MAX_CONTENT_LENGTH: 5000,
  
  // Feature mapping for common terms
  FEATURE_MAPPING: {
    'piscina': 'swimming pool',
    'gimnasio': 'gym',
    'seguridad 24 horas': '24/7 security',
    'seguridad 24/7': '24/7 security',
    'seguridad': 'security',
    'estacionamiento': 'parking',
    'estacionamiento techado': 'covered parking',
    'garaje': 'garage',
    'balcón': 'balcony',
    'terraza': 'terrace',
    'terraza techada': 'covered terrace',
    'jardín': 'garden',
    'aire acondicionado': 'air conditioning',
    'a/c': 'air conditioning',
    'calefacción': 'heating',
    'internet': 'internet',
    'wifi': 'wifi',
    'lavandería': 'laundry',
    'lavandería interna': 'internal laundry',
    'lavandería externa': 'external laundry',
    'cocina equipada': 'equipped kitchen',
    'cocina cerrada': 'closed kitchen',
    'cocina abierta': 'open kitchen',
    'ascensor': 'elevator',
    'elevador': 'elevator',
    'portero': 'doorman',
    'conserje': 'concierge',
    'conserjería': 'concierge service',
    'sala de juegos': 'game room',
    'área de bbq': 'bbq area',
    'área social': 'social area',
    'sala de fiestas': 'party room',
    'salón de fiestas': 'party hall',
    'jacuzzi': 'jacuzzi',
    'sauna': 'sauna',
    'spa': 'spa',
    'vista al mar': 'ocean view',
    'vista a la ciudad': 'city view',
    'vista panorámica': 'panoramic view',
    'vista a las montañas': 'mountain view',
    'walk-in closet': 'walk-in closet',
    'closet': 'closet',
    'closet empotrado': 'built-in closet',
    'baño privado': 'private bathroom',
    'baño completo': 'full bathroom',
    'ducha': 'shower',
    'tina': 'bathtub',
    'lavamanos doble': 'double sink',
    'pet friendly': 'pet friendly',
    'mascotas permitidas': 'pets allowed',
    'amoblado': 'furnished',
    'semi amoblado': 'semi furnished',
    'sin amueblar': 'unfurnished',
    'tanque de agua': 'water tank',
    'planta eléctrica': 'power generator',
    'generador': 'generator',
    'cerca de escuelas': 'near schools',
    'cerca del transporte': 'near transportation',
    'área bancaria': 'banking area'
  },
  
  // Category mapping
  CATEGORY_MAPPING: {
    'apartamento': 'apartment',
    'casa': 'house',
    'duplex': 'duplex',
    'dúplex': 'duplex',
    'lote': 'lot',
    'terreno': 'lot',
    'oficina': 'office',
    'local comercial': 'commercial space',
    'bodega': 'warehouse',
    'finca': 'farm',
    'villa': 'villa',
    'penthouse': 'penthouse',
    'estudio': 'studio'
  }
};