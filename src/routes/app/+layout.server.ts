import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad as BaseLayoutServerLoad } from './$types';

export type LayoutServerLoad = BaseLayoutServerLoad;

export const load: LayoutServerLoad = async ({ locals, url }) => {
  try {
    const session = await locals.getSession?.();
    
    // If no session, redirect to sign-in page with callback URL
    if (!session) {
      const callbackUrl = url.pathname + url.search;
      throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    
    // Make sure we have a user object
    if (!session.user) {
      console.error('Session exists but user data is missing in app layout');
      throw redirect(303, '/auth/error?error=invalid_session');
    }
    
    // Return only the necessary session data
    return {
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
        expires: session.expires
      }
    };
  } catch (error) {
    console.error('App layout server error:', error);
    
    // If it's a redirect, re-throw it
    if (error instanceof Error && 'status' in error && error.status === 303) {
      throw error;
    }
    
    // For other errors, redirect to home with error state
    throw redirect(303, '/?error=server_error');
  }
};
