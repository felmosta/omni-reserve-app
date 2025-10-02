import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Booking, BookingStatus } from '../../types';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import Button from '../../components/shared/Button';
import { useTranslation } from 'react-i18next';

const BookingItem: React.FC<{ booking: Booking, businessName: string, serviceName: string, onCancel: (id: string) => void, isCancelling: boolean }> = ({ booking, businessName, serviceName, onCancel, isCancelling }) => {
    const { t, i18n } = useTranslation();
    const isUpcoming = booking.status === BookingStatus.CONFIRMED && booking.slot.startTime > new Date();
    
    const statusText = {
      [BookingStatus.CONFIRMED]: t('common.confirmed'),
      [BookingStatus.CANCELLED]: t('common.cancelled'),
      [BookingStatus.PENDING]: t('common.pending'),
    }

    return (
        <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 className="font-bold text-lg text-primary">{businessName}</h3>
                <p className="font-semibold text-textPrimary">{serviceName}</p>
                <p className="text-textSecondary">{booking.slot.startTime.toLocaleString(i18n.language)}</p>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {statusText[booking.status]}
                </span>
            </div>
            {isUpcoming && (
                <Button variant="danger" onClick={() => onCancel(booking.id)} isLoading={isCancelling}>
                    {t('reservations.cancel')}
                </Button>
            )}
        </Card>
    );
};


const MyReservationsPage: React.FC = () => {
  const { bookings, currentUser, businesses, cancelBooking, isLoading } = useAppContext();
  const { t } = useTranslation();

  const userBookings = bookings
    .filter(b => b.userId === currentUser.id)
    .sort((a, b) => new Date(b.slot.startTime).getTime() - new Date(a.slot.startTime).getTime());
  
  const getBookingDetails = (booking: Booking) => {
      const business = businesses.find(b => b.id === booking.businessId);
      const service = business?.services.find(s => s.id === booking.serviceId);
      return {
          businessName: business?.name || 'Unknown Business',
          serviceName: service?.name || 'Unknown Service'
      }
  }

  if (isLoading && userBookings.length === 0) {
      return <Spinner />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">{t('reservations.myReservations')}</h1>
      {userBookings.length > 0 ? (
        <div className="space-y-4">
          {userBookings.map(booking => {
            const { businessName, serviceName } = getBookingDetails(booking);
            return (
              <BookingItem 
                key={booking.id} 
                booking={booking}
                businessName={businessName}
                serviceName={serviceName}
                onCancel={cancelBooking}
                isCancelling={isLoading}
              />
            )
          })}
        </div>
      ) : (
        <Card className="text-center p-8">
            <h2 className="text-xl font-semibold text-textPrimary">{t('reservations.noReservations')}</h2>
            <p className="text-textSecondary mt-2">{t('reservations.bookFirstService')}</p>
        </Card>
      )}
    </div>
  );
};

export default MyReservationsPage;