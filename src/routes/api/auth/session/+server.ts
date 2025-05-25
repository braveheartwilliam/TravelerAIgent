import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Get the current user from the session
    const user = locals.user;
    
    if (!user) {
      return json({ user: null });
    }
    
    // Return the user data without sensitive information
    return json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return json({ user: null, error: 'Failed to get session' }, { status: 500 });
  }
};
