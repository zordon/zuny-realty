import React from 'react';
import { PropertyType } from '../types';
import { useTranslation } from 'react-i18next';

interface PropertyFilterProps {
  currentFilter: PropertyType | 'All';
  onFilterChange: (filter: PropertyType | 'All') => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ currentFilter, onFilterChange }) => {
  const { t } = useTranslation();
  
  const filterOptions: { value: PropertyType | 'All', labelKey: string }[] = [
    { value: 'All', labelKey: 'propertyType.all' },
    { value: PropertyType.SALE, labelKey: 'propertyType.forSale' },
    { value: PropertyType.RENT, labelKey: 'propertyType.forRent' },
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-2 items-center bg-white p-4 rounded-lg shadow">
      <label className="text-gray-700 font-semibold mr-2">{t('propertiesPage.filterBy')}</label>
      {filterOptions.map(option => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${currentFilter === option.value 
              ? 'bg-yellow-600 text-white shadow-md' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
};

export default PropertyFilter;