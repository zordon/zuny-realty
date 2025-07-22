import Header from '@/components/Header'
import Footer from '@/components/Footer'
// PropertyCard is now used within PropertyFiltersAndList
// import PropertyCard from '@/components/PropertyCard' 
import { Property } from '@/types'
import { fetchProperties, PropertySearchParams } from '@/lib/api'
import PropertyFiltersAndList from '@/components/PropertyFiltersAndList'; // Import the new component

interface PropertiesPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  // Parse search parameters
  const searchParamsForAPI: PropertySearchParams = {}
  
  if (searchParams.q && typeof searchParams.q === 'string') {
    searchParamsForAPI.q = searchParams.q
  }
  
  if (searchParams.propertyType && typeof searchParams.propertyType === 'string') {
    searchParamsForAPI.propertyType = searchParams.propertyType
  }
  
  if (searchParams.minBedrooms && typeof searchParams.minBedrooms === 'string') {
    const minBedrooms = parseInt(searchParams.minBedrooms, 10)
    if (!isNaN(minBedrooms)) {
      searchParamsForAPI.minBedrooms = minBedrooms
    }
  }
  
  if (searchParams.minPrice && typeof searchParams.minPrice === 'string') {
    const minPrice = parseInt(searchParams.minPrice, 10)
    if (!isNaN(minPrice)) {
      searchParamsForAPI.minPrice = minPrice
    }
  }
  
  if (searchParams.maxPrice && typeof searchParams.maxPrice === 'string') {
    const maxPrice = parseInt(searchParams.maxPrice, 10)
    if (!isNaN(maxPrice)) {
      searchParamsForAPI.maxPrice = maxPrice
    }
  }
  
  // Fetch properties with search parameters
  const allProperties: Property[] = await fetchProperties(
    Object.keys(searchParamsForAPI).length > 0 ? searchParamsForAPI : undefined
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nuestras <span className="text-yellow-700">Propiedades</span>
          </h1>
          
          {Object.keys(searchParamsForAPI).length > 0 ? (
            <div className="mb-4">
              <p className="text-lg text-gray-600 mb-2">
                Resultados de búsqueda ({allProperties.length} {allProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'})
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {searchParamsForAPI.q && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    "{searchParamsForAPI.q}"
                  </span>
                )}
                {searchParamsForAPI.propertyType && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    {searchParamsForAPI.propertyType === 'sale' ? 'En Venta' : 'En Alquiler'}
                  </span>
                )}
                {searchParamsForAPI.minBedrooms && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    {searchParamsForAPI.minBedrooms}+ habitaciones
                  </span>
                )}
                {searchParamsForAPI.minPrice && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    Desde ${searchParamsForAPI.minPrice.toLocaleString()}
                  </span>
                )}
                {searchParamsForAPI.maxPrice && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    Hasta ${searchParamsForAPI.maxPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora nuestra amplia selección de propiedades en las mejores ubicaciones de Panamá
            </p>
          )}
        </div>

        {/* Render the new component with filters and list */}
        <PropertyFiltersAndList 
          initialProperties={allProperties}
          searchQuery={searchParamsForAPI.q}
          initialPropertyType={searchParamsForAPI.propertyType}
          initialMinBedrooms={searchParamsForAPI.minBedrooms}
          initialMinPrice={searchParamsForAPI.minPrice}
          initialMaxPrice={searchParamsForAPI.maxPrice}
        />

        {/* The Filters and Properties Grid JSX has been moved to PropertyFiltersAndList.tsx */}
        {/* The "Load More" button has also been moved. */}
        
      </main>
      
      <Footer />
    </div>
  )
} 