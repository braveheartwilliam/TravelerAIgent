import type { LayoutServerLoad } from './$types';
import { requireAuth } from '$lib/utils/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const load: LayoutServerLoad = async (event) => {
  // This will redirect to sign-in if not authenticated
  const user = requireAuth(event) as User;
  
  // If we get here, the user is authenticated
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};
