import React from 'react';
import { Link } from 'react-router-dom';
import { Business } from '../../types';
import Card from '../shared/Card';
import { LocationIcon, StarIcon } from '../../constants';
import { useTranslation } from 'react-i18next';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <Link to={`/business/${business.id}`}>
        <img src={business.imageUrl} alt={business.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-bold text-textPrimary">{business.name}</h3>
          <div className="flex justify-between items-center my-1">
            <p className="text-sm text-secondary font-semibold">{t(`serviceTypes.${business.serviceType}`)}</p>
            <div className="flex items-center text-accent font-bold">
              {StarIcon}
              <span className="ms-1">{business.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center text-textSecondary text-sm mt-2">
            {LocationIcon}
            <span className="ms-2">{business.address}</span>
          </div>
          <p className="text-textSecondary text-sm mt-2 line-clamp-2">{business.description}</p>
        </div>
      </Link>
    </Card>
  );
};

export default BusinessCard;