-- Add last_failed_login column to users table
ALTER TABLE users 
ADD COLUMN last_failed_login TIMESTAMP WITH TIME ZONE;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS users_last_failed_login_idx ON users(last_failed_login);
