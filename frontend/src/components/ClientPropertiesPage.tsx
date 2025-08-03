'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Property, PropertyType } from '@/types'
import SearchForm, { SearchFormData } from './SearchForm'
import PropertyCard from './PropertyCard'
import { Dictionary } from '@/lib/dictionaries'
import { fetchPropertiesWithPagination, PropertySearchParams } from '@/lib/api'

interface ClientPropertiesPageProps {
  allProperties: Property[]
  dict: Dictionary
  lang: 'en' | 'es'
}

export default function ClientPropertiesPage({ allProperties, dict, lang }: ClientPropertiesPageProps) {
  const searchParams = useSearchParams()
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties)
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>(allProperties)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalProperties, setTotalProperties] = useState(allProperties.length)
  
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
    setDisplayedProperties(filtered)
    setCurrentPage(1)
    setHasMore(filtered.length > 0)
    setTotalProperties(filtered.length)
  }, [allProperties, searchParamsForAPI])

  const hasActiveFilters = Object.keys(searchParamsForAPI).length > 0

  // Load more properties function
  const loadMoreProperties = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const nextPage = currentPage + 1
      const searchParamsForAPI: PropertySearchParams = {
        q: searchParams.get('q') || undefined,
        propertyType: searchParams.get('propertyType') || undefined,
        minBedrooms: searchParams.get('minBedrooms') ? parseInt(searchParams.get('minBedrooms')!, 10) : undefined,
        minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined,
        page: nextPage,
        limit: 12 // Load 12 properties per page
      }

      const { properties: newProperties, pagination } = await fetchPropertiesWithPagination(searchParamsForAPI, lang === 'en' ? 'en' : 'es-419')
      
      if (newProperties.length > 0) {
        setDisplayedProperties(prev => [...prev, ...newProperties])
        setCurrentPage(nextPage)
        setHasMore(nextPage < pagination.pageCount)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {dict.properties.title} <span className="text-yellow-700">{dict.properties.properties}</span>
        </h1>
        
        {hasActiveFilters ? (
          <div className="mb-4">
            <p className="text-lg text-gray-600 mb-2">
              {dict.properties.searchResults} ({filteredProperties.length} {filteredProperties.length === 1 ? dict.properties.propertyFound : dict.properties.propertiesFound})
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              {searchParamsForAPI.q && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  &quot;{searchParamsForAPI.q}&quot;
                </span>
              )}
              {searchParamsForAPI.propertyType && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {searchParamsForAPI.propertyType === 'sale' ? dict.properties.forSale : dict.properties.forRent}
                </span>
              )}
              {searchParamsForAPI.minBedrooms && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {searchParamsForAPI.minBedrooms}+ {dict.properties.bedrooms}
                </span>
              )}
              {searchParamsForAPI.minPrice && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {dict.properties.from} ${searchParamsForAPI.minPrice.toLocaleString()}
                </span>
              )}
              {searchParamsForAPI.maxPrice && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {dict.properties.to} ${searchParamsForAPI.maxPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dict.properties.description}
          </p>
        )}
      </div>

      {/* Search Form */}
      <SearchForm 
        variant="filters" 
        initialData={initialSearchData}
        className="mb-8"
        dict={dict}
        lang={lang}
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} dict={dict} lang={lang} />
          ))
        ) : (
          <p className="text-center text-gray-600 md:col-span-2 lg:col-span-3">
            {dict.properties.noResults}
          </p>
        )}
      </div>

      {/* Load More Button */}
      {displayedProperties.length > 0 && (
        <div className="text-center mt-12">
          {hasMore ? (
            <button 
              onClick={loadMoreProperties}
              disabled={isLoading}
              className="bg-yellow-700 text-white px-8 py-3 rounded-lg hover:bg-yellow-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? dict.properties.loading : dict.properties.loadMore}
            </button>
          ) : (
            <p className="text-gray-600 text-lg">
              {dict.properties.noMoreProperties}
            </p>
          )}
        </div>
      )}
    </>
  )
} 