import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import BusinessCard from '../../components/client/BusinessCard';
import Spinner from '../../components/shared/Spinner';
import { ServiceType } from '../../types';
import { SERVICE_TYPES } from '../../constants';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { businesses, isLoading } = useAppContext();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ServiceType | 'All'>('All');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            business.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || business.serviceType === selectedType;
      const matchesRating = selectedRating === 0 || business.rating >= selectedRating;
      return matchesSearch && matchesType && matchesRating;
    });
  }, [businesses, searchTerm, selectedType, selectedRating]);

  if (isLoading && businesses.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-textPrimary">{t('home.title')}</h1>
        <p className="text-lg text-textSecondary mt-2">{t('home.subtitle')}</p>
      </div>

      <div className="bg-surface p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t('home.searchPlaceholder')}
          className="w-full md:w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ServiceType | 'All')}
        >
          <option value="All">{t('home.allServiceTypes')}</option>
          {SERVICE_TYPES.map(type => (
            <option key={type} value={type}>{t(`serviceTypes.${type}`)}</option>
          ))}
        </select>
        <select
          className="w-full md:w-1/3 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white"
          value={selectedRating}
          onChange={(e) => setSelectedRating(Number(e.target.value))}
        >
            <option value="0">{t('home.anyRating')}</option>
            <option value="4">{t('home.rating4plus')}</option>
            <option value="3">{t('home.rating3plus')}</option>
        </select>
      </div>

      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-textPrimary">{t('home.noBusinessesFound')}</h2>
          <p className="text-textSecondary mt-2">{t('home.adjustSearch')}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;