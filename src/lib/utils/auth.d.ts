declare module '$lib/utils/auth' {
  import type { Cookies } from '@sveltejs/kit';
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    [key: string]: unknown;
  }

  export function getUserFromCookies(cookies: Cookies): User | null;
  export function requireAuth(event: { cookies: Cookies; url: URL }): User;
  export function requireRole(event: { cookies: Cookies; url: URL }, roles: string | string[]): User;
  export function createSessionCookies(user: User, rememberMe?: boolean): { 'Set-Cookie': string };
  export function clearSessionCookies(): { 'Set-Cookie': string };
}
