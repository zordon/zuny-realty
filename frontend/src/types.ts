
export enum PropertyType {
  SALE = 'For Sale',
  RENT = 'For Rent',
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  description: string;
  images: string[];
  type: PropertyType;
  features: string[];
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
}
