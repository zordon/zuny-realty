'use client'

import React from 'react'
import Link from 'next/link'
import { Property, PropertyType } from '@/types'

interface PropertyCardProps {
  property: Property
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency, 
      minimumFractionDigits: 0 
    }).format(price)
  }

  const getPropertyTypeLabel = (type: PropertyType) => {
    return type === PropertyType.SALE ? 'En Venta' : 'En Alquiler'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl">
      <Link href={`/property/${property.id}`}>
        <div className="relative">
          <img 
            src={property.images[0]} 
            alt={property.title} 
            className="w-full h-56 object-cover" 
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              property.type === PropertyType.SALE 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {getPropertyTypeLabel(property.type)}
            </span>
          </div>
          {property.isFeatured && (
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                Destacado
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/property/${property.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-700 transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.address}
        </p>
        
        <p className="text-2xl font-bold text-blue-700 mb-4">
          {formatPrice(property.price, property.currency)}
          {property.type === PropertyType.RENT && (
            <span className="text-sm font-normal text-gray-500">/mes</span>
          )}
        </p>
        
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {property.bedrooms} hab
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {property.bathrooms} baños
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {property.areaSqFt} m²
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p className="font-medium">{property.agentName}</p>
            <p>{property.agentPhone}</p>
          </div>
          <Link 
            href={`/property/${property.id}`}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard