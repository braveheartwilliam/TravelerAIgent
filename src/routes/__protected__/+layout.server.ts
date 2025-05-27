import { redirect } from '@sveltejs/kit';
import { getSession } from '$lib/server/session-utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, cookies, locals }) => {
  console.log('[Protected Layout] Checking authentication status');
  
  try {
    // First check if we already have the user in locals (from hooks.server.ts)
    if (locals.user) {
      console.log('[Protected Layout] Using user from locals:', {
        id: locals.user.id,
        email: locals.user.email,
        userName: locals.user.userName
      });
      
      // Return a clean user object without sensitive data
      const userData = {
        id: locals.user.id,
        email: locals.user.email,
        userName: locals.user.userName,
        fullName: locals.user.name || null,
        role: locals.user.role || 'user',
        is_active: locals.user.is_active ?? true,
        createdAt: locals.user.createdAt,
        updatedAt: locals.user.updatedAt
      };
      
      return {
        user: userData,
        session: locals.session
      };
    }
    
    // Fall back to getting session from cookies if not in locals
    console.log('[Protected Layout] No user in locals, checking session from cookies');
    const session = await getSession(cookies);
    
    if (!session) {
      console.log('[Protected Layout] No valid session found, redirecting to sign in');
      const callbackUrl = encodeURIComponent(url.pathname + url.search);
      throw redirect(303, `/auth/signin?callbackUrl=${callbackUrl}`);
    }
    
    console.log('[Protected Layout] User from session:', { 
      id: session.user.id, 
      email: session.user.email,
      userName: session.user.userName
    });
    
    // Return the user data to be available in the page data and all child routes
    const userData = {
      id: session.user.id,
      email: session.user.email,
      userName: session.user.userName,
      fullName: session.user.fullName || null,
      role: session.user.role || 'user',
      is_active: session.user.is_active ?? true,
      createdAt: session.user.created_at ? new Date(session.user.created_at).toISOString() : new Date().toISOString(),
      updatedAt: session.user.updated_at ? new Date(session.user.updated_at).toISOString() : new Date().toISOString()
    };
    
    return {
      user: userData,
      session: {
        user: userData,
        id: session.id,
        expiresAt: session.expiresAt
      }
    };
  } catch (error) {
    console.error('[Protected Layout] Error in layout load function:', error);
    // Clear the session cookie on error
    cookies.delete('session_id', { 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax'
    });
    
    // Redirect to sign-in with error message
    const errorMessage = error instanceof Error ? error.message : 'Authentication error';
    throw redirect(303, `/auth/signin?error=${encodeURIComponent(errorMessage)}`);
  }
};
