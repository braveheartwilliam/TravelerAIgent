import type { Handle, HandleServerError } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';

// Define user type for better type safety
type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  expires?: string;
};

declare global {
  namespace App {
    interface Locals {
      user: User | null;
    }
    interface PageData {
      user?: User | null;
    }
    interface PageState {}
  }
}

// List of public paths that don't require authentication
const PUBLIC_PATHS = new Set([
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/forgot-password',
  '/auth/verify-email',
  '/api/auth/session',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/signout'
]);

// Check if a path is public
function isPublicPath(path: string): boolean {
  // Check exact matches
  if (PUBLIC_PATHS.has(path)) return true;
  
  // Check path prefixes
  for (const publicPath of PUBLIC_PATHS) {
    if (path.startsWith(publicPath + '/')) return true;
  }
  
  return false;
}

// Handle authentication
const handleAuth: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;
  const { pathname } = url;

  // Skip auth for public paths and API routes
  if (isPublicPath(pathname) || pathname.startsWith('/api/')) {
    return await resolve(event);
  }

  // Get session cookie
  const sessionCookie = cookies.get('session');
  
  if (!sessionCookie) {
    // No session cookie found, redirect to sign-in
    const redirectTo = pathname === '/' ? '' : `?redirectTo=${encodeURIComponent(pathname)}`;
    throw redirect(303, `/auth/signin${redirectTo}`);
  }

  try {
    // Parse and validate session
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    
    if (session?.id) {
      // Set user in locals
      event.locals.user = {
        id: String(session.id),
        email: session.email || '',
        name: session.name || null,
        role: session.role || 'user'
      };
      
      // If user is authenticated but tries to access auth pages, redirect to dashboard
      if (pathname.startsWith('/auth/')) {
        throw redirect(303, '/dashboard');
      }
      
      return await resolve(event);
    }
    
    // Invalid session, clear cookie and redirect to sign-in
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/auth/signin');
    
  } catch (err) {
    console.error('Session validation error:', err);
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/auth/signin');
  }
};

// Handle authorization
const handleAuthz: Handle = async ({ event, resolve }) => {
  const { locals, url } = event;
  const { pathname } = url;
  
  // Skip authorization for public paths and API routes
  if (isPublicPath(pathname) || pathname.startsWith('/api/')) {
    return await resolve(event);
  }
  
  // Check for admin routes
  if (pathname.startsWith('/admin') && locals.user?.role !== 'admin') {
    throw error(403, 'Forbidden');
  }
  
  return await resolve(event);
};

// Handle errors
export const handleError: HandleServerError = ({ error: err, event }) => {
  console.error('Global error handler:', err);
  
  // Custom error handling can be added here
  return {
    message: 'An unexpected error occurred',
    code: 'UNEXPECTED_ERROR'
  };
};

// Export the sequence of handlers
export const handle = sequence(handleAuth, handleAuthz);
