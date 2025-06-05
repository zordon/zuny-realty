export enum PropertyType {
  SALE = 'For Sale',
  RENT = 'For Rent',
}

export interface Feature {
  id: number;
  attributes: {
    name: string;
    // Add any other fields from your Feature schema.json here, e.g.:
    // description?: string;
    // icon?: string;
    // createdAt: string; 
    // updatedAt: string;
    // publishedAt?: string;
    // locale?: string; 
    // localizations?: any[]; // Or a more specific type if known
  };
}

export interface Property {
  id: string;
  documentId: string;
  title: string;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  description: string;
  images: string[];
  propertyType: PropertyType;
  features: Feature[];
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
}

// Strapi specific types
export interface StrapiImage {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormatOld;
    small?: StrapiMediaFormatOld;
    medium?: StrapiMediaFormatOld;
    large?: StrapiMediaFormatOld;
  } | null;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  url: string;
  previewUrl?: string | null;
  provider?: string;
  provider_metadata?: unknown | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  isUrlSigned?: boolean;
}

export interface StrapiFeature {
  id: number;
  documentId?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
}

// Renaming this interface to StrapiPropertyDataItem (this is the new flat type)
export interface StrapiPropertyDataItem { 
  id: number;
  documentId?: string;
  title: string;
  description: string;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  isFeatured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  slug?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  locale?: string;
  
  features: StrapiFeature[] | null;
  images: StrapiImage[] | null;
  
  areaSqFt?: number;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  
  // Adding characteristics field based on Postman example and usage in api.ts
  characteristics?: { id: number; label: string; value: string; suffix?: string; prefix?: string; key?: string | null; isWidget?: boolean | null }[] | null;
}

// Strapi specific types
export interface StrapiMediaFormatOld {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiMediaAttributesOld {
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: StrapiMediaFormatOld;
    small?: StrapiMediaFormatOld;
    medium?: StrapiMediaFormatOld;
    large?: StrapiMediaFormatOld;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null; // Can be more specific if known
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponseDataOld<T> {
  id: number;
  attributes: T;
}

// For a collection of media
export interface StrapiMediaOld {
  data: StrapiResponseDataOld<StrapiMediaAttributesOld>[] | null;
}

// Raw feature data from Strapi
export interface StrapiFeatureAttributesOld {
  name: string;
  // Add other raw feature attributes if any, e.g. description, icon from your Feature type
}

export type StrapiFeatureDataOld = StrapiResponseDataOld<StrapiFeatureAttributesOld>;

// Raw property data from Strapi
export interface StrapiPropertyDataAttributesOld {
  documentId?: string;
  title: string;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  description: string;
  images?: StrapiMediaOld; 
  propertyType: string; // 'sale' or 'rent'
  features?: { data: StrapiFeatureDataOld[] }; 
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  // any other raw fields from Strapi that are not directly on Property type
}

// Type for items received in the API responses (data array or single data object)
export type StrapiPropertyDataItemOld = StrapiResponseDataOld<StrapiPropertyDataAttributesOld>;
