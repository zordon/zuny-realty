'use client'

import React from 'react';
import PropertyCard from '@/components/PropertyCard';
import SearchForm, { SearchFormData } from '@/components/SearchForm';
import { Property } from '@/types';

interface PropertyFiltersAndListProps {
  initialProperties: Property[];
  searchQuery?: string;
  initialPropertyType?: string;
  initialMinBedrooms?: number;
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

export default function PropertyFiltersAndList({ 
  initialProperties,
  searchQuery = '',
  initialPropertyType = '',
  initialMinBedrooms,
  initialMinPrice,
  initialMaxPrice
}: PropertyFiltersAndListProps) {
  
  const initialSearchData: Partial<SearchFormData> = {
    q: searchQuery,
    propertyType: initialPropertyType,
    minBedrooms: initialMinBedrooms ? initialMinBedrooms.toString() : '',
    minPrice: initialMinPrice ? initialMinPrice.toString() : '',
    maxPrice: initialMaxPrice ? initialMaxPrice.toString() : ''
  };

  return (
    <>
      {/* Search Form */}
      <SearchForm 
        variant="filters" 
        initialData={initialSearchData}
        className="mb-8"
      />

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialProperties.length > 0 ? (
          initialProperties.map((property: Property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-center text-gray-600 md:col-span-2 lg:col-span-3">
            No se encontraron propiedades que coincidan con sus criterios de búsqueda.
          </p>
        )}
      </div>

      {/* Load More - This button's functionality will need separate implementation (e.g., pagination) */}
      {/* For client-side filtering of all initial properties, this button might be less relevant */}
      {/* unless you implement client-side pagination as well. */}
      <div className="text-center mt-12">
                  <button className="bg-yellow-700 text-white px-8 py-3 rounded-lg hover:bg-yellow-800 transition-colors duration-200 font-medium">
          Cargar Más Propiedades (Funcionalidad Pendiente)
        </button>
      </div>
    </>
  );
} 