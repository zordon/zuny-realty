"use client";

import { Property, PropertyType, StrapiCharacteristic, StrapiImage } from "@/types";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Dictionary } from "@/lib/dictionaries";

interface PropertyDetailsProps {
  property: Property;
  dict: Dictionary;
}

export default function PropertyDetails({ property, dict }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Helper function to get image URL from either string or StrapiImage object
  const getImageUrl = (image: string | StrapiImage): string => {
    if (typeof image === 'string') {
      return image;
    } else if (typeof image === 'object' && 'url' in image) {
      // For StrapiImage objects, use large format for better quality in details view
      return image.formats?.large?.url || image.url;
    }
    return '';
  };

  // Helper to format price (can be moved to a utility file)
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper to get area from characteristics
  const getAreaFromCharacteristics = () => {
    const areaChar = property.characteristics?.find((char: StrapiCharacteristic) => 
      char.label.toLowerCase() === 'area' || char.label.toLowerCase() === 'área'
    );
    return areaChar ? `${areaChar.value}${areaChar.suffix || ''}` : 'N/A';
  };

  // Helper to determine which widgets to show based on category
  const getPropertyWidgets = () => {
    const categoryName = property.category?.name?.toLowerCase() || '';
    const widgets = [];

    // Area is shown for all property types
    widgets.push({
      label: dict.property.area,
      value: getAreaFromCharacteristics(),
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      valueColor: 'text-yellow-800'
    });

    // Bedrooms and bathrooms only for residential properties
    if (categoryName.includes('apartamento') || categoryName.includes('casa') || categoryName.includes('residencial')) {
      if (property.bedrooms !== null && property.bedrooms !== undefined) {
        widgets.push({
          label: dict.property.bedrooms,
          value: property.bedrooms,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          valueColor: 'text-yellow-800'
        });
      }
      
      if (property.bathrooms !== null && property.bathrooms !== undefined) {
        widgets.push({
          label: dict.property.bathrooms,
          value: property.bathrooms,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          valueColor: 'text-yellow-800'
        });
      }
    }

    // Property type is shown for all
    widgets.push({
      label: dict.property.type,
      value: property.propertyType === PropertyType.SALE ? dict.property.forSale : dict.property.forRent,
      bgColor: property.propertyType === PropertyType.SALE ? "bg-green-500 bg-opacity-20" : "bg-orange-500 bg-opacity-20",
      textColor: property.propertyType === PropertyType.SALE ? "text-green-700" : "text-orange-700",
      valueColor: property.propertyType === PropertyType.SALE ? "text-green-800" : "text-orange-800"
    });

    return widgets;
  };

  // Image slider functions
  const nextImage = useCallback(() => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  }, [property.images]);

  const prevImage = useCallback(() => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  }, [property.images]);

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property?.images, nextImage, prevImage]);

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property.id]);

  return (
    <article className="bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden">
      {/* Image Gallery Slider */}
      {property.images && property.images.length > 0 && (
        <div className="relative bg-gray-200 group">
          {/* Main Image */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <Image
              src={getImageUrl(property.images[currentImageIndex])}
              alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
              width={1200}
              height={500}
              priority={currentImageIndex === 0}
            />
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Navigation Buttons - Only show if more than 1 image */}
          {property.images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label={dict.property.prevImage}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label={dict.property.nextImage}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Indicators/Dots - Only show if more than 1 image */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    index === currentImageIndex
                      ? 'bg-yellow-500 scale-110'
                      : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                  }`}
                                        aria-label={`${dict.property.goToImage} ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Strip - Only show if more than 1 image and on larger screens */}
          {property.images.length > 1 && property.images.length <= 6 && (
            <div className="hidden md:block absolute bottom-4 left-4 flex space-x-2 max-w-xs">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-16 h-12 rounded border-2 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    index === currentImageIndex
                      ? 'border-yellow-500 scale-105'
                      : 'border-white border-opacity-60 hover:border-opacity-100'
                  }`}
                >
                                        <Image
                        src={getImageUrl(image)}
                        alt={`${dict.property.thumbnail} ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={64}
                        height={48}
                      />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {property.title}
        </h1>
        <p className="text-gray-600 text-lg mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {property.address}
        </p>

        <div className="text-4xl font-bold text-yellow-700 mb-6">
          {formatPrice(property.price, property.currency)}
          {property.propertyType === PropertyType.RENT && (
            <span className="text-lg font-normal text-gray-500">{dict.property.perMonth}</span>
          )}
        </div>

        <div className={`grid gap-6 mb-8 text-center ${getPropertyWidgets().length <= 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
          {getPropertyWidgets().map((widget, index) => (
            <div key={index} className={`${widget.bgColor} p-4 rounded-lg`}>
              <p className={`text-sm font-semibold ${widget.textColor}`}>
                {widget.label}
              </p>
              <p className={`text-2xl font-bold ${widget.valueColor}`}>
                {widget.value}
              </p>
            </div>
          ))}
        </div>

        <div className="prose max-w-none mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {dict.property.description}
          </h2>
          <p className="whitespace-pre-line">{property.description}</p>
        </div>

        {property.features && property.features.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {dict.property.features}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
              {property.features.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-center text-gray-700"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature.attributes.name || "Unnamed Feature"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Agent Information - Assuming agent fields are on the property object */}
        {(property.agentName ||
          property.agentEmail ||
          property.agentPhone) && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {dict.property.agentInfo}
            </h2>
            <div className="flex items-center bg-gray-100 p-6 rounded-lg">
              {/* Placeholder for agent image - you might want to add this to your Strapi model */}
              {/* <img src="/path/to/agent-photo.jpg" alt={property.agentName || 'Agente'} className="w-20 h-20 rounded-full mr-6"/> */}
              <div>
                {property.agentName && (
                  <p className="text-xl font-bold text-gray-900">
                    {property.agentName}
                  </p>
                )}
                {property.agentPhone && (
                  <p className="text-gray-700">
                    {dict.property.phone}{" "}
                    <a
                      href={`tel:${property.agentPhone}`}
                      className="text-yellow-600 hover:underline"
                    >
                      {property.agentPhone}
                    </a>
                  </p>
                )}
                {property.agentEmail && (
                  <p className="text-gray-700">
                    {dict.property.email}{" "}
                    <a
                      href={`mailto:${property.agentEmail}`}
                      className="text-yellow-600 hover:underline"
                    >
                      {property.agentEmail}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TODO: Add contact form or call to action */}
      </div>
    </article>
  );
}