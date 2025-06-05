import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  // Basic form state and submission logic would go here if it were a Client Component
  // For a Server Component, this is primarily for display or linking to external forms.

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Contáctanos
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Información de Contacto</h2>
              <p className="text-gray-700 mb-2">
                <strong className="font-medium">Teléfono:</strong> <a href="tel:+50762735027" className="text-blue-600 hover:underline">+507 6273-5027</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="font-medium">Email:</strong> <a href="mailto:admin@zunyrealty.com" className="text-blue-600 hover:underline">admin@zunyrealty.com</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="font-medium">Dirección:</strong> Ciudad de Panamá, Panamá (Por favor, contáctanos para agendar una cita)
              </p>
              {/* Add WhatsApp link if desired */}
              <p className="text-gray-700 mt-4">
                <a 
                  href="https://wa.me/50762735027" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Envíanos un Mensaje</h2>
              <p className="text-gray-700 mb-4">Si prefieres, puedes completar el siguiente formulario y nos pondremos en contacto contigo a la brevedad.</p>
              {/* Replace the static form with the ContactForm client component */}
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 