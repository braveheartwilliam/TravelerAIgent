-- Create enums
CREATE TYPE "trip_status" AS ENUM ('draft', 'in_progress', 'completed', 'cancelled', 'on_hold', 'deleted');
CREATE TYPE "trip_type" AS ENUM ('land_cruise', 'ship_cruise', 'guided_trip', 'user_planned_trip');
CREATE TYPE "trip_visibility" AS ENUM ('public', 'private');
CREATE TYPE "destination_type" AS ENUM ('city', 'place_of_interest', 'port', 'ship_cruise_port', 'land_cruise_stop', 'guided_trip_stop', 'user_planned_trip_stop');
CREATE TYPE "transportation_type" AS ENUM ('car', 'bus', 'train', 'plane', 'boat', 'ship', 'other');
CREATE TYPE "lodging_type" AS ENUM ('hotel', 'motel', 'vacation_rental', 'apartment', 'cruise_ship_cabin', 'hostel', 'camping', 'other');
CREATE TYPE "activity_type" AS ENUM ('sightseeing', 'tour', 'dining', 'entertainment', 'adventure', 'relaxation', 'shopping', 'other');

-- Alter trips table
ALTER TABLE "trips" 
  RENAME COLUMN "destination" TO "title";

ALTER TABLE "trips"
  ADD COLUMN "visibility" trip_visibility NOT NULL DEFAULT 'private',
  ADD COLUMN "type" trip_type NOT NULL DEFAULT 'user_planned_trip',
  ALTER COLUMN "status" TYPE trip_status USING status::trip_status,
  ALTER COLUMN "status" SET DEFAULT 'draft',
  RENAME COLUMN "budget" TO "budget_planned",
  ADD COLUMN "budget_actual" numeric(10,2),
  ADD COLUMN "currency" text NOT NULL DEFAULT 'USD',
  ADD COLUMN "booking_number" text,
  ADD COLUMN "confirmation_number" text;

CREATE INDEX "trips_type_idx" ON "trips" ("type");
CREATE INDEX "trips_visibility_idx" ON "trips" ("visibility");

-- Create destinations table
CREATE TABLE "destinations" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "type" destination_type NOT NULL DEFAULT 'city',
  "address" text,
  "city" text,
  "state" text,
  "postal_code" text,
  "country" text,
  "latitude" numeric(10,6),
  "longitude" numeric(10,6),
  "arrival_date" timestamptz NOT NULL,
  "departure_date" timestamptz NOT NULL,
  "duration_days" integer,
  "budget_planned" numeric(10,2),
  "budget_actual" numeric(10,2),
  "currency" text NOT NULL DEFAULT 'USD',
  "status" trip_status NOT NULL DEFAULT 'draft',
  "is_start_location" boolean NOT NULL DEFAULT false,
  "is_end_location" boolean NOT NULL DEFAULT false,
  "earliest_arrival" timestamptz,
  "latest_arrival" timestamptz,
  "earliest_departure" timestamptz,
  "latest_departure" timestamptz,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "order_index" integer NOT NULL
);

CREATE INDEX "destinations_trip_id_idx" ON "destinations" ("trip_id");
CREATE INDEX "destinations_status_idx" ON "destinations" ("status");
CREATE INDEX "destinations_type_idx" ON "destinations" ("type");
CREATE INDEX "destinations_order_idx" ON "destinations" ("order_index");

-- Create transportation table
CREATE TABLE "transportation" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "from_destination_id" integer NOT NULL REFERENCES "destinations" ("id") ON DELETE CASCADE,
  "to_destination_id" integer NOT NULL REFERENCES "destinations" ("id") ON DELETE CASCADE,
  "type" transportation_type NOT NULL,
  "provider" text,
  "transport_number" text,
  "description" text,
  "departure_date" timestamptz NOT NULL,
  "arrival_date" timestamptz NOT NULL,
  "duration_hours" numeric(5,2),
  "departure_location" text,
  "arrival_location" text,
  "transport_class" text,
  "fare" numeric(10,2),
  "currency" text NOT NULL DEFAULT 'USD',
  "status" trip_status NOT NULL DEFAULT 'draft',
  "confirmation_number" text,
  "booking_number" text,
  "terminal" text,
  "gate" text,
  "seat_number" text,
  "meal_plan" text,
  "baggage_allowance" text,
  "contact_name" text,
  "contact_phone" text,
  "contact_email" text,
  "provider_website" text,
  "earliest_departure" timestamptz,
  "latest_departure" timestamptz,
  "earliest_arrival" timestamptz,
  "latest_arrival" timestamptz,
  "is_shared" boolean NOT NULL DEFAULT false,
  "is_private" boolean NOT NULL DEFAULT false,
  "is_paid" boolean NOT NULL DEFAULT true,
  "is_scheduled" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "transportation_trip_id_idx" ON "transportation" ("trip_id");
CREATE INDEX "transportation_from_destination_id_idx" ON "transportation" ("from_destination_id");
CREATE INDEX "transportation_to_destination_id_idx" ON "transportation" ("to_destination_id");
CREATE INDEX "transportation_status_idx" ON "transportation" ("status");
CREATE INDEX "transportation_type_idx" ON "transportation" ("type");

-- Create lodging table
CREATE TABLE "lodging" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "destination_id" integer NOT NULL REFERENCES "destinations" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "type" lodging_type NOT NULL,
  "description" text,
  "address" text,
  "city" text,
  "state" text,
  "postal_code" text,
  "country" text,
  "latitude" numeric(10,6),
  "longitude" numeric(10,6),
  "arrival_date" timestamptz NOT NULL,
  "departure_date" timestamptz NOT NULL,
  "duration_nights" integer,
  "check_in_time" text,
  "check_out_time" text,
  "cost_per_night" numeric(10,2),
  "total_cost" numeric(10,2),
  "currency" text NOT NULL DEFAULT 'USD',
  "status" trip_status NOT NULL DEFAULT 'draft',
  "confirmation_number" text,
  "booking_number" text,
  "contact_name" text,
  "contact_phone" text,
  "contact_email" text,
  "provider_website" text,
  "provider_phone" text,
  "earliest_arrival" timestamptz,
  "latest_arrival" timestamptz,
  "earliest_departure" timestamptz,
  "latest_departure" timestamptz,
  "is_shared" boolean NOT NULL DEFAULT false,
  "is_private" boolean NOT NULL DEFAULT false,
  "is_paid" boolean NOT NULL DEFAULT true,
  "is_scheduled" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "lodging_trip_id_idx" ON "lodging" ("trip_id");
CREATE INDEX "lodging_destination_id_idx" ON "lodging" ("destination_id");
CREATE INDEX "lodging_status_idx" ON "lodging" ("status");
CREATE INDEX "lodging_type_idx" ON "lodging" ("type");

-- Create activities table
CREATE TABLE "activities" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "destination_id" integer NOT NULL REFERENCES "destinations" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "type" activity_type NOT NULL,
  "description" text,
  "location" text,
  "address" text,
  "city" text,
  "state" text,
  "postal_code" text,
  "country" text,
  "latitude" numeric(10,6),
  "longitude" numeric(10,6),
  "start_date" timestamptz NOT NULL,
  "end_date" timestamptz NOT NULL,
  "duration_hours" numeric(5,2),
  "cost" numeric(10,2),
  "currency" text NOT NULL DEFAULT 'USD',
  "status" trip_status NOT NULL DEFAULT 'draft',
  "confirmation_number" text,
  "booking_number" text,
  "contact_name" text,
  "contact_phone" text,
  "contact_email" text,
  "provider_website" text,
  "provider_phone" text,
  "is_shared" boolean NOT NULL DEFAULT false,
  "is_private" boolean NOT NULL DEFAULT false,
  "is_paid" boolean NOT NULL DEFAULT true,
  "is_scheduled" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "activities_trip_id_idx" ON "activities" ("trip_id");
CREATE INDEX "activities_destination_id_idx" ON "activities" ("destination_id");
CREATE INDEX "activities_status_idx" ON "activities" ("status");
CREATE INDEX "activities_type_idx" ON "activities" ("type");

-- Create travelers table
CREATE TABLE "travelers" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "user_id" integer REFERENCES "users" ("id") ON DELETE SET NULL,
  "name" text NOT NULL,
  "email" text,
  "phone" text,
  "is_trip_creator" boolean NOT NULL DEFAULT false,
  "is_companion" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "travelers_trip_user_unique" UNIQUE ("trip_id", "user_id")
);

CREATE INDEX "travelers_trip_id_idx" ON "travelers" ("trip_id");
CREATE INDEX "travelers_user_id_idx" ON "travelers" ("user_id");

-- Create trip sharing table
CREATE TABLE "trip_sharing" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "user_id" integer NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
  "permission" text NOT NULL DEFAULT 'view',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "trip_sharing_trip_user_unique" UNIQUE ("trip_id", "user_id")
);

CREATE INDEX "trip_sharing_trip_id_idx" ON "trip_sharing" ("trip_id");
CREATE INDEX "trip_sharing_user_id_idx" ON "trip_sharing" ("user_id");

-- Create payment schedules table
CREATE TABLE "payment_schedules" (
  "id" serial PRIMARY KEY,
  "trip_id" integer NOT NULL REFERENCES "trips" ("id") ON DELETE CASCADE,
  "payment_date" timestamptz NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "currency" text NOT NULL DEFAULT 'USD',
  "description" text,
  "is_paid" boolean NOT NULL DEFAULT false,
  "actual_payment_date" timestamptz,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "payment_schedules_trip_id_idx" ON "payment_schedules" ("trip_id");
