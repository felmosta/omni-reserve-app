import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import { USERS } from '../../constants';
import { UserRole } from '../../types';
import { useTranslation } from 'react-i18next';

const Logo: React.FC = () => (
  <svg className="h-8 w-auto text-primary" viewBox="0 0 142 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50.22 23.232c-2.715 0-5.238-.57-7.57-1.71-2.33-1.14-4.244-2.73-5.74-4.77-1.498-2.04-2.247-4.41-2.247-7.11 0-2.715.749-5.085 2.247-7.125 1.496-2.04 3.41-3.63 5.74-4.77 2.332-1.14 4.855-1.71 7.57-1.71s5.238.57 7.57 1.71c2.33 1.14 4.244 2.73 5.74 4.77 1.498 2.04 2.247 4.41 2.247 7.125 0 2.7-.749 5.07-2.247 7.11-1.496 2.04-3.41 3.63-5.74 4.77-2.332 1.14-4.855 1.71-7.57 1.71zm0-4.08c1.657 0 3.195-.36 4.614-1.08 1.42-.72 2.61-1.755 3.57-3.105 1.05-1.44 1.575-3.15 1.575-5.13 0-1.98-.525-3.69-1.575-5.13-.96-1.35-2.15-2.385-3.57-3.105-1.419-.72-2.957-1.08-4.614-1.08-1.657 0-3.18.36-4.575 1.08-1.395.72-2.565 1.755-3.51 3.105-1.035 1.44-1.552 3.15-1.552 5.13 0 1.98.517 3.69 1.552 5.13.945 1.35 2.115 2.385 3.51 3.105 1.395.72 2.918 1.08 4.575 1.08zM72.585.882h4.5v22.44h-4.5V.882zm21.36 15.3l-5.91-10.89h5.13l3.42 6.39 3.42-6.39h4.95l-5.85 10.89v6.54h-4.2v-6.54zm23.01-15.3h4.5v18.36h8.88v4.08h-13.38V.882zm-83.19 8.01c0-2.34.78-4.305 2.34-5.895 1.56-1.59 3.54-2.385 5.94-2.385 1.56 0 2.97.285 4.23.855l-1.17 3.78c-.99-.39-1.98-.585-2.97-.585-1.29 0-2.325.465-3.105 1.395-.78.93-.99 2.1-1.08 3.51h7.56v3.78h-7.56c.09 1.41.3 2.58.72 3.51.42.93 1.095 1.62 2.025 2.07.93.45 1.935.675 3.015.675 1.08 0 2.07-.21 2.97-.63l1.17 3.78c-1.26.66-2.73.99-4.41.99-2.4 0-4.38-.795-5.94-2.385-1.56-1.59-2.34-3.57-2.34-5.94zM13.215.882h4.5v13.59l8.37-13.59h5.58l-8.64 13.5v8.94h-4.5V14.382L10.005 23.322h-5.4L13.215 14.382V.882zm114.63 2.79c-1.29-.81-2.82-1.215-4.59-1.215-1.59 0-2.97.435-4.14 1.305-1.17.87-2.085 2.07-2.745 3.6-1.29 2.97-1.935 6.345-1.935 10.125 0 3.78.645 7.155 1.935 10.125.66 1.53 1.575 2.73 2.745 3.6 1.17.87 2.55 1.305 4.14 1.305 1.77 0 3.3-.405 4.59-1.215 1.29-.81 2.325-1.995 3.105-3.555.78-1.56 1.17-3.465 1.17-5.715h-4.68c0 1.32-.21 2.445-.63 3.375-.42.93-.99 1.65-1.71 2.16-.72.51-1.545.765-2.475.765s-1.725-.255-2.43-.765c-.705-.51-1.26-1.23-1.665-2.16-.405-.93-.607-2.055-.607-3.375h9.45c0-2.25-.39-4.155-1.17-5.715-.78-1.56-1.815-2.745-3.105-3.555z"></path>
  </svg>
);


const Navbar: React.FC = () => {
  const { currentUser, switchUser } = useAppContext();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLinkStyle = {
    color: '#5b21b6', // Updated to match new primary color
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
            <Logo />
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
