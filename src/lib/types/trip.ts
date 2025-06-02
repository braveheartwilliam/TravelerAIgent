export type TripStatus = 'draft' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold' | 'deleted' | 'archived' | 'planned' | 'confirmed';

export type TripType = 'land-cruise' | 'ship-cruise' | 'guided-trip' | 'user-planned';

export type TripVisibility = 'public' | 'private' | 'friends';

export interface Destination {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  budget?: number;
  status?: TripStatus;
  type?: 'city' | 'place-of-interest' | 'port';
  activities?: Activity[];
  lodging?: Lodging;
}

export interface Transportation {
  id: string;
  name: string;
  type: 'air' | 'sea' | 'land';
  description: string;
  startDate: Date;
  endDate: Date;
  durationHours: number;
  budget?: number;
  status?: TripStatus;
  isIncluded?: boolean;
  startLocation: string;
  endLocation: string;
  confirmationNumber?: string;
  earliestArrival?: Date;
  latestArrival?: Date;
  earliestDeparture?: Date;
  latestDeparture?: Date;
  // Additional properties needed by the trip page component
  embarkationDestinationId?: string;
  disembarkationDestinationId?: string;
  departureTime?: Date;
  arrivalTime?: Date;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'sightseeing' | 'tour' | 'adventure' | 'cultural' | 'entertainment' | 'food' | 'shopping' | 'relaxation' | 'sports' | 'other';
  startDate: Date;
  endDate?: Date;
  budget?: number;
  status?: TripStatus;
  isScheduled?: boolean;
  isShared?: boolean;
  isPaid?: boolean;
  location: string;
  destinationId: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional properties needed by the trip page component
  startTime?: Date;
  endTime?: Date;
}

export interface Lodging {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'airbnb' | 'hostel' | 'apartment' | 'guesthouse' | 'villa' | 'cabin' | 'camping' | 'other';
  address: string;
  description: string;
  checkInDate: Date;
  checkOutDate: Date;
  cost?: number;
  status?: TripStatus;
  isScheduled?: boolean;
  isShared?: boolean;
  isPaid?: boolean;
  bookingConfirmation?: string;
  destinationId: string;
  roomType?: string;
  amenities?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Traveler {
  id: string;
  name: string;
  email?: string;
  isUser: boolean;
  isCreator: boolean;
  tripId: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: TripStatus;
  type: TripType;
  visibility: TripVisibility;
  startLocation?: string;
  destinations: Destination[];
  transportation: Transportation[];
  activities: Activity[];
  lodgings: Lodging[];
  travelers: Traveler[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripSummary {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  type: TripType;
  visibility: TripVisibility;
  budget?: number;
  destinationCount: number;
  travelerCount: number;
  mainDestination?: string;
  coverImage?: string;
  durationDays?: number;
}
