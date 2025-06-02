import type { TripStatus } from './trip';

export interface ImportedDestination {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  status: TripStatus;
  type: 'city' | 'country' | 'region' | 'landmark' | 'place-of-interest' | 'port' | 'other';
  tripId: string;
  notes: string;
  budget?: number;
  [key: string]: any; // Index signature to allow bracket notation
}

export interface ImportedTransportation {
  id: string;
  name: string;
  type: 'land' | 'air' | 'sea';
  departureLocation: string;
  arrivalLocation: string;
  departureDateTime: Date;
  arrivalDateTime: Date;
  confirmationNumber: string;
  notes: string;
  startLocation: string;
  endLocation: string;
  cost: number;
  durationHours: number;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  tripId: string;
  destinationId?: string;
  provider: string;
  currency: string;
  bookingConfirmation: string;
  [key: string]: any; // Index signature to allow bracket notation
}

export interface ImportedActivity {
  id: string;
  tripId: string;
  destinationId: string;
  name: string;
  type: 'sightseeing' | 'tour' | 'adventure' | 'cultural' | 'entertainment' | 'food' | 'shopping' | 'relaxation' | 'sports' | 'other';
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  notes: string;
  status: TripStatus;
  isScheduled?: boolean;
  isShared?: boolean;
  isPaid?: boolean;
  startTime?: Date;
  endTime?: Date;
  [key: string]: any; // Index signature to allow bracket notation
}

export interface ImportedLodging {
  id: string;
  tripId: string;
  destinationId: string;
  name: string;
  type: 'hotel' | 'resort' | 'airbnb' | 'hostel' | 'apartment' | 'guesthouse' | 'villa' | 'cabin' | 'camping' | 'other';
  address: string;
  description: string;
  checkInDate: Date;
  checkOutDate: Date;
  cost: number;
  status: TripStatus;
  bookingConfirmation: string;
  roomType?: string;
  amenities?: string[];
  notes?: string;
  isScheduled?: boolean;
  isShared?: boolean;
  isPaid?: boolean;
  numberOfGuests?: number;
  currency?: string;
  confirmationNumber?: string;
  [key: string]: any; // Index signature to allow bracket notation
}
