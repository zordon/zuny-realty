import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Property } from '@/types'
import { fetchProperties } from '@/lib/api'
import ClientPropertiesPage from '@/components/ClientPropertiesPage'

export default async function PropertiesPage() {
  // Fetch all properties for static generation
  const allProperties: Property[] = await fetchProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700"></div>
            <p className="mt-4 text-gray-600">Cargando propiedades...</p>
          </div>
        }>
          <ClientPropertiesPage allProperties={allProperties} />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
} 