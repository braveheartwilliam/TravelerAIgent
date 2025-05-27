-- Drop old migrations to avoid conflicts
-- This will be applied after the initial schema is created

-- Drop the old username column if it still exists (for safety)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'users' 
             AND column_name = 'username') THEN
    ALTER TABLE "users" DROP COLUMN "username";
  END IF;
  
  -- Drop old constraints if they exist
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_unique') THEN
    ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";
  END IF;
  
  -- Ensure the correct constraint exists
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_userName_unique') THEN
    ALTER TABLE "users" ADD CONSTRAINT "users_userName_unique" UNIQUE("userName");
  END IF;
  
  -- Ensure the index uses the correct column name
  DROP INDEX IF EXISTS "users_username_idx";
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_userName_idx') THEN
    CREATE INDEX "users_userName_idx" ON "users" ("userName");
  END IF;
END
$$;
