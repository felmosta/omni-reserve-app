
import React from 'react';
import { User, UserRole } from './types';

export const USERS: { [key: string]: User } = {
  client1: {
    id: 'client1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: UserRole.CLIENT,
  },
  owner1: {
    id: 'owner1',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: UserRole.BUSINESS_OWNER,
    businessId: 'biz1',
  },
   owner2: {
    id: 'owner2',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: UserRole.BUSINESS_OWNER,
    businessId: undefined, // hasn't registered a business yet
  },
};

export const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// SVG Icons
// FIX: Converted JSX to React.createElement calls to be valid in a .ts file
export const CalendarIcon = React.createElement(
  'svg', 
  { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })
);

export const ClockIcon = React.createElement(
  'svg',
  { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
);

export const LocationIcon = React.createElement(
  'svg',
  { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
);

export const UserIcon = React.createElement(
  'svg',
  { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
  React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
);

export const StarIcon = React.createElement(
  'svg',
  { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 20 20" },
  React.createElement('path', { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
);