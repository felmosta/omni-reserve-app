import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';
import { useTranslation } from 'react-i18next';

const RegisterBusinessPage: React.FC = () => {
  const { addBusiness, isLoading } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    address: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBusiness = await addBusiness({
      ...formData,
      imageUrl: `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '')}/800/600`,
      services: [],
      availability: {
        days: {
          Monday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
          Tuesday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
          Wednesday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
          Thursday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
          Friday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
          Saturday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
          Sunday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        },
      }
    });
    if (newBusiness) {
      navigate('/dashboard');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-textPrimary mb-6">{t('dashboard.registerYourBusiness')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-textSecondary">{t('profile.businessName')}</label>
          <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-textSecondary">{t('profile.businessCategory')}</label>
          <input type="text" name="category" id="category" placeholder={t('profile.categoryPlaceholder')} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.category} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-textSecondary">{t('profile.address')}</label>
          <input type="text" name="address" id="address" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.address} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-textSecondary">{t('profile.description')}</label>
          <textarea name="description" id="description" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <Button type="submit" isLoading={isLoading} className="w-full">{t('dashboard.registerYourBusiness')}</Button>
        </div>
      </form>
    </Card>
  );
};

export default RegisterBusinessPage;