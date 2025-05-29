import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import { getFeaturedProperties } from '../services/propertyService';
import { Property } from '../types';
import { AGENT_PHOTO_URL } from '../constants';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    setFeaturedProperties(getFeaturedProperties());
  }, []);

  return (
    <div className="space-y-12">
      <HeroSection
        title={t('heroSection.welcomeTitle', { siteName: t('siteName') })}
        subtitle={t('heroSection.subtitle')}
        imageUrl="https://picsum.photos/seed/hero/1600/900"
        ctaText={t('heroSection.ctaViewAll')}
        ctaLink="/properties"
      />

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('homePage.featuredProperties')}</h2>
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">{t('homePage.noFeaturedProperties')}</p>
        )}
        <div className="text-center mt-8">
          <Link 
            to="/properties" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-md shadow-md transition-transform transform hover:scale-105 duration-300"
          >
            {t('homePage.seeAllListings')}
          </Link>
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={AGENT_PHOTO_URL} alt={t('agentName')} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md"/>
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('homePage.meetYourAgent')}</h2>
                <p className="text-xl text-blue-600 font-semibold mb-1">{t('agentName')}</p>
                <p className="text-md text-gray-600 mb-4">{t('agentTitle')}</p>
                <p className="text-gray-700 leading-relaxed mb-4">
                {t('homePage.agentIntro')}
                </p>
                <Link 
                to="/about" 
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                {t('homePage.learnMoreAboutMe')}
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;