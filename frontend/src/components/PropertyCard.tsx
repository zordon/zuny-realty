'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property, PropertyType, StrapiCharacteristic, StrapiImage } from '@/types'
import { Dictionary } from '@/lib/dictionaries'

interface PropertyCardProps {
  property: Property
  dict?: Dictionary
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, dict }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency, 
      minimumFractionDigits: 0 
    }).format(price)
  }

  const getPropertyTypeLabel = (type: PropertyType) => {
    if (dict?.property?.forSale && dict?.property?.forRent) {
      return type === PropertyType.SALE ? dict.property.forSale : dict.property.forRent
    }
    return type === PropertyType.SALE ? 'En Venta' : 'En Alquiler'
  }

  // Helper function to get area from characteristics
  const getAreaFromCharacteristics = (characteristics: StrapiCharacteristic[] | undefined): string => {
    if (!characteristics) return '0 m²'
    
    const areaChar = characteristics.find(char => 
      char.label?.toLowerCase().includes('area') || 
      char.label?.toLowerCase().includes('área')
    )
    
    if (areaChar) {
      const prefix = areaChar.prefix || ''
      const suffix = areaChar.suffix || 'm²'
      return `${prefix}${areaChar.value} ${suffix}`
    }
    
    return '0 m²'
  }

  // Helper function to get relevant widgets based on category
  const getPropertyWidgets = (property: Property) => {
    const widgets = []
    
    // Area is common for all categories
    const area = getAreaFromCharacteristics(property.characteristics)
    widgets.push({
      icon: (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      label: area,
      text: 'Área'
    })
    
    // Add category-specific widgets
    const categoryName = property.category?.name?.toLowerCase() || ''
    
    if (categoryName.includes('apartamento') || categoryName.includes('casa') || categoryName.includes('house')) {
      // For apartments and houses, show bedrooms and bathrooms
      widgets.push({
        icon: (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: `${property.bedrooms} hab`,
        text: 'Habitaciones'
      })
      
      widgets.push({
        icon: (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        ),
        label: `${property.bathrooms} baños`,
        text: 'Baños'
      })
    } else if (categoryName.includes('oficina') || categoryName.includes('office')) {
      // For offices, show only area (already added above)
    } else if (categoryName.includes('lote') || categoryName.includes('lot')) {
      // For lots, show only area (already added above)
    }
    
    return widgets
  }

  const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  let imageUrl: string | null = null;
  if (property.images && property.images.length > 0 && property.images[0]) {
    const image = property.images[0];
    
    // Check if it's a Strapi image object with formats
    if (typeof image === 'object' && 'formats' in image && image.formats) {
      // Use medium format if available, fallback to original
      const strapiImage = image as StrapiImage;
      imageUrl = strapiImage.formats?.medium?.url || strapiImage.url;
    } else if (typeof image === 'string') {
      // Handle string URLs (legacy format or mapped data)
      if (image.startsWith('http://') || image.startsWith('https://')) {
        imageUrl = image;
      } else {
        const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
        imageUrl = `${strapiApiUrl}${image.startsWith('/') ? image : '/' + image}`;
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-xl">
      <Link href={`/property/${property.documentId}`}>
        <div className="relative h-56 w-full">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={property.title} 
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={transparentPixel}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              {/* Optional: Add an icon or text here for 'No Image' */}
              {/* <span className="text-gray-500">No Image</span> */}
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              property.propertyType === PropertyType.SALE 
                ? 'bg-yellow-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>
          {property.isFeatured && (
            <div className="absolute top-4 right-4">
                                <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                {dict?.propertyCard?.featured || 'Destacado'}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/property/${property.documentId}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-yellow-700 transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.address}
        </p>
        
                      <p className="text-2xl font-bold text-yellow-700 mb-4">
          {formatPrice(property.price, property.currency)}
          {property.propertyType === PropertyType.RENT && (
            <span className="text-sm font-normal text-gray-500">/mes</span>
          )}
        </p>
        
        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          {getPropertyWidgets(property).map((widget, index) => (
            <span key={index} className="flex items-center">
              {widget.icon}
              {widget.label}
            </span>
          ))}
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
            href={`/property/${property.documentId}`}
                          className="bg-yellow-700 hover:bg-yellow-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            {dict?.propertyCard?.viewDetails || 'Ver Detalles'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard