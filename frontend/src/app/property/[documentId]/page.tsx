import { fetchProperty, fetchProperties } from "@/lib/api";
import { Property } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyDetails from "@/components/PropertyDetails";
import { getDictionary } from "@/lib/dictionaries";
// You will likely want to create a more detailed component for displaying a single property
// For now, this is a basic structure.

// Function to generate static paths for all properties
export async function generateStaticParams() {
  const properties: Property[] = await fetchProperties(); // Fetch all properties

  return properties.map((property) => ({
    documentId: property.documentId, // Ensure this is the string documentId
  }));
}

interface PropertyDetailPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { documentId } = await params; // Await the params object
  const property: Property | null = await fetchProperty(documentId);
  
  // Use default language for this route
  const lang = 'es' as const;
  const dict = await getDictionary(lang);

  if (!property) {
    // Optional: You could redirect to a 404 page or return a custom component
    // import { notFound } from 'next/navigation';
    // notFound();
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {dict.propertyNotFound.title}
          </h1>
          <p className="text-gray-600 mb-2">
            {dict.propertyNotFound.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header dict={dict} lang={lang} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PropertyDetails 
          property={property} 
          dict={dict} 
        />
      </main>
      <Footer dict={dict} lang={lang} />
    </div>
  );
}
