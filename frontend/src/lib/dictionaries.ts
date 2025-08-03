import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'es') => {
  return dictionaries[locale]?.() ?? dictionaries.es();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

// Helper function to map locale to Strapi locale
export const getStrapiLocale = (locale: 'en' | 'es'): string => {
  return locale === 'en' ? 'en' : 'es-419';
};