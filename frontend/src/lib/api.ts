const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN

export const api = {
  baseURL: STRAPI_URL,
  endpoints: {
    properties: '/api/properties',
    property: (id: string) => `/api/properties/${id}`,
    featuredProperties: '/api/properties?filters[isFeatured][$eq]=true&populate=*',
  },
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
}

export async function fetchProperties() {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.properties}?populate=*`, {
      headers: api.headers,
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch properties')
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export async function fetchFeaturedProperties() {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.featuredProperties}`, {
      headers: api.headers,
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured properties')
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}

export async function fetchProperty(id: string) {
  try {
    const response = await fetch(`${api.baseURL}${api.endpoints.property(id)}?populate=*`, {
      headers: api.headers,
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch property')
    }
    
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
} 