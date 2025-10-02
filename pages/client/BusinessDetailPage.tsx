import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { Business, Service, TimeSlot, UserRole } from '../../types';
import { api } from '../../services/mockApiService';
import Spinner from '../../components/shared/Spinner';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import TimeSlotPicker from '../../components/client/TimeSlotPicker';
import { CalendarIcon, ClockIcon, LocationIcon, StarIcon } from '../../constants';
import { useTranslation } from 'react-i18next';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, addBooking, isLoading: isAppContextLoading, fetchBusinessById } = useAppContext();
  const { t, i18n } = useTranslation();

  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) return;
      setIsLoadingBusiness(true);
      try {
        const bizData = await fetchBusinessById(id);
        if (bizData) {
          setBusiness(bizData);
          if (bizData.services.length > 0) {
            setSelectedService(bizData.services[0]);
          }
        } else {
          // Handle business not found
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch business details", error);
        navigate('/', { replace: true });
      } finally {
        setIsLoadingBusiness(false);
      }
    };
    loadBusiness();
  }, [id, fetchBusinessById, navigate]);

  const fetchSlots = useCallback(async () => {
    if (!id || !selectedService) return;
    setIsLoadingSlots(true);
    try {
      const slots = await api.getAvailableSlots(id, selectedDate, selectedService.durationMinutes);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Failed to fetch available slots", error);
    } finally {
      setIsLoadingSlots(false);
    }
  }, [id, selectedDate, selectedService]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    // Adjust for timezone offset to prevent date from changing
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    setSelectedDate(new Date(date.getTime() + timezoneOffset));
  };
  
  const handleSelectSlot = (slot: TimeSlot) => {
    if (currentUser.role === UserRole.BUSINESS_OWNER) {
        // Business owners cannot make bookings.
        return;
    }
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!business || !selectedService || !selectedSlot) return;
    
    const bookingData = {
      userId: currentUser.id,
      businessId: business.id,
      serviceId: selectedService.id,
      slot: selectedSlot,
    };

    const newBooking = await addBooking(bookingData);
    setIsModalOpen(false);
    setSelectedSlot(null);
    if (newBooking) {
      navigate('/my-reservations');
    }
  };

  if (isLoadingBusiness || !business) {
    return <Spinner />;
  }
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <Card>
        <img src={business.imageUrl} alt={business.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <h1 className="text-3xl font-bold text-textPrimary">{business.name}</h1>
            <div className="flex items-center text-accent font-bold text-xl mt-2 md:mt-0">
              {StarIcon}
              <span className="ms-1">{business.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center text-textSecondary text-md mb-4">
            {LocationIcon}
            <span className="ms-2">{business.address}</span>
          </div>
          <p className="text-textSecondary">{business.description}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-textPrimary mb-4">{t('business.bookService')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: Service and Date selection */}
          <div className="space-y-6">
            <div>
              <label htmlFor="service-select" className="block text-lg font-semibold text-textPrimary mb-2">{t('business.selectService')}</label>
              <select 
                id="service-select"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const service = business.services.find(s => s.id === e.target.value);
                  setSelectedService(service || null);
                }}
              >
                {business.services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({t('common.minutes', { count: service.durationMinutes })})
                  </option>
                ))}
              </select>
              {selectedService && (
                <p className="text-sm text-textSecondary mt-2">{selectedService.description}</p>
              )}
            </div>
            <div>
              <label htmlFor="date-picker" className="block text-lg font-semibold text-textPrimary mb-2">{t('business.selectDate')}</label>
              <input
                type="date"
                id="date-picker"
                min={today}
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Right side: Time slot picker */}
          <div>
            {selectedService ? (
              <TimeSlotPicker slots={availableSlots} onSelectSlot={handleSelectSlot} isLoading={isLoadingSlots} />
            ) : (
              <p className="text-textSecondary">{t('business.selectServiceFirst')}</p>
            )}
          </div>
        </div>
      </Card>
      
      {selectedSlot && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t('business.confirmBookingTitle')}
        >
          <div className="space-y-4">
            <p><span className="font-semibold">{t('business.business')}:</span> {business.name}</p>
            <p><span className="font-semibold">{t('business.service')}:</span> {selectedService?.name}</p>
            <div className="flex items-center">
              {CalendarIcon}
              <span className="ms-2 font-semibold">{selectedSlot.startTime.toLocaleDateString(i18n.language)}</span>
            </div>
            <div className="flex items-center">
              {ClockIcon}
              <span className="ms-2 font-semibold">{selectedSlot.startTime.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })} - {selectedSlot.endTime.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleConfirmBooking} isLoading={isAppContextLoading}>{t('common.confirm')}</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BusinessDetailPage;
