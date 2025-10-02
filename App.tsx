import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/shared/Navbar';
import HomePage from './pages/client/HomePage';
import BusinessDetailPage from './pages/client/BusinessDetailPage';
import MyReservationsPage from './pages/client/MyReservationsPage';
import BusinessDashboardPage from './pages/business/BusinessDashboardPage';
import ProfilePage from './pages/business/ProfilePage';
import ManageBookingsPage from './pages/business/ManageBookingsPage';
import RegisterBusinessPage from './pages/business/RegisterBusinessPage';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto p-4 md:p-8">
            <Routes>
              {/* Client Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/business/:id" element={<BusinessDetailPage />} />
              <Route path="/my-reservations" element={<MyReservationsPage />} />
              
              {/* Business Routes */}
              <Route path="/dashboard" element={<BusinessDashboardPage />} />
              <Route path="/dashboard/register" element={<RegisterBusinessPage />} />
              <Route path="/dashboard/profile" element={<ProfilePage />} />
              <Route path="/dashboard/bookings" element={<ManageBookingsPage />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
           <footer className="bg-white shadow-md mt-8">
              <div className="container mx-auto py-4 px-8 text-center text-textSecondary text-sm">
                &copy; {new Date().getFullYear()} OmniReserve. All rights reserved.
              </div>
          </footer>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;