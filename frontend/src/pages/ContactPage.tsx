import React from 'react';
import { AGENT_PHONE, AGENT_EMAIL, AGENT_PHOTO_URL } from '../constants';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(t('contactPage.form.successAlert'));
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">{t('contactPage.title')}</h1>
        <p className="text-xl text-gray-600">{t('contactPage.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info Section */}
        <div className="space-y-6">
          <div className="flex items-center">
            <img src={AGENT_PHOTO_URL} alt={t('agentName')} className="w-20 h-20 rounded-full mr-4 object-cover border-2 border-blue-200"/>
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">{t('agentName')}</h2>
                <p className="text-md text-blue-600">{t('siteName')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('contactPage.contactDetails')}</h3>
            <p className="text-gray-600 mb-1">
              <strong className="text-gray-800">📞 {t('propertyDetailPage.phone')}:</strong> <a href={`tel:${AGENT_PHONE}`} className="text-blue-600 hover:underline">{AGENT_PHONE}</a>
            </p>
            <p className="text-gray-600">
              <strong className="text-gray-800">📧 {t('propertyDetailPage.email')}:</strong> <a href={`mailto:${AGENT_EMAIL}`} className="text-blue-600 hover:underline">{AGENT_EMAIL}</a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('contactPage.officeHours')}</h3>
            <p className="text-gray-600">{t('contactPage.mondayFriday')}</p>
            <p className="text-gray-600">{t('contactPage.saturday')}</p>
            <p className="text-gray-600">{t('contactPage.sunday')}</p>
          </div>
          
          <div className="mt-6">
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
              {t('contactPage.mapPlaceholder')}
            </div>
             <p className="text-sm text-gray-500 mt-1 text-center">{t('contactPage.mapCaption')}</p>
          </div>

        </div>

        {/* Contact Form Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('contactPage.sendMessage')}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.form.fullName')}</label>
              <input type="text" name="name" id="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.form.emailAddress')}</label>
              <input type="email" name="email" id="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.form.phoneNumberOptional')}</label>
              <input type="tel" name="phone" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('contactPage.form.message')}</label>
              <textarea name="message" id="message" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-300">
                {t('contactPage.form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;