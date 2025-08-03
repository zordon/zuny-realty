import { getDictionary } from '@/lib/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header dict={dict} lang={lang} />
      <div className="flex-1">
        {children}
      </div>
      <Footer dict={dict} lang={lang} />
    </>
  );
}