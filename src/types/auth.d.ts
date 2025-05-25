import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends User {
    id: string;
    email: string;
    emailVerified: Date | null;
  }
}
