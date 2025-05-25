// Type definitions for $lib/utils
declare module '$lib/utils' {
  import type { Cookies } from '@sveltejs/kit';
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    [key: string]: unknown;
  }

  export function getUserFromCookies(cookies: Cookies): User | null;
  export function requireAuth(event: { cookies: Cookies; url: URL }): never | User;
  export function requireRole(event: { cookies: Cookies; url: URL }, roles: string | string[]): User;
  export function createSessionCookies(user: User, rememberMe?: boolean): { 'Set-Cookie': string };
  export function clearSessionCookies(): { 'Set-Cookie': string };
  
  // Other utility functions
  export function cn(...inputs: any[]): string;
  export function formatDate(date: Date | string | number): string;
  export function formatCurrency(amount: number): string;
  export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void;
  export function generateId(): string;
  export function truncate(text: string, length: number): string;
  export function isEmpty(value: any): boolean;
}
