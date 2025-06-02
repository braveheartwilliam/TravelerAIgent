/**
 * Type definitions for the Trip-related entities
 * Based on the comprehensive requirements in the Trips.md specification
 */

// Enum types
export type TripStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold' | 'deleted';
export type TripType = 'land_cruise' | 'ship_cruise' | 'guided_trip' | 'user_planned_trip';
export type TripVisibility = 'public' | 'private';
export type DestinationType = 'city' | 'place_of_interest' | 'port' | 'ship_cruise_port' | 'land_cruise_stop' | 'guided_trip_stop' | 'user_planned_trip_stop';
export type TransportationType = 'car' | 'bus' | 'train' | 'plane' | 'boat' | 'ship' | 'other';
export type LodgingType = 'hotel' | 'motel' | 'vacation_rental' | 'apartment' | 'cruise_ship_cabin' | 'hostel' | 'camping' | 'other';
export type ActivityType = 'sightseeing' | 'tour' | 'dining' | 'entertainment' | 'adventure' | 'relaxation' | 'shopping' | 'other';
export type SharingPermission = 'view' | 'edit' | 'admin';

// Base interface for common properties
interface BaseEntity {
  id: number;
  created_at: Date;
  updated_at: Date;
}

// Trip entity
export interface Trip extends BaseEntity {
  user_id: number;
  title: string;
  description: string | null;
  start_date: Date;
  end_date: Date;
  visibility: TripVisibility;
  type: TripType;
  status: TripStatus;
  budget_planned: number | null;
  budget_actual: number | null;
  currency: string;
  booking_number: string | null;
  confirmation_number: string | null;
  
  // Relationships (not stored in the database)
  destinations?: Destination[];
  transportation?: Transportation[];
  travelers?: Traveler[];
  payment_schedules?: PaymentSchedule[];
}

// Destination entity
export interface Destination extends BaseEntity {
  trip_id: number;
  name: string;
  description: string | null;
  type: DestinationType;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  arrival_date: Date;
  departure_date: Date;
  duration_days: number | null;
  budget_planned: number | null;
  budget_actual: number | null;
  currency: string;
  status: TripStatus;
  is_start_location: boolean;
  is_end_location: boolean;
  earliest_arrival: Date | null;
  latest_arrival: Date | null;
  earliest_departure: Date | null;
  latest_departure: Date | null;
  order_index: number;
  
  // Relationships (not stored in the database)
  lodging?: Lodging;
  activities?: Activity[];
  transportation_from?: Transportation[];
  transportation_to?: Transportation[];
}

// Transportation entity
export interface Transportation extends BaseEntity {
  trip_id: number;
  from_destination_id: number;
  to_destination_id: number;
  type: TransportationType;
  provider: string | null;
  transport_number: string | null;
  description: string | null;
  departure_date: Date;
  arrival_date: Date;
  duration_hours: number | null;
  departure_location: string | null;
  arrival_location: string | null;
  transport_class: string | null;
  fare: number | null;
  currency: string;
  status: TripStatus;
  confirmation_number: string | null;
  booking_number: string | null;
  terminal: string | null;
  gate: string | null;
  seat_number: string | null;
  meal_plan: string | null;
  baggage_allowance: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  provider_website: string | null;
  earliest_departure: Date | null;
  latest_departure: Date | null;
  earliest_arrival: Date | null;
  latest_arrival: Date | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
  
  // Relationships (not stored in the database)
  from_destination?: Destination;
  to_destination?: Destination;
}

// Lodging entity
export interface Lodging extends BaseEntity {
  trip_id: number;
  destination_id: number;
  name: string;
  type: LodgingType;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  arrival_date: Date;
  departure_date: Date;
  duration_nights: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  cost_per_night: number | null;
  total_cost: number | null;
  currency: string;
  status: TripStatus;
  confirmation_number: string | null;
  booking_number: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  provider_website: string | null;
  provider_phone: string | null;
  earliest_arrival: Date | null;
  latest_arrival: Date | null;
  earliest_departure: Date | null;
  latest_departure: Date | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
  
  // Relationships (not stored in the database)
  destination?: Destination;
}

// Activity entity
export interface Activity extends BaseEntity {
  trip_id: number;
  destination_id: number;
  name: string;
  type: ActivityType;
  description: string | null;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  start_date: Date;
  end_date: Date;
  duration_hours: number | null;
  cost: number | null;
  currency: string;
  status: TripStatus;
  confirmation_number: string | null;
  booking_number: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  provider_website: string | null;
  provider_phone: string | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
  
  // Relationships (not stored in the database)
  destination?: Destination;
}

// Traveler entity
export interface Traveler extends BaseEntity {
  trip_id: number;
  user_id: number | null;
  name: string;
  email: string | null;
  phone: string | null;
  is_trip_creator: boolean;
  is_companion: boolean;
  
  // Relationships (not stored in the database)
  trip?: Trip;
  user?: any; // User type
}

// Trip Sharing entity
export interface TripSharing extends BaseEntity {
  trip_id: number;
  user_id: number;
  permission: SharingPermission;
  
  // Relationships (not stored in the database)
  trip?: Trip;
  user?: any; // User type
}

// Payment Schedule entity
export interface PaymentSchedule extends BaseEntity {
  trip_id: number;
  payment_date: Date;
  amount: number;
  currency: string;
  description: string | null;
  is_paid: boolean;
  actual_payment_date: Date | null;
  
  // Relationships (not stored in the database)
  trip?: Trip;
}

// Input types for creating new entities
export type NewTrip = Omit<Trip, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewDestination = Omit<Destination, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewTransportation = Omit<Transportation, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewLodging = Omit<Lodging, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewActivity = Omit<Activity, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewTraveler = Omit<Traveler, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewTripSharing = Omit<TripSharing, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type NewPaymentSchedule = Omit<PaymentSchedule, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};
