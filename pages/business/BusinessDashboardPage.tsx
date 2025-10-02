import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { UserRole, BookingStatus, Plan } from '../../types';
import { Link, Navigate } from 'react-router-dom';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const BusinessDashboardPage: React.FC = () => {
  const { currentUser, getBusinessForOwner, bookings } = useAppContext();
  const { t } = useTranslation();

  if (currentUser.role !== UserRole.BUSINESS_OWNER) {
    return <Navigate to="/" replace />;
  }

  const business = getBusinessForOwner(currentUser.id);

  if (!business) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-textPrimary">{t('dashboard.welcome', { name: currentUser.name })}</h1>
        <p className="text-lg text-textSecondary mt-2">{t('dashboard.notRegistered')}</p>
        <Link to="/dashboard/register">
          <Button className="mt-6">{t('dashboard.registerYourBusiness')}</Button>
        </Link>
      </div>
    );
  }

  const businessBookings = bookings.filter(b => b.businessId === business.id);
  const upcomingBookings = businessBookings.filter(b => b.status === BookingStatus.CONFIRMED && new Date(b.slot.startTime) > new Date());
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const confirmedBookingsThisMonth = businessBookings.filter(b => 
      b.status === BookingStatus.CONFIRMED &&
      new Date(b.createdAt) >= startOfMonth
  ).length;
  
  const totalConfirmedBookings = businessBookings.filter(b => b.status === BookingStatus.CONFIRMED).length;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">{t('dashboard.dashboardFor', { businessName: business.name })}</h1>
      
      <Card className="p-6 bg-primary/10 border border-primary">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-primary">{t('dashboard.currentPlan', { plan: t(`plans.${business.plan}`) })}</h2>
            {business.plan === Plan.FREE && (
              <p className="text-textSecondary mt-1">
                {t('dashboard.quotaUsed', { used: confirmedBookingsThisMonth, total: business.monthlyBookingQuota })}
              </p>
            )}
          </div>
          {business.plan === Plan.FREE && (
            <Button onClick={() => toast.success('Premium plans coming soon!')}>
              {t('dashboard.upgradePlan')}
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <h2 className="text-4xl font-bold text-primary">{upcomingBookings.length}</h2>
          <p className="text-textSecondary">{t('dashboard.upcomingReservations')}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-4xl font-bold text-primary">{totalConfirmedBookings}</h2>
          <p className="text-textSecondary">{t('dashboard.totalBookings')}</p>
        </Card>
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-primary pt-2">{business.category}</h2>
          <p className="text-textSecondary">{t('dashboard.category')}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-textPrimary mb-4">{t('dashboard.quickActions')}</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/dashboard/bookings"><Button>{t('dashboard.manageBookings')}</Button></Link>
          <Link to="/dashboard/profile"><Button variant="secondary">{t('dashboard.editProfile')}</Button></Link>
        </div>
      </Card>
    </div>
  );
};

export default BusinessDashboardPage;