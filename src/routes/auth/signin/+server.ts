import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { email, password, remember } = await request.json();
    
    // Call Better-Auth's sign-in endpoint
    const response = await fetch(`${locals.auth.config.baseUrl}/api/auth/signin/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return json({ error: data.message || 'Failed to sign in' }, { status: response.status });
    }
    
    // Set session cookie if remember is true
    if (remember) {
      // Set a longer expiry for the session cookie
      const oneYear = 60 * 60 * 24 * 365; // 1 year in seconds
      return json(data, {
        headers: {
          'Set-Cookie': `session=${data.sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${oneYear}`
        }
      });
    }
    
    return json(data);
  } catch (error) {
    console.error('Sign in error:', error);
    return json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
