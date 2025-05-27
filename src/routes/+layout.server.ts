import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/callback/credentials',
  '/api/auth/signout',
  '/api/auth/providers',
  '/api/auth/session',
  '/__testing__',
  '/favicon.ico',
  '/manifest.json',
  '/service-worker.js',
  '/workbox-*.js',
  '/sw.js',
  '/robots.txt',
  '/sitemap.xml',
  '/_vercel/insights/script.js',
  '/_vercel/insights/view'
];

// Function to check if a path is public
function isPublicPath(pathname: string | null | undefined): boolean {
  try {
    // Handle null/undefined pathname
    if (!pathname) {
      console.log('[isPublicPath] No pathname provided');
      return false;
    }
    
    // Ensure pathname is a string
    const pathStr = String(pathname);
    
    // Normalize path (remove trailing slashes and query strings)
    const normalizedPath = pathStr.split('?')[0].replace(/\/+$/, '');
    
    // Check if the path matches any public routes or patterns
    const isPublic = (
      // Exact matches in publicRoutes
      publicRoutes.some(route => {
        // Handle wildcard routes
        if (route.endsWith('/*')) {
          return normalizedPath.startsWith(route.slice(0, -2));
        }
        return normalizedPath === route;
      }) ||
      // Auth-related paths
      normalizedPath.startsWith('/auth/') ||
      // Static files and assets
      /\.[a-z0-9]+$/i.test(normalizedPath) ||
      // Development and framework paths
      normalizedPath.startsWith('/_next/') ||
      normalizedPath.startsWith('/_vercel/') ||
      normalizedPath.startsWith('/_app') ||
      normalizedPath.startsWith('/_document') ||
      // Health check and monitoring
      normalizedPath === '/health' ||
      normalizedPath === '/ready' ||
      normalizedPath === '/status' ||
      // Public API routes (exclude protected ones)
      (normalizedPath.startsWith('/api/') && 
       !normalizedPath.startsWith('/api/__protected__/'))
    );
    
    console.log(`[isPublicPath] Path: ${pathStr}, isPublic: ${isPublic}`);
    return isPublic;
  } catch (error) {
    console.error('[isPublicPath] Error checking path:', error);
    return false; // Default to false on error
  }
}

// Define the user type for better type safety
interface UserData {
  id: string;
  email: string;
  name: string | null;
  userName: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const load = async ({ cookies, url, locals }: ServerLoadEvent) => {
  console.log('=== ROOT LAYOUT LOAD ===');
  console.log('Request URL:', url.pathname);
  
  try {
    // Get the user from locals (set by hooks.server.ts)
    const user = locals.user as UserData | undefined;
    console.log('User from locals:', user ? 'Authenticated' : 'Not authenticated');
    
    // Normalize the path for comparison
    const currentPath = url.pathname;
    const isAuthPath = currentPath.startsWith('/auth/');
    const isProtectedPath = currentPath.startsWith('/__protected__/');
    const isRootPath = currentPath === '/';
    
    // Handle root path
    if (isRootPath) {
      if (user) {
        console.log('Redirecting authenticated user from root to dashboard');
        throw redirect(303, '/__protected__/dashboard');
      } else {
        console.log('Redirecting unauthenticated user from root to signin');
        throw redirect(303, '/auth/signin');
      }
    }
    
    // Handle authentication state for other paths
    if (!user) {
      // If user is not logged in and trying to access a protected route, redirect to sign in
      if (isProtectedPath && !isPublicPath(currentPath)) {
        console.log('Redirecting to signin from protected path:', currentPath);
        throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
      }
    } else {
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (isAuthPath && (currentPath === '/auth/signin' || currentPath === '/auth/signup')) {
        console.log('User authenticated, redirecting to dashboard');
        throw redirect(303, '/__protected__/dashboard');
      }
      
      // If user is not active, force sign out
      if (!user.is_active) {
        console.log('User account is not active, forcing sign out');
        throw redirect(303, '/auth/signout');
      }
    }

    // Return the user data
    return {
      // Only include non-sensitive user data
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        userName: user.userName,
        role: user.role,
        is_active: user.is_active
      } : null,
      // Add any public environment variables needed on the client
      publicEnv: {
        NODE_ENV: process.env.NODE_ENV,
      }
    };
  } catch (error) {
    console.error('Error in root layout server load:', error);
    // If there's an error, clear the session and redirect to sign in
    cookies.delete('session', { path: '/' });
    
    // Only redirect if we're not already on an auth page to prevent loops
    if (!url.pathname.startsWith('/auth/')) {
      throw redirect(303, `/auth/signin?error=session_error`);
    }
    
    return {
      user: null,
      publicEnv: {
        NODE_ENV: process.env.NODE_ENV,
      }
    };
  }
};
