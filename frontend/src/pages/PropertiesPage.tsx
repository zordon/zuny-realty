import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import { getAllProperties } from '../services/propertyService';
import { Property, PropertyType } from '../types';
import { useTranslation } from 'react-i18next';

const PropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentFilter, setCurrentFilter] = useState<PropertyType | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const properties = getAllProperties();
    setAllProperties(properties);
  }, []);
  
  useEffect(() => {
    let propertiesToFilter = [...allProperties];

    if (currentFilter !== 'All') {
      propertiesToFilter = propertiesToFilter.filter(p => p.type === currentFilter);
    }

    if (searchTerm) {
      propertiesToFilter = propertiesToFilter.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProperties(propertiesToFilter);
  }, [currentFilter, allProperties, searchTerm]);


  const handleFilterChange = (filter: PropertyType | 'All') => {
    setCurrentFilter(filter);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('propertiesPage.title')}</h1>
        <p className="text-lg text-gray-600">{t('propertiesPage.subtitle')}</p>
      </div>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          placeholder={t('propertiesPage.searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label={t('propertiesPage.searchPlaceholder')}
        />
      </div>

      <PropertyFilter currentFilter={currentFilter} onFilterChange={handleFilterChange} />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-xl py-10">
          {t('propertiesPage.noResults')}
        </p>
      )}
    </div>
  );
};

export default PropertiesPage;