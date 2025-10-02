import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole, Service } from '../../types';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import { SERVICE_TYPES } from '../../constants';
import { useTranslation, Trans } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { currentUser, getBusinessForOwner, updateBusiness, isLoading } = useAppContext();
  const { t, i18n } = useTranslation();
  const business = getBusinessForOwner(currentUser.id);

  const [formData, setFormData] = useState(business);
  const [newService, setNewService] = useState({ id: '', name: '', description: '', durationMinutes: 30 });

  const weekDays = [...Array(7).keys()].map(i => {
      const d = new Date(Date.UTC(2023, 0, i + 1));
      return d.toLocaleDateString('en-US', { weekday: 'long' }); // Use en-US for keys
  });
  
  useEffect(() => {
    setFormData(business);
  }, [business]);

  if (currentUser.role !== UserRole.BUSINESS_OWNER) return <Navigate to="/" replace />;
  if (!business) return <div className="text-center"><Trans i18nKey="profile.registerFirst"><Link to="/dashboard/register" className="text-primary underline"></Link></Trans></div>;
  if (!formData) return <Spinner />;

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
  };
  
  const handleAvailabilityChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => {
      if (!prev) return null;
      const newAvailability = { ...prev.availability };
      newAvailability.days[day] = { ...newAvailability.days[day], [field]: value };
      return { ...prev, availability: newAvailability };
    });
  };

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const val = name === 'durationMinutes' ? parseInt(value, 10) || 0 : value;
      setNewService(prev => ({...prev, [name]: val }));
  }

  const handleAddService = () => {
      if (!newService.name || newService.durationMinutes <= 0) return;
      const serviceToAdd: Service = { ...newService, id: `serv${Date.now()}`};
      setFormData(prev => prev ? ({...prev, services: [...prev.services, serviceToAdd]}) : null);
      setNewService({ id: '', name: '', description: '', durationMinutes: 30 });
  }

  const handleRemoveService = (serviceId: string) => {
      setFormData(prev => prev ? ({...prev, services: prev.services.filter(s => s.id !== serviceId)}) : null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      await updateBusiness(formData);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-textPrimary mb-6">{t('profile.manageProfile')}</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">{t('profile.businessInfo')}</h2>
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-textSecondary">{t('profile.businessName')}</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full input-style" value={formData.name} onChange={handleInfoChange} />
          </div>
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-textSecondary">{t('dashboard.serviceType')}</label>
            <select name="serviceType" id="serviceType" required className="mt-1 block w-full input-style bg-white" value={formData.serviceType} onChange={handleInfoChange}>
              {SERVICE_TYPES.map(type => <option key={type} value={type}>{t(`serviceTypes.${type}`)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-textSecondary">{t('profile.address')}</label>
            <input type="text" name="address" id="address" required className="mt-1 block w-full input-style" value={formData.address} onChange={handleInfoChange} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textSecondary">{t('profile.description')}</label>
            <textarea name="description" id="description" rows={4} required className="mt-1 block w-full input-style" value={formData.description} onChange={handleInfoChange}></textarea>
          </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">{t('profile.manageServices')}</h2>
            <div className="space-y-4">
                {formData.services.map(service => (
                    <div key={service.id} className="p-4 border rounded-md flex justify-between items-start">
                        <div>
                            <p className="font-bold">{service.name} <span className="font-normal text-textSecondary">- {t('common.minutes', { count: service.durationMinutes })}</span></p>
                            <p className="text-sm text-textSecondary">{service.description}</p>
                        </div>
                        <Button type="button" variant="danger" className="text-xs px-2 py-1" onClick={() => handleRemoveService(service.id)}>{t('profile.remove')}</Button>
                    </div>
                ))}
            </div>
            <div className="p-4 border rounded-md border-dashed space-y-3">
                <h3 className="font-semibold">{t('profile.addNewService')}</h3>
                 <input type="text" name="name" placeholder={t('profile.serviceName')} className="w-full input-style" value={newService.name} onChange={handleNewServiceChange}/>
                 <textarea name="description" placeholder={t('profile.serviceDescription')} className="w-full input-style" rows={2} value={newService.description} onChange={handleNewServiceChange}></textarea>
                 <input type="number" name="durationMinutes" placeholder={t('profile.duration')} step="5" min="5" className="w-full input-style" value={newService.durationMinutes} onChange={handleNewServiceChange}/>
                 <Button type="button" variant="secondary" onClick={handleAddService}>{t('profile.addService')}</Button>
            </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">{t('profile.weeklyAvailability')}</h2>
          {weekDays.map(day => (
            <div key={day} className="grid grid-cols-4 gap-4 items-center">
              <label className="font-medium col-span-1">{new Date(Date.UTC(2023, 0, weekDays.indexOf(day) + 1)).toLocaleDateString(i18n.language, { weekday: 'long' })}</label>
              <div className="flex items-center">
                  <input type="checkbox" id={`${day}-isOpen`} checked={formData.availability.days[day]?.isOpen || false} onChange={e => handleAvailabilityChange(day, 'isOpen', e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  <label htmlFor={`${day}-isOpen`} className="ms-2 text-sm">{t('profile.open')}</label>
              </div>
              <input type="time" value={formData.availability.days[day]?.startTime || '09:00'} onChange={e => handleAvailabilityChange(day, 'startTime', e.target.value)} disabled={!formData.availability.days[day]?.isOpen} className="input-style" />
              <input type="time" value={formData.availability.days[day]?.endTime || '17:00'} onChange={e => handleAvailabilityChange(day, 'endTime', e.target.value)} disabled={!formData.availability.days[day]?.isOpen} className="input-style" />
            </div>
          ))}
        </div>

        <div>
          <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">{t('profile.saveChanges')}</Button>
        </div>
      </form>
       <style>{`
          .input-style {
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            outline: none;
            width: 100%;
          }
          .input-style:focus {
            box-shadow: 0 0 0 2px #6366f1;
            border-color: #4f46e5;
          }
          .input-style:disabled {
              background-color: #f3f4f6;
              cursor: not-allowed;
          }
       `}</style>
    </Card>
  );
};

export default ProfilePage;