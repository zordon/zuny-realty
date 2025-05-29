import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { Property, PropertyType } from '@/types'

// Sample properties data - in production this would come from Strapi
const properties: Property[] = [
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
  {
    id: '4',
    title: 'Apartamento en Alquiler - San Francisco',
    address: 'San Francisco, Ciudad de Panamá',
    price: 1200,
    currency: 'USD',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 950,
    description: 'Moderno apartamento en alquiler en el corazón de San Francisco. Completamente amueblado.',
    images: ['/api/placeholder/400/300'],
    type: PropertyType.RENT,
    features: ['Amueblado', 'Aire acondicionado', 'Balcón', 'Parking'],
    agentName: 'Zuny Rodriguez',
    agentPhone: '+507-6273-5027',
    agentEmail: 'admin@zunyrealty.com',
    isFeatured: false,
  },
]

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestras <span className="text-blue-700">Propiedades</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra amplia selección de propiedades en las mejores ubicaciones de Panamá
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Propiedad
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Todos</option>
                <option value="sale">En Venta</option>
                <option value="rent">En Alquiler</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitaciones
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Máximo
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sin límite</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
                <option value="300000">$300,000</option>
                <option value="500000">$500,000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-200">
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium">
            Cargar Más Propiedades
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 