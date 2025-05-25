import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserFromCookies } from '$lib/utils/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const user = getUserFromCookies(cookies);
    
    if (!user) {
      return json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Return only the necessary user data, not sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    return json(userData);
    
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
};
