'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dictionary } from '@/lib/dictionaries'

export interface SearchFormData {
  q: string
  propertyType: string
  minPrice: string
  maxPrice: string
  minBedrooms: string
}

interface SearchFormProps {
  variant?: 'hero' | 'filters'
  initialData?: Partial<SearchFormData>
  showAdvancedByDefault?: boolean
  onSearch?: (data: SearchFormData) => void
  className?: string
  dict?: Dictionary
}

export default function SearchForm({
  variant = 'filters',
  initialData = {},
  showAdvancedByDefault = false,
  onSearch,
  className = '',
  dict
}: SearchFormProps) {
  const router = useRouter()
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(showAdvancedByDefault)
  
  const [formData, setFormData] = useState<SearchFormData>({
    q: initialData.q || '',
    propertyType: initialData.propertyType || '',
    minPrice: initialData.minPrice || '',
    maxPrice: initialData.maxPrice || '',
    minBedrooms: initialData.minBedrooms || ''
  })

  const updateFormData = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    
    // Add search parameters if they have values
    if (formData.q.trim()) {
      searchParams.set('q', formData.q.trim())
    }
    
    if (formData.propertyType) {
      searchParams.set('propertyType', formData.propertyType)
    }
    
    if (formData.minPrice) {
      searchParams.set('minPrice', formData.minPrice)
    }
    
    if (formData.maxPrice) {
      searchParams.set('maxPrice', formData.maxPrice)
    }
    
    if (formData.minBedrooms) {
      searchParams.set('minBedrooms', formData.minBedrooms)
    }
    
    // Call custom onSearch handler if provided, otherwise navigate
    if (onSearch) {
      onSearch(formData)
    } else {
      const queryString = searchParams.toString()
      router.push(`/properties${queryString ? `?${queryString}` : ''}`)
    }
  }

  const handleClearFilters = () => {
    setFormData({
      q: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: ''
    })
    
    if (onSearch) {
      onSearch({
        q: '',
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        minBedrooms: ''
      })
    } else {
      router.push('/properties')
    }
  }

  const isHeroVariant = variant === 'hero'

  if (isHeroVariant) {
    // Hero section variant - more compact design
    return (
      <div className={`bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 shadow-lg ${className}`}>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              {dict?.search?.label || 'Buscar propiedades'}
            </label>
            <input
              type="text"
              id="search"
              value={formData.q}
              onChange={(e) => updateFormData('q', e.target.value)}
              placeholder={dict?.search?.placeholder || "Ubicación, precio, características..."}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="md:w-48">
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              {dict?.filter?.propertyType || 'Tipo de propiedad'}
            </label>
            <select
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => updateFormData('propertyType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">{dict?.filter?.allTypes || 'Todos los tipos'}</option>
              <option value="casa">{dict?.filter?.house || 'Casa'}</option>
              <option value="apartamento">{dict?.filter?.apartment || 'Apartamento'}</option>
              <option value="terreno">{dict?.filter?.land || 'Terreno'}</option>
              <option value="comercial">{dict?.filter?.commercial || 'Comercial'}</option>
              <option value="sale">{dict?.property?.forSale || 'En Venta'}</option>
              <option value="rent">{dict?.property?.forRent || 'En Alquiler'}</option>
            </select>
          </div>

          {/* Advanced Search Button */}
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            title="Búsqueda avanzada"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {dict?.search?.button || 'Buscar'}
          </button>
        </div>

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{dict?.filter?.advancedSearch || 'Búsqueda Avanzada'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.filter?.minPrice || 'Precio mínimo'}
                </label>
                <input
                  type="number"
                  placeholder="$0"
                  value={formData.minPrice}
                  onChange={(e) => updateFormData('minPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.filter?.maxPrice || 'Precio máximo'}
                </label>
                <input
                  type="number"
                  placeholder="$999,999,999"
                  value={formData.maxPrice}
                  onChange={(e) => updateFormData('maxPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.property?.bedrooms || 'Habitaciones'}
                </label>
                <select 
                  value={formData.minBedrooms}
                  onChange={(e) => updateFormData('minBedrooms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">{dict?.filter?.any || 'Cualquiera'}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Filters variant - full featured design for properties page
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Query */}
        <div className="md:col-span-2">
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
            {dict?.searchForm?.searchProperties || 'Buscar propiedades'}
          </label>
          <input
            type="text"
            id="searchQuery"
            placeholder={dict?.searchForm?.searchPlaceholder || 'Ubicación, características...'}
            value={formData.q}
            onChange={(e) => updateFormData('q', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        {/* Property Type */}
        <div>
          <label htmlFor="propertyTypeFilter" className="block text-sm font-medium text-gray-700 mb-2">
            {dict?.searchForm?.type || 'Tipo'}
          </label>
          <select 
            id="propertyTypeFilter" 
            value={formData.propertyType} 
            onChange={(e) => updateFormData('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">{dict?.searchForm?.allTypes || 'Todos'}</option>
            <option value="sale">{dict?.searchForm?.forSale || 'En Venta'}</option>
            <option value="rent">{dict?.searchForm?.forRent || 'En Alquiler'}</option>
          </select>
        </div>
        
        {/* Bedrooms */}
        <div>
          <label htmlFor="bedroomsFilter" className="block text-sm font-medium text-gray-700 mb-2">
            {dict?.searchForm?.bedrooms || 'Habitaciones'}
          </label>
          <select 
            id="bedroomsFilter" 
            value={formData.minBedrooms} 
            onChange={(e) => updateFormData('minBedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">{dict?.searchForm?.any || 'Cualquiera'}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        
        {/* Min Price */}
        <div>
          <label htmlFor="minPriceFilter" className="block text-sm font-medium text-gray-700 mb-2">
            {dict?.searchForm?.minPrice || 'Precio mín.'}
          </label>
          <input
            type="number"
            id="minPriceFilter"
            placeholder="$0"
            value={formData.minPrice}
            onChange={(e) => updateFormData('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        {/* Max Price */}
        <div>
          <label htmlFor="maxPriceFilter" className="block text-sm font-medium text-gray-700 mb-2">
            {dict?.searchForm?.maxPrice || 'Precio máx.'}
          </label>
          <input
            type="number"
            id="maxPriceFilter"
            placeholder={dict?.searchForm?.noLimit || 'Sin límite'}
            value={formData.maxPrice}
            onChange={(e) => updateFormData('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button 
          onClick={handleSearch}
          className="flex-1 bg-yellow-700 text-white px-6 py-2 rounded-md hover:bg-yellow-800 transition-colors duration-200 font-medium"
        >
          {dict?.searchForm?.searchButton || 'Buscar Propiedades'}
        </button>
        <button 
          onClick={handleClearFilters}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          {dict?.searchForm?.clearFilters || 'Limpiar Filtros'}
        </button>
      </div>
    </div>
  )
} 