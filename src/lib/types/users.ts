import type { userRoleEnum } from '$lib/server/schema.updated';

/**
 * User type definitions
 * These types match the database schema in schema.updated.ts
 */

export type User = {
  id: number;
  userName: string;
  email: string;
  password?: string;
  fullName?: string;
  profile_picture?: string;
  phone?: string;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  address_coords?: any;
  email_verified?: Date | null;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  github_id?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  last_login?: Date;
  last_failed_login?: Date;
  created_at: Date;
  updated_at: Date;
  reset_password_token?: string;
  reset_password_expires?: Date;
  salt?: string;
};

export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
};

export type UserPreference = {
  id: number;
  user_id: number;
  key: string;
  value: string;
  created_at: Date;
  updated_at: Date;
};

export type NewUserPreference = Omit<UserPreference, 'id' | 'created_at' | 'updated_at'> & {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
};
