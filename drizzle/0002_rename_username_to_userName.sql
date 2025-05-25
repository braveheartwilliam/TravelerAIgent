-- Rename the username column to userName
ALTER TABLE "users" RENAME COLUMN "username" TO "userName";

-- Update the unique constraint name to match the new column name
ALTER TABLE "users" RENAME CONSTRAINT "users_username_unique" TO "users_userName_unique";
