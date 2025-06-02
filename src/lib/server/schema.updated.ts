import { pgTable, text, timestamp, pgEnum, serial, boolean, pgSchema, jsonb, index, integer, numeric, foreignKey, primaryKey, uuid, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { AdapterAccount } from '@auth/core/adapters';

// Create a custom schema
const authSchema = pgSchema('auth');

// Define enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const tripStatusEnum = pgEnum('trip_status', ['draft', 'in_progress', 'completed', 'cancelled', 'on_hold', 'deleted']);
export const tripTypeEnum = pgEnum('trip_type', ['land_cruise', 'ship_cruise', 'guided_trip', 'user_planned_trip']);
export const tripVisibilityEnum = pgEnum('trip_visibility', ['public', 'private']);
export const destinationTypeEnum = pgEnum('destination_type', ['city', 'place_of_interest', 'port', 'ship_cruise_port', 'land_cruise_stop', 'guided_trip_stop', 'user_planned_trip_stop']);
export const transportationTypeEnum = pgEnum('transportation_type', ['car', 'bus', 'train', 'plane', 'boat', 'ship', 'other']);
export const lodgingTypeEnum = pgEnum('lodging_type', ['hotel', 'motel', 'vacation_rental', 'apartment', 'cruise_ship_cabin', 'hostel', 'camping', 'other']);
export const activityTypeEnum = pgEnum('activity_type', ['sightseeing', 'tour', 'dining', 'entertainment', 'adventure', 'relaxation', 'shopping', 'other']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userName: text('userName').notNull(),
  email: text('email').notNull(),
  password: text('password'),
  fullName: text('fullName'),
  profile_picture: text('profile_picture'),
  phone: text('phone'),
  street: text('street'),
  apt: text('apt'),
  city: text('city'),
  state: text('state'),
  postal_code: text('postal_code'),
  country: text('country'),
  address_coords: jsonb('address_coords'),
  email_verified: timestamp('email_verified'),
  verification_token: text('verification_token'),
  reset_token: text('reset_token'),
  reset_token_expires: timestamp('reset_token_expires'),
  github_id: text('github_id'),
  role: userRoleEnum('role').default('user'),
  is_active: boolean('is_active').default(true),
  last_login: timestamp('last_login'),
  last_failed_login: timestamp('last_failed_login'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  reset_password_token: text('reset_password_token'),
  reset_password_expires: timestamp('reset_password_expires'),
  salt: text('salt')
}, (table) => ({
  // Add indexes to match the database
  emailIdx: index('users_email_idx').on(table.email),
  userNameIdx: index('users_userName_idx').on(table.userName),
  githubIdIdx: index('users_github_id_idx').on(table.github_id)
}));

// Accounts table
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  provider_account_id: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at', { withTimezone: true }),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Verification tokens table
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull()
});

// Trips table - Updated based on Trips.md requirements
export const trips = pgTable('trips', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  start_date: timestamp('start_date', { withTimezone: true }).notNull(),
  end_date: timestamp('end_date', { withTimezone: true }).notNull(),
  visibility: tripVisibilityEnum('visibility').default('private').notNull(),
  type: tripTypeEnum('type').default('user_planned_trip').notNull(),
  status: tripStatusEnum('status').default('draft').notNull(),
  budget_planned: numeric('budget_planned', { precision: 10, scale: 2 }),
  budget_actual: numeric('budget_actual', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  booking_number: text('booking_number'),
  confirmation_number: text('confirmation_number'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  userIdIdx: index('trips_user_id_idx').on(table.user_id),
  statusIdx: index('trips_status_idx').on(table.status),
  typeIdx: index('trips_type_idx').on(table.type),
  visibilityIdx: index('trips_visibility_idx').on(table.visibility)
}));

// Destinations table
export const destinations = pgTable('destinations', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  type: destinationTypeEnum('type').default('city').notNull(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postal_code: text('postal_code'),
  country: text('country'),
  latitude: numeric('latitude', { precision: 10, scale: 6 }),
  longitude: numeric('longitude', { precision: 10, scale: 6 }),
  arrival_date: timestamp('arrival_date', { withTimezone: true }).notNull(),
  departure_date: timestamp('departure_date', { withTimezone: true }).notNull(),
  duration_days: integer('duration_days'),
  budget_planned: numeric('budget_planned', { precision: 10, scale: 2 }),
  budget_actual: numeric('budget_actual', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  status: tripStatusEnum('status').default('draft').notNull(),
  is_start_location: boolean('is_start_location').default(false),
  is_end_location: boolean('is_end_location').default(false),
  earliest_arrival: timestamp('earliest_arrival', { withTimezone: true }),
  latest_arrival: timestamp('latest_arrival', { withTimezone: true }),
  earliest_departure: timestamp('earliest_departure', { withTimezone: true }),
  latest_departure: timestamp('latest_departure', { withTimezone: true }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  order_index: integer('order_index').notNull()
}, (table) => ({
  tripIdIdx: index('destinations_trip_id_idx').on(table.trip_id),
  statusIdx: index('destinations_status_idx').on(table.status),
  typeIdx: index('destinations_type_idx').on(table.type),
  orderIdx: index('destinations_order_idx').on(table.order_index)
}));

// Transportation table
export const transportation = pgTable('transportation', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  from_destination_id: integer('from_destination_id').references(() => destinations.id, { onDelete: 'cascade' }).notNull(),
  to_destination_id: integer('to_destination_id').references(() => destinations.id, { onDelete: 'cascade' }).notNull(),
  type: transportationTypeEnum('type').notNull(),
  provider: text('provider'),
  transport_number: text('transport_number'), // flight number, train number, etc.
  description: text('description'),
  departure_date: timestamp('departure_date', { withTimezone: true }).notNull(),
  arrival_date: timestamp('arrival_date', { withTimezone: true }).notNull(),
  duration_hours: numeric('duration_hours', { precision: 5, scale: 2 }),
  departure_location: text('departure_location'), // airport, train station, etc.
  arrival_location: text('arrival_location'), // airport, train station, etc.
  transport_class: text('transport_class'), // first class, business class, etc.
  fare: numeric('fare', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  status: tripStatusEnum('status').default('draft').notNull(),
  confirmation_number: text('confirmation_number'),
  booking_number: text('booking_number'),
  terminal: text('terminal'),
  gate: text('gate'),
  seat_number: text('seat_number'),
  meal_plan: text('meal_plan'),
  baggage_allowance: text('baggage_allowance'),
  contact_name: text('contact_name'),
  contact_phone: text('contact_phone'),
  contact_email: text('contact_email'),
  provider_website: text('provider_website'),
  earliest_departure: timestamp('earliest_departure', { withTimezone: true }),
  latest_departure: timestamp('latest_departure', { withTimezone: true }),
  earliest_arrival: timestamp('earliest_arrival', { withTimezone: true }),
  latest_arrival: timestamp('latest_arrival', { withTimezone: true }),
  is_shared: boolean('is_shared').default(false),
  is_private: boolean('is_private').default(false),
  is_paid: boolean('is_paid').default(true),
  is_scheduled: boolean('is_scheduled').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('transportation_trip_id_idx').on(table.trip_id),
  fromDestinationIdx: index('transportation_from_destination_id_idx').on(table.from_destination_id),
  toDestinationIdx: index('transportation_to_destination_id_idx').on(table.to_destination_id),
  statusIdx: index('transportation_status_idx').on(table.status),
  typeIdx: index('transportation_type_idx').on(table.type)
}));

// Lodging table
export const lodging = pgTable('lodging', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  destination_id: integer('destination_id').references(() => destinations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: lodgingTypeEnum('type').notNull(),
  description: text('description'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postal_code: text('postal_code'),
  country: text('country'),
  latitude: numeric('latitude', { precision: 10, scale: 6 }),
  longitude: numeric('longitude', { precision: 10, scale: 6 }),
  arrival_date: timestamp('arrival_date', { withTimezone: true }).notNull(),
  departure_date: timestamp('departure_date', { withTimezone: true }).notNull(),
  duration_nights: integer('duration_nights'),
  check_in_time: text('check_in_time'),
  check_out_time: text('check_out_time'),
  cost_per_night: numeric('cost_per_night', { precision: 10, scale: 2 }),
  total_cost: numeric('total_cost', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  status: tripStatusEnum('status').default('draft').notNull(),
  confirmation_number: text('confirmation_number'),
  booking_number: text('booking_number'),
  contact_name: text('contact_name'),
  contact_phone: text('contact_phone'),
  contact_email: text('contact_email'),
  provider_website: text('provider_website'),
  provider_phone: text('provider_phone'),
  earliest_arrival: timestamp('earliest_arrival', { withTimezone: true }),
  latest_arrival: timestamp('latest_arrival', { withTimezone: true }),
  earliest_departure: timestamp('earliest_departure', { withTimezone: true }),
  latest_departure: timestamp('latest_departure', { withTimezone: true }),
  is_shared: boolean('is_shared').default(false),
  is_private: boolean('is_private').default(false),
  is_paid: boolean('is_paid').default(true),
  is_scheduled: boolean('is_scheduled').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('lodging_trip_id_idx').on(table.trip_id),
  destinationIdIdx: index('lodging_destination_id_idx').on(table.destination_id),
  statusIdx: index('lodging_status_idx').on(table.status),
  typeIdx: index('lodging_type_idx').on(table.type)
}));

// Activities table
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  destination_id: integer('destination_id').references(() => destinations.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: activityTypeEnum('type').notNull(),
  description: text('description'),
  location: text('location'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  postal_code: text('postal_code'),
  country: text('country'),
  latitude: numeric('latitude', { precision: 10, scale: 6 }),
  longitude: numeric('longitude', { precision: 10, scale: 6 }),
  start_date: timestamp('start_date', { withTimezone: true }).notNull(),
  end_date: timestamp('end_date', { withTimezone: true }).notNull(),
  duration_hours: numeric('duration_hours', { precision: 5, scale: 2 }),
  cost: numeric('cost', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  status: tripStatusEnum('status').default('draft').notNull(),
  confirmation_number: text('confirmation_number'),
  booking_number: text('booking_number'),
  contact_name: text('contact_name'),
  contact_phone: text('contact_phone'),
  contact_email: text('contact_email'),
  provider_website: text('provider_website'),
  provider_phone: text('provider_phone'),
  is_shared: boolean('is_shared').default(false),
  is_private: boolean('is_private').default(false),
  is_paid: boolean('is_paid').default(true),
  is_scheduled: boolean('is_scheduled').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('activities_trip_id_idx').on(table.trip_id),
  destinationIdIdx: index('activities_destination_id_idx').on(table.destination_id),
  statusIdx: index('activities_status_idx').on(table.status),
  typeIdx: index('activities_type_idx').on(table.type)
}));

// Travelers table
export const travelers = pgTable('travelers', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  is_trip_creator: boolean('is_trip_creator').default(false),
  is_companion: boolean('is_companion').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('travelers_trip_id_idx').on(table.trip_id),
  userIdIdx: index('travelers_user_id_idx').on(table.user_id),
  uniqueTripUser: unique('travelers_trip_user_unique').on(table.trip_id, table.user_id)
}));

// Trip sharing table
export const tripSharing = pgTable('trip_sharing', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permission: text('permission').default('view').notNull(), // view, edit, admin
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('trip_sharing_trip_id_idx').on(table.trip_id),
  userIdIdx: index('trip_sharing_user_id_idx').on(table.user_id),
  uniqueTripUser: unique('trip_sharing_trip_user_unique').on(table.trip_id, table.user_id)
}));

// Payment schedules for cruises and guided trips
export const paymentSchedules = pgTable('payment_schedules', {
  id: serial('id').primaryKey(),
  trip_id: integer('trip_id').references(() => trips.id, { onDelete: 'cascade' }).notNull(),
  payment_date: timestamp('payment_date', { withTimezone: true }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  description: text('description'),
  is_paid: boolean('is_paid').default(false),
  actual_payment_date: timestamp('actual_payment_date', { withTimezone: true }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  tripIdIdx: index('payment_schedules_trip_id_idx').on(table.trip_id)
}));

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertTripSchema = createInsertSchema(trips);
export const selectTripSchema = createSelectSchema(trips);

export const insertDestinationSchema = createInsertSchema(destinations);
export const selectDestinationSchema = createSelectSchema(destinations);

export const insertTransportationSchema = createInsertSchema(transportation);
export const selectTransportationSchema = createSelectSchema(transportation);

export const insertLodgingSchema = createInsertSchema(lodging);
export const selectLodgingSchema = createSelectSchema(lodging);

export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);

export const insertTravelerSchema = createInsertSchema(travelers);
export const selectTravelerSchema = createSelectSchema(travelers);
