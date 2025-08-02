#!/usr/bin/env node

const { PropertyIngestionService } = require('./main');

// Your example data
const EXAMPLE_SOURCES = [
  // Encuentra24 URL example
  'https://www.encuentra24.com/panama-es/bienes-raices-venta-de-propiedades-apartamentos/vista-del-mar-29f-venta-full-amoblado-vista-ciudad-114mts-2recs-2b-area-bancaria/30740922',
  
  // WhatsApp text example
  `Se vende hermoso y espacioso dúplex en El Avance 1, Bethania de 430 mts.

Distribución en la Planta Baja:
-Recibidor.
-Baño de visita.
-Espaciosa sala
-Comedor con mueble de madera empotrado para almacenamiento.
-Depósito con puerta bajo la escalera.  
-Cocina cerrada con espacio para nevera y freezer.
-Lavandería interna con closet.
-Lavandería externa con tinas, tendedero y depósitos.
-Cuarto de servicio con closet.
-Baño de servicio con entrada independiente del cuarto. 
-Sala den. 
-Espaciosa terraza techada.
-Baño completo en terraza.
-Jardín (frontal y en el patio).

Distribución en la Planta Alta:
-Recámara principal con espacioso walk-in closet y cuarto de baño con ducha, jacuzzi para 2 personas, lavamanos doble y closet para ropa blanca.
-Recámara secundaria con closet de pared y baño privado.
-Tercera recámara con closet de pared y baño privado.
-Cuarta recámara o cuarto estudio con closet.
-Closet de ropa blanca en el pasillo.

El duplex cuenta con estacionamiento techado para 2 autos y espacio extra para 2 autos más, tanque de reserva de agua, aires acondicionados en todas las habitaciones y en el den. Posee una cómoda distribución con privacidad en todas las áreas, buena ventilación e iluminación. Los techos son altos con elegantes trabajos en gypsum. La escalera es de granito y cuenta con doble altura y tragaluz. El duplex además tiene verjas en todas las áreas y está ubicado en una privilegiada zona residencial, tranquila y familiar, con acceso a las principales áreas de la ciudad. 

Precio de venta US$410k (rebajado)`
];

async function runExamples() {
  console.log('🏠 Running Property Ingestion Examples\n');
  
  const service = new PropertyIngestionService();
  await service.initialize();
  
  const results = await service.batchProcess(EXAMPLE_SOURCES);
  
  console.log('\n📊 Results Summary:');
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (result.success) {
      console.log(`   Property ID: ${result.data.id}`);
      console.log(`   Title: ${result.data.attributes.title}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  });
}

if (require.main === module) {
  runExamples().catch(console.error);
}