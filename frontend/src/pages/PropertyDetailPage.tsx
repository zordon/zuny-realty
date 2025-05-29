import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { Property, PropertyType } from '../types';
import ImageGallery from '../components/ImageGallery';
import { AGENT_PHOTO_URL, AGENT_PHONE, AGENT_EMAIL } from '../constants';
import { useTranslation } from 'react-i18next';

const PropertyDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchedProperty = getPropertyById(id);
      setProperty(fetchedProperty || null);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return <div className="text-center py-10 text-xl">{t('propertyDetailPage.loading')}</div>;
  }

  if (!property) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">{t('propertyDetailPage.notFoundTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('propertyDetailPage.notFoundMessage')}</p>
        <Link to="/properties" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          {t('propertyDetailPage.backToProperties')}
        </Link>
      </div>
    );
  }
  
  // Agent name for this property, from mock data it's a key 'agentName'
  const propertyAgentName = t(property.agentName as 'agentName');


  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-5xl mx-auto">
      <ImageGallery images={property.images} altText={property.title} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2">{property.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{property.address}</p>
          
          <div className="flex flex-wrap items-center text-gray-700 mb-6 gap-x-6 gap-y-2">
            <span className="text-lg">🛏️ {property.bedrooms} {t('propertyDetailPage.bedrooms')}</span>
            <span className="text-lg">🛁 {property.bathrooms} {t('propertyDetailPage.bathrooms')}</span>
            <span className="text-lg">📐 {property.areaSqFt} {t('propertyDetailPage.area')}</span>
          </div>

          <p className="text-4xl font-bold text-green-600 mb-6">
            {formatPrice(property.price, property.currency)}
            {property.type === PropertyType.RENT && <span className="text-xl font-normal text-gray-500">{t('propertyCard.perMonth')}</span>}
          </p>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{t('propertyDetailPage.description')}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {property.features && property.features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{t('propertyDetailPage.keyFeatures')}</h2>
              <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-700">
                {property.features.map((feature, index) => (
                  <li key={index}>{feature}</li> // Feature items themselves are not translated here, assumed to be from DB
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('propertyDetailPage.contactAgent')}</h3>
            <div className="flex items-center mb-4">
              <img src={AGENT_PHOTO_URL} alt={propertyAgentName} className="w-16 h-16 rounded-full mr-4 object-cover"/>
              <div>
                <p className="font-semibold text-blue-700">{propertyAgentName}</p>
                <p className="text-sm text-gray-600">{t('propertyDetailPage.yourTrustedAdvisor')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">📞 {t('propertyDetailPage.phone')}:</span> <a href={`tel:${AGENT_PHONE}`} className="text-blue-600 hover:underline">{AGENT_PHONE}</a>
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">📧 {t('propertyDetailPage.email')}:</span> <a href={`mailto:${AGENT_EMAIL}`} className="text-blue-600 hover:underline">{AGENT_EMAIL}</a>
            </p>
            <button 
              onClick={() => alert(t('propertyDetailPage.requestInfoAlert'))}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              {t('propertyDetailPage.requestMoreInfo')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;