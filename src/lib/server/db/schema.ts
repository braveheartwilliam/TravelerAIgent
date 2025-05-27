import { pgTable, serial, text, boolean, timestamp, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// User schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userName: text('user_name').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password'), // Nullable for OAuth users
  fullName: text('full_name'),
  profilePicture: text('profile_picture'),
  // Contact information
  phone: text('phone'),
  // Address information
  street: text('street'),
  apt: text('apt'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postal_code'),
  country: text('country'),
  addressCoords: jsonb('address_coords'),
  // Authentication
  emailVerified: timestamp('email_verified'),
  verificationToken: text('verification_token'),
  resetToken: text('reset_token'),
  resetTokenExpires: timestamp('reset_token_expires'),
  // OAuth
  githubId: text('github_id').unique(),
  // Role and status
  role: userRoleEnum('role').default('user').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  // Timestamps for password reset
  resetPasswordToken: text('reset_password_token'),
  resetPasswordExpires: timestamp('reset_password_expires'),
});

// Session table for Auth.js
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Account table for Auth.js
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (account) => ({
  providerProviderAccountId: {
    fields: [account.provider, account.providerAccountId],
    unique: true,
  },
}));

// Verification token table for Auth.js
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (vt) => ({
  compositePk: {
    fields: [vt.identifier, vt.token],
    primary: true,
  },
}));

// Base schema for creating users
const baseUserSchema = createInsertSchema(users);

// Schema for creating users with custom validations
export const insertUserSchema = baseUserSchema.omit({
  id: true,
  emailVerified: true,
  verificationToken: true,
  resetToken: true,
  resetTokenExpires: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  resetPasswordToken: true,
  resetPasswordExpires: true,
});

// Base user types from database schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Type for user creation input
export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  fullName?: string | null;
  profilePicture?: string | null;
  phone?: string | null;
  street?: string | null;
  apt?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  addressCoords?: unknown;
  githubId?: string | null;
  role?: 'user' | 'admin';
  isActive?: boolean;
};
