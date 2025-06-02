import { z } from 'zod';

// Enum schemas
export const tripStatusSchema = z.enum([
  'draft', 
  'in_progress', 
  'completed', 
  'cancelled', 
  'on_hold', 
  'deleted'
]);

export const tripTypeSchema = z.enum([
  'land_cruise', 
  'ship_cruise', 
  'guided_trip', 
  'user_planned_trip'
]);

export const tripVisibilitySchema = z.enum([
  'public', 
  'private'
]);

export const destinationTypeSchema = z.enum([
  'city', 
  'place_of_interest', 
  'port', 
  'ship_cruise_port', 
  'land_cruise_stop', 
  'guided_trip_stop', 
  'user_planned_trip_stop'
]);

export const transportationTypeSchema = z.enum([
  'car', 
  'bus', 
  'train', 
  'plane', 
  'boat', 
  'ship', 
  'other'
]);

export const lodgingTypeSchema = z.enum([
  'hotel', 
  'motel', 
  'vacation_rental', 
  'apartment', 
  'cruise_ship_cabin', 
  'hostel', 
  'camping', 
  'other'
]);

export const activityTypeSchema = z.enum([
  'sightseeing', 
  'tour', 
  'dining', 
  'entertainment', 
  'adventure', 
  'relaxation', 
  'shopping', 
  'other'
]);

export const sharingPermissionSchema = z.enum([
  'view', 
  'edit', 
  'admin'
]);

// Base schema for common properties
const baseEntitySchema = z.object({
  id: z.number().int().positive(),
  created_at: z.date(),
  updated_at: z.date()
});

// Trip schema
export const tripSchema = baseEntitySchema.extend({
  user_id: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().nullable(),
  start_date: z.date(),
  end_date: z.date(),
  visibility: tripVisibilitySchema,
  type: tripTypeSchema,
  status: tripStatusSchema,
  budget_planned: z.number().nonnegative().nullable(),
  budget_actual: z.number().nonnegative().nullable(),
  currency: z.string().default("USD"),
  booking_number: z.string().nullable(),
  confirmation_number: z.string().nullable()
}).refine(data => data.end_date >= data.start_date, {
  message: "End date must be after or equal to start date",
  path: ["end_date"]
});

// Destination schema
export const destinationSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable(),
  type: destinationTypeSchema,
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  arrival_date: z.date(),
  departure_date: z.date(),
  duration_days: z.number().int().nonnegative().nullable(),
  budget_planned: z.number().nonnegative().nullable(),
  budget_actual: z.number().nonnegative().nullable(),
  currency: z.string().default("USD"),
  status: tripStatusSchema,
  is_start_location: z.boolean().default(false),
  is_end_location: z.boolean().default(false),
  earliest_arrival: z.date().nullable(),
  latest_arrival: z.date().nullable(),
  earliest_departure: z.date().nullable(),
  latest_departure: z.date().nullable(),
  order_index: z.number().int().nonnegative()
}).refine(data => data.departure_date >= data.arrival_date, {
  message: "Departure date must be after or equal to arrival date",
  path: ["departure_date"]
});

// Transportation schema
export const transportationSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  from_destination_id: z.number().int().positive(),
  to_destination_id: z.number().int().positive(),
  type: transportationTypeSchema,
  provider: z.string().nullable(),
  transport_number: z.string().nullable(),
  description: z.string().nullable(),
  departure_date: z.date(),
  arrival_date: z.date(),
  duration_hours: z.number().nonnegative().nullable(),
  departure_location: z.string().nullable(),
  arrival_location: z.string().nullable(),
  transport_class: z.string().nullable(),
  fare: z.number().nonnegative().nullable(),
  currency: z.string().default("USD"),
  status: tripStatusSchema,
  confirmation_number: z.string().nullable(),
  booking_number: z.string().nullable(),
  terminal: z.string().nullable(),
  gate: z.string().nullable(),
  seat_number: z.string().nullable(),
  meal_plan: z.string().nullable(),
  baggage_allowance: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  provider_website: z.string().url().nullable(),
  earliest_departure: z.date().nullable(),
  latest_departure: z.date().nullable(),
  earliest_arrival: z.date().nullable(),
  latest_arrival: z.date().nullable(),
  is_shared: z.boolean().default(false),
  is_private: z.boolean().default(false),
  is_paid: z.boolean().default(true),
  is_scheduled: z.boolean().default(true)
}).refine(data => data.arrival_date >= data.departure_date, {
  message: "Arrival date must be after or equal to departure date",
  path: ["arrival_date"]
}).refine(data => data.from_destination_id !== data.to_destination_id, {
  message: "From and To destinations must be different",
  path: ["to_destination_id"]
});

// Lodging schema
export const lodgingSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  destination_id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(255),
  type: lodgingTypeSchema,
  description: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  arrival_date: z.date(),
  departure_date: z.date(),
  duration_nights: z.number().int().nonnegative().nullable(),
  check_in_time: z.string().nullable(),
  check_out_time: z.string().nullable(),
  cost_per_night: z.number().nonnegative().nullable(),
  total_cost: z.number().nonnegative().nullable(),
  currency: z.string().default("USD"),
  status: tripStatusSchema,
  confirmation_number: z.string().nullable(),
  booking_number: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  provider_website: z.string().url().nullable(),
  provider_phone: z.string().nullable(),
  earliest_arrival: z.date().nullable(),
  latest_arrival: z.date().nullable(),
  earliest_departure: z.date().nullable(),
  latest_departure: z.date().nullable(),
  is_shared: z.boolean().default(false),
  is_private: z.boolean().default(false),
  is_paid: z.boolean().default(true),
  is_scheduled: z.boolean().default(true)
}).refine(data => data.departure_date >= data.arrival_date, {
  message: "Departure date must be after or equal to arrival date",
  path: ["departure_date"]
});

// Activity schema
export const activitySchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  destination_id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(255),
  type: activityTypeSchema,
  description: z.string().nullable(),
  location: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  start_date: z.date(),
  end_date: z.date(),
  duration_hours: z.number().nonnegative().nullable(),
  cost: z.number().nonnegative().nullable(),
  currency: z.string().default("USD"),
  status: tripStatusSchema,
  confirmation_number: z.string().nullable(),
  booking_number: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_phone: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  provider_website: z.string().url().nullable(),
  provider_phone: z.string().nullable(),
  is_shared: z.boolean().default(false),
  is_private: z.boolean().default(false),
  is_paid: z.boolean().default(true),
  is_scheduled: z.boolean().default(true)
}).refine(data => data.end_date >= data.start_date, {
  message: "End date must be after or equal to start date",
  path: ["end_date"]
});

// Traveler schema
export const travelerSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  user_id: z.number().int().positive().nullable(),
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  is_trip_creator: z.boolean().default(false),
  is_companion: z.boolean().default(true)
});

// Trip Sharing schema
export const tripSharingSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  permission: sharingPermissionSchema
});

// Payment Schedule schema
export const paymentScheduleSchema = baseEntitySchema.extend({
  trip_id: z.number().int().positive(),
  payment_date: z.date(),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  description: z.string().nullable(),
  is_paid: z.boolean().default(false),
  actual_payment_date: z.date().nullable()
});

// Input schemas for creating new entities
export const createTripSchema = tripSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createDestinationSchema = destinationSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createTransportationSchema = transportationSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createLodgingSchema = lodgingSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createActivitySchema = activitySchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createTravelerSchema = travelerSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createTripSharingSchema = tripSharingSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const createPaymentScheduleSchema = paymentScheduleSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// Update schemas for updating existing entities
export const updateTripSchema = createTripSchema.partial();
export const updateDestinationSchema = createDestinationSchema.partial();
export const updateTransportationSchema = createTransportationSchema.partial();
export const updateLodgingSchema = createLodgingSchema.partial();
export const updateActivitySchema = createActivitySchema.partial();
export const updateTravelerSchema = createTravelerSchema.partial();
export const updateTripSharingSchema = createTripSharingSchema.partial();
export const updatePaymentScheduleSchema = createPaymentScheduleSchema.partial();

// Infer types from schemas
export type TripSchema = z.infer<typeof tripSchema>;
export type DestinationSchema = z.infer<typeof destinationSchema>;
export type TransportationSchema = z.infer<typeof transportationSchema>;
export type LodgingSchema = z.infer<typeof lodgingSchema>;
export type ActivitySchema = z.infer<typeof activitySchema>;
export type TravelerSchema = z.infer<typeof travelerSchema>;
export type TripSharingSchema = z.infer<typeof tripSharingSchema>;
export type PaymentScheduleSchema = z.infer<typeof paymentScheduleSchema>;

export type CreateTripSchema = z.infer<typeof createTripSchema>;
export type CreateDestinationSchema = z.infer<typeof createDestinationSchema>;
export type CreateTransportationSchema = z.infer<typeof createTransportationSchema>;
export type CreateLodgingSchema = z.infer<typeof createLodgingSchema>;
export type CreateActivitySchema = z.infer<typeof createActivitySchema>;
export type CreateTravelerSchema = z.infer<typeof createTravelerSchema>;
export type CreateTripSharingSchema = z.infer<typeof createTripSharingSchema>;
export type CreatePaymentScheduleSchema = z.infer<typeof createPaymentScheduleSchema>;

export type UpdateTripSchema = z.infer<typeof updateTripSchema>;
export type UpdateDestinationSchema = z.infer<typeof updateDestinationSchema>;
export type UpdateTransportationSchema = z.infer<typeof updateTransportationSchema>;
export type UpdateLodgingSchema = z.infer<typeof updateLodgingSchema>;
export type UpdateActivitySchema = z.infer<typeof updateActivitySchema>;
export type UpdateTravelerSchema = z.infer<typeof updateTravelerSchema>;
export type UpdateTripSharingSchema = z.infer<typeof updateTripSharingSchema>;
export type UpdatePaymentScheduleSchema = z.infer<typeof updatePaymentScheduleSchema>;
