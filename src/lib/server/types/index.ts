// User type for session management
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

// Extend the Session type from @auth/core
declare module '@auth/core' {
  interface Session {
    user: SessionUser;
  }
}

// Extend the User type from @auth/core
declare module '@auth/core/adapters' {
  interface AdapterUser {
    id: string;
    email: string;
    emailVerified: Date | null;
    name?: string | null;
    image?: string | null;
    role: string;
  }
}
