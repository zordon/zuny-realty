import Header from '@/components/Header'
import Footer from '@/components/Footer'
// PropertyCard is now used within PropertyFiltersAndList
// import PropertyCard from '@/components/PropertyCard' 
import { Property } from '@/types'
import { fetchProperties } from '@/lib/api'
import PropertyFiltersAndList from '@/components/PropertyFiltersAndList'; // Import the new component

// const properties: Property[] = [ ... ] // Keep commented out or remove

export default async function PropertiesPage() {
  const allProperties: Property[] = await fetchProperties();

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

        {/* Render the new component with filters and list */}
        <PropertyFiltersAndList initialProperties={allProperties} />

        {/* The Filters and Properties Grid JSX has been moved to PropertyFiltersAndList.tsx */}
        {/* The "Load More" button has also been moved. */}
        
      </main>
      
      <Footer />
    </div>
  )
} 