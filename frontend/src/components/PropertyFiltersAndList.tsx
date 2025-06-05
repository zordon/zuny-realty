'use client'

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Property, PropertyType } from '@/types';

interface PropertyFiltersAndListProps {
  initialProperties: Property[];
}

export default function PropertyFiltersAndList({ initialProperties }: PropertyFiltersAndListProps) {
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(''); // '' | 'sale' | 'rent'
  const [bedroomsFilter, setBedroomsFilter] = useState('');       // '' | '1' | '2' | '3' | '4'
  const [maxPriceFilter, setMaxPriceFilter] = useState('');         // '' | '100000' | '200000' etc.
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);

  const handleSearch = () => {
    let tempProperties = [...initialProperties];

    // Filter by Property Type
    if (propertyTypeFilter) {
      const targetType = propertyTypeFilter === 'sale' ? PropertyType.SALE : PropertyType.RENT;
      tempProperties = tempProperties.filter(p => p.propertyType === targetType);
    }

    // Filter by Bedrooms (minimum)
    if (bedroomsFilter) {
      const minBedrooms = parseInt(bedroomsFilter, 10);
      tempProperties = tempProperties.filter(p => p.bedrooms >= minBedrooms);
    }

    // Filter by Max Price
    if (maxPriceFilter) {
      const maxPrice = parseInt(maxPriceFilter, 10);
      tempProperties = tempProperties.filter(p => p.price <= maxPrice);
    }

    setFilteredProperties(tempProperties);
  };

  // Optional: Reset filters or clear button logic can be added here
  // useEffect to reset filteredProperties if initialProperties change (though less common for this setup)
  useEffect(() => {
    setFilteredProperties(initialProperties);
    // Reset filters if you want, or call handleSearch to apply current filters to new initialProperties
    // For now, just resetting to show all initial properties if they were to change.
    setPropertyTypeFilter('');
    setBedroomsFilter('');
    setMaxPriceFilter('');
  }, [initialProperties]);

  return (
    <>
      {/* Filters UI (copied and adapted from properties/page.tsx) */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Propiedad
            </label>
            <select 
              id="propertyType" 
              value={propertyTypeFilter} 
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="sale">En Venta</option>
              <option value="rent">En Alquiler</option>
            </select>
          </div>
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
              Habitaciones
            </label>
            <select 
              id="bedrooms" 
              value={bedroomsFilter} 
              onChange={(e) => setBedroomsFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Precio Máximo
            </label>
            <select 
              id="maxPrice" 
              value={maxPriceFilter} 
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin límite</option>
              <option value="100000">$100,000</option>
              <option value="200000">$200,000</option>
              <option value="300000">$300,000</option>
              <option value="500000">$500,000</option>
              {/* Consider adding more price options or a different input type */}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-full bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-200"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid (copied and adapted from properties/page.tsx) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
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
        <button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium">
          Cargar Más Propiedades (Funcionalidad Pendiente)
        </button>
      </div>
    </>
  );
} 