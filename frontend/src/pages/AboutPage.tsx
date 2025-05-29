import React from 'react';
import { AGENT_PHOTO_URL } from '../constants';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">{t('aboutPage.title', { siteName: t('siteName') })}</h1>
        <p className="text-xl text-gray-600">{t('aboutPage.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
        <img 
          src={AGENT_PHOTO_URL} 
          alt={t('agentName')}
          className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-blue-200 md:sticky md:top-24"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold text-gray-800 mb-1">{t('agentName')}</h2>
          <p className="text-lg text-blue-600 font-medium mb-4">{t('agentTitle')}</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {t('agentBio')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t('aboutPage.ourMission')}</h3>
          <p className="text-gray-700 leading-relaxed">
            {t('aboutPage.missionText')}
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{t('aboutPage.whyChooseUs')}</h3>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
            <li dangerouslySetInnerHTML={{ __html: t('aboutPage.reasons.personalized') }} />
            <li dangerouslySetInnerHTML={{ __html: t('aboutPage.reasons.expertise') }} />
            <li dangerouslySetInnerHTML={{ __html: t('aboutPage.reasons.integrity') }} />
            <li dangerouslySetInnerHTML={{ __html: t('aboutPage.reasons.support') }} />
            <li dangerouslySetInnerHTML={{ __html: t('aboutPage.reasons.results') }} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;