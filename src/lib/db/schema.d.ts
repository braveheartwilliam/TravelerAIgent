import { PgTableWithColumns, PgColumn } from 'drizzle-orm/pg-core';
import { ColumnBaseConfig, TableConfig } from 'drizzle-orm';
import { users } from '../server/schema';

declare module 'drizzle-orm/pg-core' {
  interface PgTableWithColumns<T extends TableConfig> {
    // Add any custom table methods or properties here
  }

  interface PgColumn<T extends ColumnBaseConfig> {
    // Add any custom column methods or properties here
  }
}

// Export the users table type with userName
export type UsersTable = typeof users;

// Export user types
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
  address_coords: any | null;
  email_verified: Date | null;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: Date | null;
  github_id: string | null;
  role: string;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  reset_password_token: string | null;
  reset_password_expires: Date | null;
};

export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};
