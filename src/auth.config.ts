import type { Adapter } from '@auth/core/adapters';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';

// See https://authjs.dev/getting-started/typescript#module-augmentation
declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

export const authConfig = {
  // Use Drizzle adapter for database operations
  adapter: DrizzleAdapter(db) as Adapter,
  
  // Session configuration
  session: {
    strategy: 'jwt' as const,
  },
  
  // Enable debug logs in development
  debug: process.env.NODE_ENV === 'development',
  
  // Configure pages
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  
  // Callbacks for session and JWT
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  
  // Providers configuration
  providers: [
    // We'll add providers here
  ],
};

export default authConfig;
