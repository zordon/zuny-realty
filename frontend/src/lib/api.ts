import { Property, PropertyType, Feature, StrapiPropertyDataItem, StrapiImage, StrapiFeature, StrapiCharacteristic } from '@/types';

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
    category,
  } = item;

  let resolvedAreaSqFt = item.areaSqFt;
  if (typeof resolvedAreaSqFt !== 'number' && characteristics) {
    const areaCharacteristic = characteristics.find((char: StrapiCharacteristic) => char.key === 'area');
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

  const mappedImages: (string | StrapiImage)[] = rawImages ? rawImages : [];

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
    characteristics: characteristics || [],
    category: category || undefined,
  };
};

export interface PropertySearchParams {
  q?: string;           // General search query
  propertyType?: string; // 'sale' | 'rent'
  minBedrooms?: number; // Minimum bedrooms
  maxPrice?: number;    // Maximum price
  minPrice?: number;    // Minimum price
  page?: number;        // Page number for pagination
  limit?: number;       // Number of items per page
}

export async function fetchProperties(searchParams?: PropertySearchParams, locale: string = 'es-419'): Promise<Property[]> {
  try {
    const url = new URL(`${api.baseURL}${api.endpoints.properties}`);
    url.searchParams.append('populate', '*');
    url.searchParams.append('locale', locale);
    
    // Add search parameters if provided
    if (searchParams) {
      // General search across title, address, and description
      if (searchParams.q) {
        url.searchParams.append('filters[$or][0][title][$containsi]', searchParams.q);
        url.searchParams.append('filters[$or][1][address][$containsi]', searchParams.q);
        url.searchParams.append('filters[$or][2][description][$containsi]', searchParams.q);
      }
      
      // Property type filter
      if (searchParams.propertyType) {
        url.searchParams.append('filters[propertyType][$eq]', searchParams.propertyType);
      }
      
      // Bedrooms filter (minimum)
      if (searchParams.minBedrooms) {
        url.searchParams.append('filters[bedrooms][$gte]', searchParams.minBedrooms.toString());
      }
      
      // Price range filters
      if (searchParams.maxPrice) {
        url.searchParams.append('filters[price][$lte]', searchParams.maxPrice.toString());
      }
      
      if (searchParams.minPrice) {
        url.searchParams.append('filters[price][$gte]', searchParams.minPrice.toString());
      }

      // Pagination parameters
      if (searchParams.page) {
        url.searchParams.append('pagination[page]', searchParams.page.toString());
      }
      
      if (searchParams.limit) {
        url.searchParams.append('pagination[pageSize]', searchParams.limit.toString());
      }
    }
    
    const response = await fetch(url.toString(), {
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

export async function fetchPropertiesWithPagination(searchParams?: PropertySearchParams, locale: string = 'es-419'): Promise<{ properties: Property[], pagination: { page: number, pageSize: number, pageCount: number, total: number } }> {
  try {
    const url = new URL(`${api.baseURL}${api.endpoints.properties}`);
    url.searchParams.append('populate', '*');
    url.searchParams.append('locale', locale);
    
    // Add search parameters if provided
    if (searchParams) {
      // General search across title, address, and description
      if (searchParams.q) {
        url.searchParams.append('filters[$or][0][title][$containsi]', searchParams.q);
        url.searchParams.append('filters[$or][1][address][$containsi]', searchParams.q);
        url.searchParams.append('filters[$or][2][description][$containsi]', searchParams.q);
      }
      
      // Property type filter
      if (searchParams.propertyType) {
        url.searchParams.append('filters[propertyType][$eq]', searchParams.propertyType);
      }
      
      // Bedrooms filter (minimum)
      if (searchParams.minBedrooms) {
        url.searchParams.append('filters[bedrooms][$gte]', searchParams.minBedrooms.toString());
      }
      
      // Price range filters
      if (searchParams.maxPrice) {
        url.searchParams.append('filters[price][$lte]', searchParams.maxPrice.toString());
      }
      
      if (searchParams.minPrice) {
        url.searchParams.append('filters[price][$gte]', searchParams.minPrice.toString());
      }

      // Pagination parameters
      if (searchParams.page) {
        url.searchParams.append('pagination[page]', searchParams.page.toString());
      }
      
      if (searchParams.limit) {
        url.searchParams.append('pagination[pageSize]', searchParams.limit.toString());
      }
    }
    
    const response = await fetch(url.toString(), {
      headers: api.headers,
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch properties: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    
    const properties = data.data ? data.data.map(mapStrapiDataToProperty).filter((p: Property | null): p is Property => p !== null) : [];
    const pagination = data.meta?.pagination || { page: 1, pageSize: 25, pageCount: 1, total: 0 };
    
    return { properties, pagination };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } };
  }
}

export async function fetchFeaturedProperties(locale: string = 'es-419'): Promise<Property[]> {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.featuredProperties}&populate=*&locale=${locale}`, {
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

export async function fetchProperty(documentId: string, locale: string = 'es-419'): Promise<Property | null> {
  try {
    const filterQuery = `?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=*&locale=${locale}`;
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