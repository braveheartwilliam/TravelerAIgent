import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit';
import { redirect, error as httpError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { getSession as getSessionUtil, type SessionData, type SessionUser } from '$lib/server/session-utils';

// Helper function to safely get error status from unknown error type
function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    return error.status;
  }
  return undefined;
}

// Define the User type that matches our database schema
type User = {
  id: string;  
  email: string;
  name: string | null;
  userName: string;
  role: 'user' | 'admin';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

declare global {
  namespace App {
    interface Locals {
      user: User | null;
      session?: any; 
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
  '/api/auth/signout',
  // Static assets
  '/favicon.ico',
  '/logo.png',
  '/manifest.json',
  // Health check endpoint
  '/health',
  // Public API endpoints
  '/api/public/'
]);

// Check if a path is public
function isPublicPath(path: string | undefined | null): boolean {
  try {
    // Early return for falsy values or non-strings
    if (!path || typeof path !== 'string' || path.trim() === '') {
      return false;
    }
    
    // Ensure we're working with a string
    const pathStr = String(path);
    
    // Normalize path (remove trailing slashes and query strings)
    const queryIndex = pathStr.indexOf('?');
    const pathWithoutQuery = queryIndex >= 0 
      ? pathStr.substring(0, queryIndex) 
      : pathStr;
      
    const normalizedPath = pathWithoutQuery.replace(/\/+$/, ''); // Remove trailing slashes
    
    // Never treat protected routes as public
    if (normalizedPath.startsWith('/__protected__')) {
      return false;
    }
    
    // IMPORTANT: /trips should NOT be a public path as it requires authentication
    if (normalizedPath === '/trips' || normalizedPath.startsWith('/trips/')) {
      return false;
    }
    
    // Check exact matches first for performance
    if (PUBLIC_PATHS.has(normalizedPath)) {
      return true;
    }
    
    // Check path prefixes for paths that end with a slash
    for (const publicPath of PUBLIC_PATHS) {
      if (publicPath.endsWith('/') && normalizedPath.startsWith(publicPath)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // Safely handle any errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking public path:', { 
      originalPath: path,
      error: errorMessage,
      type: typeof path
    });
    return false;
  }
}

// Handle authentication
const handleAuth: Handle = async ({ event, resolve }) => {
  const { url } = event;
  const { pathname, searchParams } = url;
  const callbackUrl = searchParams.get('callbackUrl') || pathname;
  
  // Enhanced debug logging for request tracking
  console.log(`[handleAuth] Processing request for: ${pathname}`, {
    timestamp: new Date().toISOString(),
    method: event.request.method,
    url: url.toString(),
    headers: {
      'user-agent': event.request.headers.get('user-agent')?.substring(0, 50) || 'unknown',
      'accept': event.request.headers.get('accept') || 'unknown',
      'content-type': event.request.headers.get('content-type') || 'unknown'
    }
  });
  
  // Handle public paths
  if (isPublicPath(pathname)) {
    console.log(`[handleAuth] Skipping auth for public path: ${pathname}`);
    return await resolve(event);
  }

  console.log('[handleAuth] Checking session...');
  // Declare session variable outside try block to maintain scope
  let session;
  
  try {
    session = await getSessionUtil(event.cookies);
    
    if (!session) {
      console.log('[handleAuth] No valid session found, redirecting to signin');
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    // Enhanced session validation
    if (!session.user || !session.user.id || !session.user.email) {
      console.error('[handleAuth] Session found but missing user data');
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=invalid_session`);
    }

    if (!session.user.is_active) {
      console.error('[handleAuth] User account is inactive:', session.user.id);
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=account_inactive`);
    }

    // Check session expiration
    const now = new Date();
    if (new Date(session.expiresAt) < now) {
      console.error('[handleAuth] Session expired:', {
        userId: session.user.id,
        expiresAt: session.expiresAt,
        now: now.toISOString()
      });
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=session_expired`);
    }

    // Debug log the session data (without sensitive info)
    console.log('[handleAuth] Valid session found for user:', {
      id: session.user.id,
      email: session.user.email,
      userName: session.user.userName,
      role: session.user.role,
      is_active: session.user.is_active,
      expiresAt: session.expiresAt,
      sessionAge: Math.floor((now.getTime() - new Date(session.createdAt).getTime()) / 1000 / 60) + ' minutes'
    });
  } catch (error) {
    console.error('[handleAuth] Error processing session:', error);
    throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=session_error`);
  }

  // Ensure we have the required user data
  if (!session?.user?.id || !session?.user?.email) {
    console.error('[handleAuth] Invalid session data: missing required user fields');
    throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&error=invalid_session`);
  }

  // Check if user is active
  if (session.user.is_active === false) {
    console.error(`[handleAuth] User account is deactivated: ${session.user.email}`);
    throw redirect(303, `/auth/signin?error=account_deactivated`);
  }

  // Create user data object with proper types
  const userName = session.user.userName || session.user.email.split('@')[0] || 'user';
  const fullName = session.user.fullName || null;
  const isActive = session.user.is_active ?? true;
  
  // Helper function to safely convert dates to ISO strings
  const toIsoString = (date: Date | string | null | undefined): string => {
    if (!date) return new Date().toISOString();
    return date instanceof Date ? date.toISOString() : date;
  };
  
  const userData: User = {
    id: String(session.user.id),
    email: session.user.email,
    name: fullName, // Using fullName for the name field
    userName: userName,
    role: session.user.role || 'user',
    is_active: isActive,
    createdAt: toIsoString(session.user.created_at as Date | string | null | undefined),
    updatedAt: toIsoString(session.user.updated_at as Date | string | null | undefined)
  };
  
  // Set user data in locals for use in load functions and pages
  event.locals = {
    ...event.locals,
    user: userData,
    session: session
  };

  console.log('[handleAuth] User set in locals, setting session cookie');
  
  // Ensure the session cookie is set with proper attributes before resolving
  if (session?.id) {
    // Use the same cookie settings as in session-utils.ts
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? process.env.COOKIE_DOMAIN : undefined;
    
    // Set the session cookie with proper attributes
    event.cookies.set('session', session.id, {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      domain
    });
    
    // Ensure the user data is also set in the page data for client-side access
    event.locals.user = userData;
    
    // For protected routes, ensure the user data is available
    if (pathname.startsWith('/__protected__')) {
      return await resolve(event, {
        transformPageChunk: ({ html }) => {
          // Inject user data into the page for client-side hydration
          return html.replace(
            '<body',
            `<script>window.__user__ = ${JSON.stringify(userData)}</script><body`
          );
        }
      });
    }
    
    console.log('[handleAuth] Session cookie set with options:', {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      domain
    });
  }
  
  // Now resolve the event with the updated locals
  console.log('[handleAuth] Proceeding with request');
  try {
    const response = await resolve(event);
    return response;
  } catch (error) {
    console.error('[handleAuth] Error in resolve:', error);
    
    let errorMessage = 'session_error';
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Provide more specific error messages for common issues
      if (error.message.includes('expired') || error.message.includes('expiration')) {
        errorMessage = 'session_expired';
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        errorMessage = 'invalid_session';
      }
    }
    
    // Clear the session cookie on error
    event.cookies.set('session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire the cookie
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    });
    
    // Re-throw the error to be handled by the error handler
    throw error;
  }
};

// Handle unauthenticated requests
async function handleUnauthenticated(event: RequestEvent, reason: 'no_session' | 'expired' | 'error' | 'invalid_session' = 'error') {
  const { url } = event;
  const cookies = event.cookies;
  const { pathname } = url;
  
  // Clear invalid session
  cookies.delete('session', { 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const
  });
  
  // Handle API requests
  if (pathname && pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Authentication required',
      code: 'UNAUTHORIZED',
      reason
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // For non-API requests, redirect to sign-in
  const redirectUrl = new URL('/auth/signin', url.origin);
  
  // Add redirect path if not already on an auth page
  if (!pathname.startsWith('/auth/')) {
    redirectUrl.searchParams.set('redirectTo', pathname);
  }
  
  // Add error reason if provided
  if (reason !== 'no_session') {
    redirectUrl.searchParams.set('error', reason);
  }
  
  console.log(`Redirecting to: ${redirectUrl.toString()}`);
  throw redirect(303, redirectUrl.toString());
}

// Handle authorization
const handleAuthz: Handle = async ({ event, resolve }) => {
  const { locals, url } = event;
  const pathname = url.pathname || '';
  
  // Skip authorization for public paths
  if (isPublicPath(pathname)) {
    return await resolve(event);
  }
  
  // Skip authorization for non-protected API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/protected/')) {
    return await resolve(event);
  }
  
  // Check for admin routes - only allow admin users
  if (pathname.startsWith('/admin')) {
    if (locals.user?.role !== 'admin') {
      console.warn('Unauthorized admin access attempt:', { 
        pathname, 
        userId: locals.user?.id,
        userRole: locals.user?.role 
      });
      throw httpError(403, 'Forbidden: Admin access required');
    }
    
    // Log successful admin access for auditing
    console.log('Admin access granted:', { 
      pathname, 
      userId: locals.user.id,
      timestamp: new Date().toISOString() 
    });
  }
  
  return await resolve(event);
};

// Handle errors
export const handleError: HandleServerError = (input) => {
  // Safely extract error and event with proper typing
  const error = input?.error;
  const event = input?.event;
  
  // Safely handle the error object
  const errorMessage = (() => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred';
  })();
  
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  // Safely extract URL information
  const url = event?.url;
  const urlString = url?.toString() || 'unknown';
  const pathname = url?.pathname || 'unknown';
  
  console.error('Global error handler:', {
    message: errorMessage,
    stack: errorStack,
    url: urlString,
    path: pathname
  });
  
  // Return a well-formed error response
  return {
    message: errorMessage,
    code: 'UNEXPECTED_ERROR',
    status: 500,
    stack: dev ? errorStack : undefined
  };
};

// Export the sequence of handlers
export const handle = sequence(handleAuth, handleAuthz);
