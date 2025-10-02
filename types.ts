export enum UserRole {
  CLIENT = 'CLIENT',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}

export enum Plan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string; // Only for business owners
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  address: string;
  description: string;
  imageUrl: string;
  availability: Availability;
  services: Service[];
  rating: number;
  plan: Plan;
  monthlyBookingQuota: number;
}

export interface Availability {
  days: {
    [day: string]: {
      isOpen: boolean;
      startTime: string; // "HH:MM"
      endTime: string; // "HH:MM"
    };
  };
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
}

export interface Booking {
  id: string;
  userId: string;
  businessId: string;
  serviceId: string;
  slot: TimeSlot;
  status: BookingStatus;
  createdAt: Date;
}