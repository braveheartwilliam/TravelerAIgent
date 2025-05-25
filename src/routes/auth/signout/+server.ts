import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  try {
    // Call Better-Auth's sign-out endpoint
    await fetch(`${locals.auth.config.baseUrl}/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Clear the session cookie
    return json(
      { success: true },
      {
        headers: {
          'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
        }
      }
    );
  } catch (error) {
    console.error('Sign out error:', error);
    return json({ error: 'Failed to sign out' }, { status: 500 });
  }
};
