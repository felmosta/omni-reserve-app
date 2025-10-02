import React from 'react';
import { TimeSlot } from '../../types';
import Button from '../shared/Button';
import { useTranslation } from 'react-i18next';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
  isLoading: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ slots, onSelectSlot, isLoading }) => {
  const { t, i18n } = useTranslation();

  if (isLoading) {
    return <div className="text-center p-4">{t('common.loading')}</div>;
  }

  if (slots.length === 0) {
    return <div className="text-center p-4 text-textSecondary bg-gray-50 rounded-md">{t('business.noSlots')}</div>;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h3 className="font-semibold mb-3 text-textPrimary">{t('business.availableTimes')}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.startTime.toISOString()}
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-400"
            onClick={() => onSelectSlot(slot)}
          >
            {formatTime(slot.startTime)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;