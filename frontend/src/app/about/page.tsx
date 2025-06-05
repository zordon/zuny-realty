import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Acerca de Nosotros
          </h1>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-4">
              Bienvenido a ZuR Real Estate. Somos un equipo dedicado de profesionales apasionados por ayudar a nuestros clientes a encontrar la propiedad perfecta en Panamá.
            </p>
            <p className="mb-4">
              Nuestra misión es ofrecer un servicio excepcional, transparente y personalizado. Creemos en construir relaciones a largo plazo con nuestros clientes, basadas en la confianza y el entendimiento mutuo de sus necesidades y aspiraciones.
            </p>
            <p className="mb-4">
              Con un profundo conocimiento del mercado inmobiliario local, desde vibrantes propiedades urbanas en la Ciudad de Panamá hasta serenas casas de playa y lotes en el interior, estamos equipados para guiarlo en cada paso de su viaje inmobiliario.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Nuestros Valores</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Integridad:</strong> Actuamos con honestidad y ética en todas nuestras interacciones.</li>
              <li><strong>Profesionalismo:</strong> Nos esforzamos por la excelencia y la eficiencia en nuestro trabajo.</li>
              <li><strong>Conocimiento del Cliente:</strong> Ponemos las necesidades de nuestros clientes primero, siempre.</li>
              <li><strong>Pasión por Panamá:</strong> Amamos este país y estamos emocionados de compartir sus oportunidades inmobiliarias.</li>
            </ul>
            <p>
              Ya sea que esté buscando comprar, vender o alquilar, ZuR Real Estate está aquí para asegurar que su experiencia sea lo más fluida y exitosa posible. Contáctenos hoy para descubrir cómo podemos ayudarle.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 