import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { USERS } from '../../constants';
import { UserRole } from '../../types';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { currentUser, switchUser } = useAppContext();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLinkStyle = {
    color: '#4f46e5',
    fontWeight: '600',
  };
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const navLinks = (
    <>
      {currentUser.role === UserRole.CLIENT && (
        <>
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-textSecondary hover:text-primary transition-colors block md:inline-block py-2 md:py-0" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.findService')}
          </NavLink>
          <NavLink to="/my-reservations" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-textSecondary hover:text-primary transition-colors block md:inline-block py-2 md:py-0" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.myReservations')}
          </NavLink>
        </>
      )}
      {currentUser.role === UserRole.BUSINESS_OWNER && (
        <>
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-textSecondary hover:text-primary transition-colors block md:inline-block py-2 md:py-0" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.dashboard')}
          </NavLink>
          <NavLink to="/dashboard/profile" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-textSecondary hover:text-primary transition-colors block md:inline-block py-2 md:py-0" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.profile')}
          </NavLink>
          <NavLink to="/dashboard/bookings" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-textSecondary hover:text-primary transition-colors block md:inline-block py-2 md:py-0" onClick={() => setIsMobileMenuOpen(false)}>
            {t('navbar.bookings')}
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="bg-surface shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <NavLink to="/" className="text-2xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
            {t('appName')}
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navLinks}
            </nav>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-textSecondary hidden sm:block">
                {t('welcomeMessage', { name: currentUser.name.split(' ')[0] })}
              </span>
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                className="p-2 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {Object.values(USERS).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="p-2 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {languages.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open navigation menu" className="text-textPrimary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2 px-2">
              {navLinks}
            </nav>
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t px-2">
              <span className="text-sm text-textSecondary">
                {t('welcomeMessage', { name: currentUser.name.split(' ')[0] })}
              </span>
              <select
                value={currentUser.id}
                onChange={(e) => { switchUser(e.target.value); setIsMobileMenuOpen(false); }}
                className="p-2 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {Object.values(USERS).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <select
                value={i18n.language}
                onChange={(e) => { handleLanguageChange(e.target.value); setIsMobileMenuOpen(false); }}
                className="p-2 border rounded-md bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {languages.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;