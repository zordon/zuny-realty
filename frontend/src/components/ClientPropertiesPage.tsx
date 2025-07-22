'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Property, PropertyType } from '@/types'
import SearchForm, { SearchFormData } from './SearchForm'
import PropertyCard from './PropertyCard'

interface ClientPropertiesPageProps {
  allProperties: Property[]
}

export default function ClientPropertiesPage({ allProperties }: ClientPropertiesPageProps) {
  const searchParams = useSearchParams()
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties)
  
  // Parse search parameters from URL
  const searchParamsForAPI = useMemo(() => {
    const params: {
      q?: string
      propertyType?: string
      minBedrooms?: number
      minPrice?: number
      maxPrice?: number
    } = {}
    
    const q = searchParams.get('q')
    if (q) params.q = q
    
    const propertyType = searchParams.get('propertyType')
    if (propertyType) params.propertyType = propertyType
    
    const minBedrooms = searchParams.get('minBedrooms')
    if (minBedrooms) {
      const parsed = parseInt(minBedrooms, 10)
      if (!isNaN(parsed)) params.minBedrooms = parsed
    }
    
    const minPrice = searchParams.get('minPrice')
    if (minPrice) {
      const parsed = parseInt(minPrice, 10)
      if (!isNaN(parsed)) params.minPrice = parsed
    }
    
    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) {
      const parsed = parseInt(maxPrice, 10)
      if (!isNaN(parsed)) params.maxPrice = parsed
    }
    
    return params
  }, [searchParams])

  // Get initial search form data from URL params
  const initialSearchData: Partial<SearchFormData> = useMemo(() => ({
    q: searchParamsForAPI.q || '',
    propertyType: searchParamsForAPI.propertyType || '',
    minBedrooms: searchParamsForAPI.minBedrooms ? searchParamsForAPI.minBedrooms.toString() : '',
    minPrice: searchParamsForAPI.minPrice ? searchParamsForAPI.minPrice.toString() : '',
    maxPrice: searchParamsForAPI.maxPrice ? searchParamsForAPI.maxPrice.toString() : ''
  }), [searchParamsForAPI])

  // Filter properties based on search parameters
  useEffect(() => {
    let filtered = [...allProperties]

    // Filter by search query (title, address, description)
    if (searchParamsForAPI.q) {
      const query = searchParamsForAPI.q.toLowerCase()
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)
      )
    }

    // Filter by property type
    if (searchParamsForAPI.propertyType) {
      const targetType = searchParamsForAPI.propertyType === 'sale' ? PropertyType.SALE : PropertyType.RENT
      filtered = filtered.filter(property => property.propertyType === targetType)
    }

    // Filter by minimum bedrooms
    if (searchParamsForAPI.minBedrooms !== undefined) {
      filtered = filtered.filter(property => property.bedrooms >= searchParamsForAPI.minBedrooms!)
    }

    // Filter by price range
    if (searchParamsForAPI.minPrice !== undefined) {
      filtered = filtered.filter(property => property.price >= searchParamsForAPI.minPrice!)
    }

    if (searchParamsForAPI.maxPrice !== undefined) {
      filtered = filtered.filter(property => property.price <= searchParamsForAPI.maxPrice!)
    }

    setFilteredProperties(filtered)
  }, [allProperties, searchParamsForAPI])

  const hasActiveFilters = Object.keys(searchParamsForAPI).length > 0

  return (
    <>
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Nuestras <span className="text-yellow-700">Propiedades</span>
        </h1>
        
        {hasActiveFilters ? (
          <div className="mb-4">
            <p className="text-lg text-gray-600 mb-2">
              Resultados de búsqueda ({filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'})
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {searchParamsForAPI.q && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  &quot;{searchParamsForAPI.q}&quot;
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

      {/* Search Form */}
      <SearchForm 
        variant="filters" 
        initialData={initialSearchData}
        className="mb-8"
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-center text-gray-600 md:col-span-2 lg:col-span-3">
            No se encontraron propiedades que coincidan con sus criterios de búsqueda.
          </p>
        )}
      </div>

      {/* Load More - This could be implemented for pagination if needed */}
      <div className="text-center mt-12">
        <button className="bg-yellow-700 text-white px-8 py-3 rounded-lg hover:bg-yellow-800 transition-colors duration-200 font-medium">
          Cargar Más Propiedades (Funcionalidad Pendiente)
        </button>
      </div>
    </>
  )
} 