import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/__protected__/dashboard' // Allow direct access to dashboard for now
];

// Function to check if a path is public
function isPublicPath(pathname: string): boolean {
  return (
    publicRoutes.some(route => pathname === route) ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/__protected__/') // Allow all protected routes for now
  );
}

export const load = async ({ cookies, url, locals }: ServerLoadEvent) => {
  console.log('=== ROOT LAYOUT LOAD ===');
  console.log('Request URL:', url.pathname);
  
  try {
    // Get the session from locals (set by hooks.server.ts)
    const user = locals.user;
    console.log('User from locals:', user ? 'Authenticated' : 'Not authenticated');
    
    // Handle redirects for protected routes
    if (!user) {
      // If user is not logged in and trying to access a protected route, redirect to sign in
      if (!isPublicPath(url.pathname)) {
        console.log('Redirecting to signin from:', url.pathname);
        throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(url.pathname)}`);
      }
    } else {
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (url.pathname === '/auth/signin' || url.pathname === '/auth/signup') {
        console.log('User authenticated, redirecting to dashboard');
        throw redirect(303, '/__protected__/dashboard');
      }
    }

    // Return the user data
    return {
      user,
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
