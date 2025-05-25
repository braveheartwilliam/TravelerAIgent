import { pgTable, text, timestamp, pgEnum, serial, boolean, pgSchema, jsonb, index, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { AdapterAccount } from '@auth/core/adapters';

// Create a custom schema
const authSchema = pgSchema('auth');

// Define enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

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
  userNameIdx: index('users_username_idx').on(table.userName),
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

// Create index for faster lookups
// accounts_user_id_idx: For looking up accounts by user ID
// accounts_provider_provider_account_id_idx: For OAuth provider lookups

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

// Create a composite primary key for verification tokens
export const verificationTokensRelations = {
  primaryKey: {
    name: 'verification_tokens_pkey',
    columns: [verificationTokens.identifier, verificationTokens.token]
  }
};

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Schema for inserting an account
export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

// Schema for inserting a session
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

// Schema for inserting a verification token
export const insertVerificationTokenSchema = createInsertSchema(verificationTokens);
export const selectVerificationTokenSchema = createSelectSchema(verificationTokens);

// Export types for external use
export type User = {
  id: number;
  userName: string;
  email: string;
  password: string | null;
  fullName: string | null;
  profile_picture: string | null;
  phone: string | null;
  street: string | null;
  apt: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  address_coords: Record<string, any> | null;
  email_verified: Date | null;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: Date | null;
  github_id: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  last_login: Date | null;
  last_failed_login: Date | null;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
  created_at: Date;
  updated_at: Date;
  salt: string | null;
};

export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
