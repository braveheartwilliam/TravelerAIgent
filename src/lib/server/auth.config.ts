import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import type { Adapter } from '@auth/core/adapters';
import type { DefaultSession, User as AuthUser } from '@auth/core/types';

// Environment variables will be loaded dynamically in the auth setup
export const ENV = {
  AUTH_SECRET: process.env['AUTH_SECRET'],
  AUTH_TRUST_HOST: process.env['AUTH_TRUST_HOST'] === 'true',
  GITHUB_ID: process.env['GITHUB_ID'],
  GITHUB_SECRET: process.env['GITHUB_SECRET'],
  NODE_ENV: process.env['NODE_ENV'] || 'development'
} as const;

// Validate required environment variables
if (!ENV.AUTH_SECRET) {
  throw new Error('AUTH_SECRET is not set in environment variables');
}

if (!ENV.AUTH_TRUST_HOST) {
  console.warn('AUTH_TRUST_HOST is not set to true, this may cause issues with OAuth callbacks');
}

// Extended User type with our custom fields
export interface AppUser extends AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

// Type extensions for Auth.js
declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends AppUser {
    emailVerified: Date | null;
  }
}

// Export configuration
export const authConfig = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    // Configured in the main auth setup
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: ENV.AUTH_SECRET,
  trustHost: ENV.AUTH_TRUST_HOST,
};
