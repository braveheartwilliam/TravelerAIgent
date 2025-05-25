import type { DefaultSession, DefaultUser } from '@auth/core/types';

// Extend the default session type
declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

// Extend the JWT type
declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
}

// App-specific types
declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        role: string;
      } | null;
      getSession: () => Promise<{
        user: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          role: string;
        } | null;
      } | null>;
    }
  }
}

export interface AppSession extends DefaultSession {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  } & DefaultSession['user'];
}

export interface AppJWT extends JWT {
  role?: string;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
}
