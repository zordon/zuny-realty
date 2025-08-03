import { fetchProperty, fetchProperties } from "@/lib/api";
import { Property } from "@/types";
import { getDictionary, getStrapiLocale } from "@/lib/dictionaries";
import PropertyDetails from "@/components/PropertyDetails";
// You will likely want to create a more detailed component for displaying a single property
// For now, this is a basic structure.

// Function to generate static paths for all properties and locales
export async function generateStaticParams() {
  const locales = ['en', 'es'];
  const allParams = [];

  for (const lang of locales) {
    try {
      const strapiLocale = getStrapiLocale(lang as 'en' | 'es');
      const properties: Property[] = await fetchProperties(undefined, strapiLocale);
      
      const params = properties.map((property) => ({
        lang,
        documentId: property.documentId,
      }));
      
      allParams.push(...params);
    } catch (error) {
      console.error(`Error fetching properties for locale ${lang}:`, error);
    }
  }

  return allParams;
}

interface PropertyDetailPageProps {
  params: Promise<{
    lang: 'en' | 'es';
    documentId: string;
  }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { lang, documentId } = await params;
  const [dict, property] = await Promise.all([
    getDictionary(lang),
    fetchProperty(documentId, getStrapiLocale(lang)),
  ]);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {dict.property.notFound}
          </h1>
          <p className="text-gray-600">
            {lang === 'en' 
              ? 'The property you are looking for does not exist or has been removed.'
              : 'La propiedad que buscas no existe o ha sido removida.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PropertyDetails property={property} dict={dict} />
    </main>
  );
}
