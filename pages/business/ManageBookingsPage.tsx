import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { User, UserRole, BookingStatus } from '../../types';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import Button from '../../components/shared/Button';
import { useTranslation, Trans } from 'react-i18next';

const ManageBookingsPage: React.FC = () => {
  const { currentUser, getBusinessForOwner, bookings, cancelBooking, isLoading } = useAppContext();
  const { t, i18n } = useTranslation();
  const business = getBusinessForOwner(currentUser.id);

  if (currentUser.role !== UserRole.BUSINESS_OWNER) return <Navigate to="/" replace />;
  if (!business) return <div className="text-center"><Trans i18nKey="profile.registerFirst"><Link to="/dashboard/register" className="text-primary underline"></Link></Trans></div>;

  const businessBookings = bookings
    .filter(b => b.businessId === business.id)
    .sort((a, b) => new Date(b.slot.startTime).getTime() - new Date(a.slot.startTime).getTime());
    
  const getUserById = (id: string): Partial<User> => {
      // In a real app, this would be an API call or a more robust lookup.
      const users: { [key: string]: User } = {
        client1: { id: 'client1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.CLIENT },
      };
      return users[id] || { name: 'Unknown Client', email: 'N/A'};
  }
  
  const getServiceName = (serviceId: string) => {
      return business?.services.find(s => s.id === serviceId)?.name || 'Unknown Service';
  }

  const statusText = {
      [BookingStatus.CONFIRMED]: t('common.confirmed'),
      [BookingStatus.CANCELLED]: t('common.cancelled'),
      [BookingStatus.PENDING]: t('common.pending'),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">{t('bookings.manageFor', { businessName: business.name })}</h1>
      
      {isLoading && businessBookings.length === 0 && <Spinner />}
      
      {businessBookings.length > 0 ? (
        <>
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
              {businessBookings.map(booking => {
                  const client = getUserById(booking.userId);
                  const isCancellable = booking.status === BookingStatus.CONFIRMED && new Date(booking.slot.startTime) > new Date();
                  return (
                      <Card key={booking.id} className="p-4 space-y-3">
                          <div>
                              <p className="font-semibold text-textPrimary">{client.name}</p>
                              <p className="text-sm text-textSecondary">{client.email}</p>
                          </div>
                          <p className="text-sm text-textPrimary font-medium">{getServiceName(booking.serviceId)}</p>
                          <p className="text-sm text-textSecondary">{new Date(booking.slot.startTime).toLocaleString(i18n.language)}</p>
                          <div className="flex justify-between items-center pt-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                  {statusText[booking.status]}
                              </span>
                              {isCancellable ? (
                                  <Button variant="danger" className="text-xs px-2 py-1" onClick={() => cancelBooking(booking.id)} isLoading={isLoading}>
                                      {t('common.cancel')}
                                  </Button>
                              ) : (
                                  <span className="text-textSecondary text-xs">{t('bookings.noActions')}</span>
                              )}
                          </div>
                      </Card>
                  )
              })}
          </div>

          {/* Desktop View: Table */}
          <Card className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-textSecondary uppercase tracking-wider">{t('bookings.client')}</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-textSecondary uppercase tracking-wider">{t('bookings.service')}</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-textSecondary uppercase tracking-wider">{t('bookings.dateTime')}</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-textSecondary uppercase tracking-wider">{t('bookings.status')}</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-textSecondary uppercase tracking-wider">{t('bookings.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businessBookings.map(booking => {
                  const client = getUserById(booking.userId);
                  const isCancellable = booking.status === BookingStatus.CONFIRMED && new Date(booking.slot.startTime) > new Date();
                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-textPrimary">{client.name}</div>
                          <div className="text-sm text-textSecondary">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">{getServiceName(booking.serviceId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{new Date(booking.slot.startTime).toLocaleString(i18n.language)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {statusText[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isCancellable ? (
                          <Button variant="danger" className="text-xs px-2 py-1" onClick={() => cancelBooking(booking.id)} isLoading={isLoading}>
                              {t('common.cancel')}
                          </Button>
                        ) : (
                          <span className="text-textSecondary text-xs">{t('bookings.noActions')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      ) : (
        <Card className="text-center p-8">
            <h2 className="text-xl font-semibold text-textPrimary">{t('bookings.noBookings')}</h2>
            <p className="text-textSecondary mt-2">{t('bookings.shareProfile')}</p>
        </Card>
      )}
    </div>
  );
};

export default ManageBookingsPage;