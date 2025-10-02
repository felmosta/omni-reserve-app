import { Business, Booking, User, Availability, BookingStatus, TimeSlot, Plan } from '../types';
import { USERS } from '../constants';

// --- MOCK DATABASE ---
let businesses: Business[] = [
  {
    id: 'biz1',
    ownerId: 'owner1',
    name: 'The Gourmet Place',
    category: 'Restaurant',
    address: '123 Foodie Lane, Flavor Town',
    description: 'Exquisite dining experience with a modern twist on classic cuisine. Perfect for special occasions.',
    imageUrl: 'https://picsum.photos/seed/restaurant/800/600',
    rating: 4.5,
    plan: Plan.PREMIUM,
    monthlyBookingQuota: Infinity,
    services: [
      { id: 'serv1-1', name: 'Table Reservation', description: 'A table for your dining experience.', durationMinutes: 90 },
    ],
    availability: {
      days: {
        Monday: { isOpen: true, startTime: '17:00', endTime: '22:00' },
        Tuesday: { isOpen: true, startTime: '17:00', endTime: '22:00' },
        Wednesday: { isOpen: true, startTime: '17:00', endTime: '22:00' },
        Thursday: { isOpen: true, startTime: '17:00', endTime: '22:00' },
        Friday: { isOpen: true, startTime: '17:00', endTime: '23:00' },
        Saturday: { isOpen: true, startTime: '17:00', endTime: '23:00' },
        Sunday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
      },
    },
  },
  {
    id: 'biz2',
    ownerId: 'owner2-temp', // A placeholder owner
    name: 'City Central Clinic',
    category: 'Medical Clinic',
    address: '456 Health Ave, Wellness City',
    description: 'Comprehensive medical services with state-of-the-art facilities and experienced doctors.',
    imageUrl: 'https://picsum.photos/seed/doctor/800/600',
    rating: 4.8,
    plan: Plan.FREE,
    monthlyBookingQuota: 10,
    services: [
      { id: 'serv2-1', name: 'Regular Check-up', description: 'A standard consultation with a doctor.', durationMinutes: 20 },
      { id: 'serv2-2', name: 'Follow-up Visit', description: 'A follow-up appointment.', durationMinutes: 15 },
    ],
    availability: {
      days: {
        Monday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
        Tuesday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
        Wednesday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
        Thursday: { isOpen: true, startTime: '09:00', endTime: '17:00' },
        Friday: { isOpen: true, startTime: '09:00', endTime: '13:00' },
        Saturday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        Sunday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
      },
    },
  },
  {
    id: 'biz3',
    ownerId: 'owner3-temp',
    name: 'Fresh Cuts Salon',
    category: 'Hair Salon',
    address: '789 Style St, Glamour Ville',
    description: 'Trendy haircuts, vibrant colors, and relaxing treatments from our expert stylists.',
    imageUrl: 'https://picsum.photos/seed/hair/800/600',
    rating: 3.9,
    plan: Plan.FREE,
    monthlyBookingQuota: 10,
    services: [
        { id: 'serv3-1', name: 'Men\'s Haircut', description: 'Classic men\'s haircut and style.', durationMinutes: 30 },
        { id: 'serv3-2', name: 'Women\'s Haircut', description: 'Shampoo, cut, and blow-dry.', durationMinutes: 60 },
        { id: 'serv3-3', name: 'Hair Coloring', description: 'Full hair coloring service. Price varies.', durationMinutes: 120 },
    ],
    availability: {
      days: {
        Monday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        Tuesday: { isOpen: true, startTime: '10:00', endTime: '19:00' },
        Wednesday: { isOpen: true, startTime: '10:00', endTime: '19:00' },
        Thursday: { isOpen: true, startTime: '10:00', endTime: '20:00' },
        Friday: { isOpen: true, startTime: '10:00', endTime: '20:00' },
        Saturday: { isOpen: true, startTime: '09:00', endTime: '18:00' },
        Sunday: { isOpen: false, startTime: '09:00', endTime: '17:00' },
      },
    },
  },
];

let bookings: Booking[] = [
  {
    id: 'book1',
    userId: 'client1',
    businessId: 'biz1',
    serviceId: 'serv1-1',
    slot: {
      startTime: new Date(new Date().setDate(new Date().getDate() + 3)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).getTime() + 90 * 60000),
    },
    status: BookingStatus.CONFIRMED,
    createdAt: new Date(),
  },
];

// --- API SIMULATION ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  getBusinesses: async (): Promise<Business[]> => {
    await simulateDelay(500);
    return JSON.parse(JSON.stringify(businesses)); // Deep copy
  },

  getBusinessById: async (id: string): Promise<Business | null> => {
    await simulateDelay(300);
    const business = businesses.find(b => b.id === id);
    return business ? JSON.parse(JSON.stringify(business)) : null;
  },

  createBusiness: async (data: Omit<Business, 'id' | 'rating' | 'plan' | 'monthlyBookingQuota'>): Promise<Business> => {
    await simulateDelay(600);
    const newBusiness: Business = {
      id: `biz${Date.now()}`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Random rating between 3.0 and 5.0
      plan: Plan.FREE,
      monthlyBookingQuota: 10,
      ...data
    };
    businesses.push(newBusiness);
    return JSON.parse(JSON.stringify(newBusiness));
  },
  
  updateBusiness: async (data: Business): Promise<Business> => {
    await simulateDelay(600);
    const index = businesses.findIndex(b => b.id === data.id);
    if (index === -1) throw new Error("Business not found");
    businesses[index] = data;
    return JSON.parse(JSON.stringify(data));
  },

  getAvailableSlots: async (businessId: string, date: Date, serviceDuration: number): Promise<TimeSlot[]> => {
    await simulateDelay(400);
    const business = businesses.find(b => b.id === businessId);
    if (!business || !serviceDuration) return [];

    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    const dayAvailability = business.availability.days[dayOfWeek];

    if (!dayAvailability || !dayAvailability.isOpen) return [];

    const slots: TimeSlot[] = [];
    const start = new Date(date);
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(date);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);
    end.setHours(endHour, endMinute, 0, 0);

    let currentSlotStart = new Date(start);
    const fifteenMinutes = 15 * 60000;

    while (currentSlotStart < end) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + serviceDuration * 60000);
      if (currentSlotEnd > end) break;

      const isBooked = bookings.some(b => {
        const bookingStart = new Date(b.slot.startTime);
        const bookingEnd = new Date(b.slot.endTime);
        return b.businessId === businessId &&
               b.status === BookingStatus.CONFIRMED &&
               (currentSlotStart < bookingEnd && currentSlotEnd > bookingStart); // Check for overlap
      });

      if (!isBooked) {
        slots.push({
          startTime: new Date(currentSlotStart),
          endTime: currentSlotEnd,
        });
      }
      currentSlotStart = new Date(currentSlotStart.getTime() + fifteenMinutes); // Check every 15 mins for a potential start
    }

    return slots;
  },

  getBookings: async (): Promise<Booking[]> => {
    await simulateDelay(500);
    // Deep copy, which turns Dates into strings
    const bookingsData = JSON.parse(JSON.stringify(bookings));
    // Re-hydrate date strings into Date objects
    return bookingsData.map((b: any) => ({
      ...b,
      slot: {
        startTime: new Date(b.slot.startTime),
        endTime: new Date(b.slot.endTime),
      },
      createdAt: new Date(b.createdAt),
    }));
  },

  createBooking: async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    await simulateDelay(700);
    
    // Monetization check
    const business = businesses.find(b => b.id === data.businessId);
    if (business && business.plan === Plan.FREE) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const confirmedBookingsThisMonth = bookings.filter(b => 
            b.businessId === data.businessId &&
            b.status === BookingStatus.CONFIRMED &&
            new Date(b.createdAt) >= startOfMonth
        ).length;

        if (confirmedBookingsThisMonth >= business.monthlyBookingQuota) {
            throw new Error("This business has reached its monthly booking limit. Please try again later.");
        }
    }

    // check for conflicts
    const conflict = bookings.some(b => {
        const bookingStart = new Date(b.slot.startTime);
        const bookingEnd = new Date(b.slot.endTime);
        return b.businessId === data.businessId &&
               b.status === BookingStatus.CONFIRMED &&
               (new Date(data.slot.startTime) < bookingEnd && new Date(data.slot.endTime) > bookingStart);
    });

    if (conflict) {
        throw new Error("This time slot is no longer available.");
    }

    const newBooking: Booking = {
      id: `book${Date.now()}`,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date(),
      ...data,
    };
    bookings.push(newBooking);
    
    // Return a deep copy with Date objects correctly reconstructed
    const copiedBooking = JSON.parse(JSON.stringify(newBooking));
    copiedBooking.slot.startTime = new Date(copiedBooking.slot.startTime);
    copiedBooking.slot.endTime = new Date(copiedBooking.slot.endTime);
    copiedBooking.createdAt = new Date(copiedBooking.createdAt);
    return copiedBooking;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await simulateDelay(500);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = BookingStatus.CANCELLED;
    } else {
      throw new Error("Booking not found");
    }
  },
};