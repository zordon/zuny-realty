import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import PropertyCard from '@/components/PropertyCard'
import { Property, PropertyType } from '@/types'

// Sample featured properties data
const featuredProperties: Property[] = [
  {
    id: '1',
    title: 'Hermosa Casa en Penonome con Dos Lotes',
    address: 'Penonomé, Coclé',
    price: 325000,
    currency: 'USD',
    bedrooms: 5,
    bathrooms: 5,
    areaSqFt: 2990,
    description: 'Hermosa y espaciosa casa con dos lotes en una ubicación privilegiada. Perfecta para familias grandes.',
    images: ['/api/placeholder/400/300'],
    type: PropertyType.SALE,
    features: ['Amplio jardín', 'Garage para 2 carros', 'Terraza', 'Cocina moderna'],
    agentName: 'Zuny Rodriguez',
    agentPhone: '+507-6273-5027',
    agentEmail: 'admin@zunyrealty.com',
    isFeatured: true,
  },
  {
    id: '2', 
    title: 'Apartamento de Lujo en Bella Vista',
    address: 'Bella Vista, Ciudad de Panamá',
    price: 315000,
    currency: 'USD',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1700,
    description: 'Apartamento moderno con vista panorámica de la ciudad. Acabados de lujo y excelente ubicación.',
    images: ['/api/placeholder/400/300'],
    type: PropertyType.SALE,
    features: ['Vista panorámica', 'Gimnasio', 'Piscina', 'Seguridad 24/7'],
    agentName: 'Zuny Rodriguez',
    agentPhone: '+507-6273-5027',
    agentEmail: 'admin@zunyrealty.com',
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Casa de Playa en Las Lajas',
    address: 'Chame, Panamá Oeste',
    price: 399000,
    currency: 'USD',
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 3229,
    description: 'Hermosa casa frente al mar con acceso directo a la playa. Ideal para vacaciones y relajación.',
    images: ['/api/placeholder/400/300'],
    type: PropertyType.SALE,
    features: ['Frente al mar', 'Terraza amplia', 'BBQ área', 'Parking'],
    agentName: 'Zuny Rodriguez',
    agentPhone: '+507-6273-5027',
    agentEmail: 'admin@zunyrealty.com',
    isFeatured: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Properties Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Inmuebles <span className="text-blue-700">Destacados</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre nuestras propiedades más exclusivas, cuidadosamente seleccionadas para ofrecerte las mejores opciones
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/properties"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
              >
                Ver Todas las Propiedades
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  ¿Por qué elegir <span className="text-blue-700">ZuR Real Estate?</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Con años de experiencia en el mercado inmobiliario panameño, ofrecemos un servicio personalizado y profesional para ayudarte a encontrar la propiedad de tus sueños.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Servicio Personalizado</h3>
                      <p className="text-gray-600">Atención individual adaptada a tus necesidades específicas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Amplio Portafolio</h3>
                      <p className="text-gray-600">Desde apartamentos hasta casas de playa y propiedades comerciales</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Experiencia Local</h3>
                      <p className="text-gray-600">Conocimiento profundo del mercado inmobiliario panameño</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="/api/placeholder/600/400"
                  alt="ZuR Real Estate Office"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute inset-0 bg-blue-700 bg-opacity-10 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para encontrar tu hogar ideal?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Contáctanos hoy mismo y te ayudaremos a encontrar la propiedad perfecta para ti
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+507-6273-5027"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-700 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Llamar Ahora
                </a>
                
                <a
                  href="https://wa.me/50762735027"
                  className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
                
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Formulario de Contacto
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
