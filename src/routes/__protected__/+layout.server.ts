import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Get the user from locals (set by hooks.server.ts)
  const user = locals.user;
  
  // If there's no user, redirect to the sign-in page with a callback URL
  if (!user) {
    const callbackUrl = encodeURIComponent(url.pathname + url.search);
    throw redirect(303, `/auth/signin?callbackUrl=${callbackUrl}`);
  }

  // Return user data to be available in all child routes
  return {
    session: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    },
    user: user // For backward compatibility
  };
};
