-- Initial schema with consistent use of userName
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');

CREATE TABLE "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "userName" text NOT NULL,
  "email" text NOT NULL,
  "password" text,
  "fullName" text,
  "profile_picture" text,
  "phone" text,
  "street" text,
  "apt" text,
  "city" text,
  "state" text,
  "postal_code" text,
  "country" text,
  "address_coords" jsonb,
  "email_verified" timestamp,
  "verification_token" text,
  "reset_token" text,
  "reset_token_expires" timestamp,
  "github_id" text,
  "role" "user_role" DEFAULT 'user' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "last_login" timestamp,
  "last_failed_login" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "reset_password_token" text,
  "reset_password_expires" timestamp,
  "salt" text,
  CONSTRAINT "users_userName_unique" UNIQUE("userName"),
  CONSTRAINT "users_email_unique" UNIQUE("email"),
  CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);

-- Create indexes for better query performance
CREATE INDEX "users_email_idx" ON "users" ("email");
CREATE INDEX "users_userName_idx" ON "users" ("userName");
CREATE INDEX "users_github_id_idx" ON "users" ("github_id");

-- Accounts table for OAuth
CREATE TABLE "accounts" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "provider_account_id" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "accounts_user_id_users_id_fk" 
    FOREIGN KEY ("user_id") 
    REFERENCES "users"("id") 
    ON DELETE cascade 
    ON UPDATE no action
);

-- Sessions table
CREATE TABLE "sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "sessions_user_id_users_id_fk" 
    FOREIGN KEY ("user_id") 
    REFERENCES "users"("id") 
    ON DELETE cascade 
    ON UPDATE no action
);

-- Verification tokens table
CREATE TABLE "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  PRIMARY KEY ("identifier", "token")
);
