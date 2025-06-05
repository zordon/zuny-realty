import { Property, PropertyType, Feature, StrapiPropertyDataItem, StrapiImage, StrapiFeature } from '@/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const api = {
  baseURL: STRAPI_URL,
  endpoints: {
    properties: '/api/properties',
    featuredProperties: '/api/properties?filters[isFeatured][$eq]=true',
    // Note: api.endpoints.property(documentId) is not used by fetchProperty anymore, which constructs its own path.
  },
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
};

// Helper function to map Strapi data to our frontend types
const mapStrapiDataToProperty = (item: StrapiPropertyDataItem): Property | null => {
  const strapiId = item.id;

  if (!item.documentId || typeof item.documentId !== 'string' || item.documentId.trim() === '') {
    console.warn(`Property with Strapi ID ${strapiId} is missing a valid documentId. Skipping.`, item);
    return null;
  }

  const {
    documentId,
    title,
    address,
    price,
    currency,
    bedrooms,
    bathrooms,
    description,
    images: rawImages,
    propertyType: propertyTypeString,
    features: rawFeatures,
    isFeatured,
    latitude,
    longitude,
    agentName,
    agentPhone,
    agentEmail,
    characteristics,
  } = item;

  let resolvedAreaSqFt = item.areaSqFt;
  if (typeof resolvedAreaSqFt !== 'number' && characteristics) {
    const areaCharacteristic = characteristics.find((char: { label: string; value: string }) => char.label === 'area');
    if (areaCharacteristic && areaCharacteristic.value) {
      resolvedAreaSqFt = parseInt(areaCharacteristic.value, 10);
      if (isNaN(resolvedAreaSqFt)) resolvedAreaSqFt = 0;
    }
  }
  if (typeof resolvedAreaSqFt !== 'number') {
    resolvedAreaSqFt = 0;
  }

  let typeEnum: PropertyType;
  if (propertyTypeString === 'sale') {
    typeEnum = PropertyType.SALE;
  } else if (propertyTypeString === 'rent') {
    typeEnum = PropertyType.RENT;
  } else {
    console.warn(`Unexpected property type string from API: ${propertyTypeString} for item ID ${strapiId}`);
    typeEnum = PropertyType.SALE;
  }

  const mappedImages: string[] = rawImages ? rawImages.map((img: StrapiImage) => img.url) : [];

  const mappedFeatures: Feature[] = rawFeatures
    ? rawFeatures.map((feature: StrapiFeature): Feature => ({
        id: feature.id,
        attributes: { name: feature.name },
      }))
    : [];

  return {
    id: String(strapiId),
    documentId: documentId!,
    title,
    address,
    price,
    currency,
    bedrooms,
    bathrooms,
    areaSqFt: resolvedAreaSqFt,
    description,
    images: mappedImages,
    propertyType: typeEnum,
    features: mappedFeatures,
    isFeatured,
    latitude: latitude ?? undefined,
    longitude: longitude ?? undefined,
    agentName,
    agentPhone,
    agentEmail,
  };
};

export async function fetchProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.properties}?populate=*`, {
      headers: api.headers,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch properties: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    return data.data ? data.data.map(mapStrapiDataToProperty).filter((p: Property | null): p is Property => p !== null) : [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.featuredProperties}&populate=*`, {
      headers: api.headers,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch featured properties: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    return data.data ? data.data.map(mapStrapiDataToProperty).filter((p: Property | null): p is Property => p !== null) : [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

export async function fetchProperty(documentId: string): Promise<Property | null> {
  try {
    const filterQuery = `?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*`;
    const response = await fetch(`${api.baseURL}${api.endpoints.properties}${filterQuery}`, {
      headers: api.headers,
    });

    if (!response.ok) {
      const errorStatus = response.status;
      const errorBody = await response.text();
      console.error(`Error fetching property with documentId ${documentId}: ${errorStatus}`, errorBody);
      return null;
    }
    const data = await response.json();
    
    const propertyData = Array.isArray(data.data) ? data.data[0] : data.data;

    if (!propertyData) {
      console.log(`Property with documentId ${documentId} not found.`);
      return null;
    }
    
    return mapStrapiDataToProperty(propertyData);
  } catch (error) {
    console.error(`General error in fetchProperty for documentId ${documentId}:`, error);
    return null;
  }
}