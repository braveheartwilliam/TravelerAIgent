import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  try {
    // Get the session
    const session = await locals.getSession?.();
    
    // If no session, redirect to sign-in
    if (!session) {
      const callbackUrl = url.pathname + url.search;
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    // Make sure we have a user object
    if (!session.user) {
      console.error('Session exists but user data is missing:', session);
      throw redirect(303, '/auth/error?error=SessionError');
    }

    // Ensure we have a valid user ID
    const userId = (() => {
      // Cast to any to access sub property which might come from the token
      const user = session.user as any;
      const id = user?.id || user?.sub || '';
      if (typeof id === 'string') return id;
      if (typeof id === 'number') return id.toString();
      if (id && typeof id === 'object' && 'toString' in id) return id.toString();
      return 'unknown-user-id';
    })();

    // Return a consistent session object
    return {
      session: {
        user: {
          id: userId,
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
          role: (session.user as any)?.role || 'user'
        },
        expires: session.expires || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
  } catch (error) {
    console.error('App page server error:', error);
    
    // If it's a redirect, re-throw it
    if (error instanceof Error && 'status' in error && error.status === 303) {
      throw error;
    }
    
    // For other errors, redirect to home with error state
    throw redirect(303, '/?error=server_error');
  }
};
