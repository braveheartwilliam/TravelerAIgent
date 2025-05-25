import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Add user to locals for type safety
declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name: string | null;
        role: string;
      } | null;
    }
    interface PageData {
      user?: {
        id: string;
        email: string;
        name: string | null;
        role: string;
      } | null;
    }
    interface PageState {}
  }
}

// Handle authentication
const handleAuth: Handle = async ({ event, resolve }) => {
  console.log('=== AUTH HOOK START ===');
  console.log('Request URL:', event.url.pathname);
  
  const sessionCookie = event.cookies.get('session');
  console.log('Session cookie found:', !!sessionCookie);
  
  if (!sessionCookie) {
    console.log('No session cookie, setting user to null');
    event.locals.user = null;
    return await resolve(event);
  }

  try {
    // Parse the session cookie
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    
    // Validate the session structure
    if (session && typeof session === 'object' && 'id' in session) {
      const userData = {
        id: String(session.id),
        email: session.email || '',
        name: session.name || null,
        role: session.role || 'user'
      };
      
      console.log('Setting user in locals:', userData);
      event.locals.user = userData;
      
      // Add debug logging in development
      if (import.meta.env.DEV) {
        console.log('[Auth] Session validated for user:', event.locals.user);
      }
    } else {
      console.error('Invalid session structure:', session);
      event.locals.user = null;
    }
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    event.locals.user = null;
    
    // Clear invalid session cookie
    event.cookies.delete('session', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
  }

  return await resolve(event);
};

// Handle authorization
const handleAuthz: Handle = async ({ event, resolve }) => {
  const path = event.url.pathname;
  
  // Skip auth checks for API routes
  if (path.startsWith('/api/')) {
    return await resolve(event);
  }
  
  // Public routes that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/signup', '/auth/error'];
  
  // Redirect to sign-in if not authenticated and trying to access protected route
  if (!event.locals.user && !publicPaths.includes(path) && !path.startsWith('/auth/')) {
    throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(path)}`);
  }

  return await resolve(event);
};

export const handle = sequence(handleAuth, handleAuthz);
