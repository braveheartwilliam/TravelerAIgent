import { json, type RequestHandler } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/session-utils';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    // Get the session ID from cookies
    const sessionId = cookies.get('session_id');
    
    // Delete the session from the database and clear cookies
    const [clearCookieHeader] = await deleteSession(cookies, sessionId);
    
    // Get the redirect URL from the request or default to home
    const { redirectTo = '/' } = await request.json().catch(() => ({}));
    
    // Create headers object with proper typing
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (clearCookieHeader) {
      headers.append('Set-Cookie', clearCookieHeader);
    }
    
    return json(
      { 
        success: true, 
        message: 'Successfully signed out',
        redirect: redirectTo
      },
      { headers }
    );
    
  } catch (error) {
    console.error('Sign out error:', error);
    return json(
      { 
        success: false, 
        error: 'An error occurred while signing out',
        redirect: '/auth/signin'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

// Handle GET requests for direct browser navigation
export const GET: RequestHandler = async ({ cookies }) => {
  // Get the session ID from cookies
  const sessionId = cookies.get('session_id');
  
  try {
    // Delete the session from the database and clear cookies
    const [clearCookieHeader] = await deleteSession(cookies, sessionId);
    
    // Create headers object with proper typing
    const headers = new Headers();
    headers.append('Location', '/auth/signin?message=signed_out');
    if (clearCookieHeader) {
      headers.append('Set-Cookie', clearCookieHeader);
    }
    
    // Redirect to signin page with success message
    return new Response(null, {
      status: 303,
      headers
    });
    
  } catch (error) {
    console.error('Sign out error:', error);
    
    // Redirect to signin page with error message
    return new Response(null, {
      status: 303,
      headers: {
        'Location': '/auth/signin?error=sign_out_failed'
      }
    });
  }
};
