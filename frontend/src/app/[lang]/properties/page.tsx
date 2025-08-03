import { Suspense } from 'react'
import { Property } from '@/types'
import { fetchProperties } from '@/lib/api'
import ClientPropertiesPage from '@/components/ClientPropertiesPage'
import { getStrapiLocale, getDictionary } from '@/lib/dictionaries'

interface PropertiesPageProps {
  params: Promise<{
    lang: 'en' | 'es'
  }>
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { lang } = await params
  const [strapiLocale, dict] = await Promise.all([
    getStrapiLocale(lang),
    getDictionary(lang)
  ])
  
  // Fetch all properties for static generation with correct locale
  const allProperties: Property[] = await fetchProperties(undefined, strapiLocale);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700"></div>
            <p className="mt-4 text-gray-600">{dict.common.loadingContent}</p>
          </div>
        }>
          <ClientPropertiesPage allProperties={allProperties} dict={dict} lang={lang} />
        </Suspense>
      </main>
    </div>
  )
} 