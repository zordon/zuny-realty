import { fetchProperty, fetchProperties } from "@/lib/api";
import { Property, PropertyType } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
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

  if (!property) {
    // Optional: You could redirect to a 404 page or return a custom component
    // import { notFound } from 'next/navigation';
    // notFound();
    return (
      <div className="container mx-auto px-4 py-8">Property not found.</div>
    );
  }

  // Helper to format price (can be moved to a utility file)
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden">
          {/* Image Gallery (simplified) */}
          {property.images && property.images.length > 0 && (
            <div className="bg-gray-200">
              <Image
                src={property.images[0]} // Displaying the first image
                alt={property.title}
                className="w-full h-96 object-cover"
                width={1200}
                height={384}
                priority
              />
              {/* TODO: Add a gallery for multiple images if needed */}
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

            <div className="text-4xl font-bold text-blue-700 mb-6">
              {formatPrice(property.price, property.currency)}
              {property.propertyType === PropertyType.RENT && (
                <span className="text-lg font-normal text-gray-500">/mes</span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold">
                  Habitaciones
                </p>
                <p className="text-2xl text-blue-800 font-bold">
                  {property.bedrooms}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold">Baños</p>
                <p className="text-2xl text-blue-800 font-bold">
                  {property.bathrooms}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold">Área (m²)</p>
                <p className="text-2xl text-blue-800 font-bold">
                  {property.areaSqFt}
                </p>
              </div>
              <div
                className={`bg-opacity-20 p-4 rounded-lg ${property.propertyType === PropertyType.SALE ? "bg-green-500" : "bg-orange-500"}`}
              >
                <p
                  className={`text-sm font-semibold ${property.propertyType === PropertyType.SALE ? "text-green-700" : "text-orange-700"}`}
                >
                  Tipo
                </p>
                <p
                  className={`text-xl font-bold ${property.propertyType === PropertyType.SALE ? "text-green-800" : "text-orange-800"}`}
                >
                  {property.propertyType === PropertyType.SALE
                    ? "En Venta"
                    : "En Alquiler"}
                </p>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Descripción
              </h2>
              <p>{property.description}</p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Características
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                  {property.features.map((feature) => (
                    <li
                      key={feature.id}
                      className="flex items-center text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0"
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
                  Información del Agente
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
                        Teléfono:{" "}
                        <a
                          href={`tel:${property.agentPhone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {property.agentPhone}
                        </a>
                      </p>
                    )}
                    {property.agentEmail && (
                      <p className="text-gray-700">
                        Email:{" "}
                        <a
                          href={`mailto:${property.agentEmail}`}
                          className="text-blue-600 hover:underline"
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
      </main>
      <Footer />
    </div>
  );
}
