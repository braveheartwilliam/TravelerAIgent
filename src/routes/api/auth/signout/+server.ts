import { json, type RequestHandler } from '@sveltejs/kit';
import { clearSessionCookies } from '$lib/utils/auth';

export const POST: RequestHandler = async () => {
  try {
    // Clear all session cookies
    const clearCookieHeader = clearSessionCookies();
    
    return json(
      { 
        success: true, 
        message: 'Successfully signed out' 
      },
      { 
        headers: clearCookieHeader 
      }
    );
    
  } catch (error) {
    console.error('Sign out error:', error);
    return json(
      { 
        success: false, 
        error: 'An error occurred while signing out' 
      },
      { status: 500 }
    );
  }
};
