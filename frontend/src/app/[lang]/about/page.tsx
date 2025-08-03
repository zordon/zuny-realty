import { getDictionary } from '@/lib/dictionaries';

interface AboutPageProps {
  params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            {dict.about.title}
          </h1>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-4">
              {dict.about.welcome}
            </p>
            <p className="mb-4">
              {dict.about.mission}
            </p>
            <p className="mb-4">
              {dict.about.expertise}
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">{dict.about.values}</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>{dict.about.integrity}:</strong> {dict.about.integrityDesc}</li>
              <li><strong>{dict.about.professionalism}:</strong> {dict.about.professionalismDesc}</li>
              <li><strong>{dict.about.clientFocus}:</strong> {dict.about.clientFocusDesc}</li>
              <li><strong>{dict.about.passionForPanama}:</strong> {dict.about.passionForPanamaDesc}</li>
            </ul>
            <p>
              {dict.about.conclusion}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 