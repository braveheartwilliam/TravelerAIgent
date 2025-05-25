import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Helper function to set CORS headers
function setCorsHeaders(request: Request, additionalHeaders: Record<string, string> = {}) {
  const origin = request.headers.get('origin');
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...additionalHeaders
  };
}

// Handle OPTIONS requests for CORS preflight
export const OPTIONS: RequestHandler = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(request, {
      'Access-Control-Max-Age': '86400' // 24 hours
    })
  });
};

export const GET: RequestHandler = async ({ locals, request }) => {
  try {
    // Get the current user from the session
    const user = locals.user;
    
    // Prepare response headers
    const headers = setCorsHeaders(request);
    
    if (!user) {
      return json(
        { user: null, isAuthenticated: false },
        { headers }
      );
    }
    
    // Return the user data without sensitive information
    return json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role || 'user'
      },
      isAuthenticated: true
    }, { headers });
  } catch (error) {
    console.error('Session error:', error);
    return json(
      { user: null, isAuthenticated: false, error: 'Failed to get session' },
      { status: 500, headers: setCorsHeaders(request) }
    );
  }
};
