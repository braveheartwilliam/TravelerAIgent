-- Create the trips table
CREATE TABLE IF NOT EXISTS "trips" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "destination" TEXT NOT NULL,
  "description" TEXT,
  "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "budget" NUMERIC(10, 2),
  "status" TEXT NOT NULL DEFAULT 'planned',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "trips_user_id_idx" ON "trips" ("user_id");
CREATE INDEX IF NOT EXISTS "trips_status_idx" ON "trips" ("status");

-- Add a trigger to update the updated_at column on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trips_updated_at
BEFORE UPDATE ON "trips"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
