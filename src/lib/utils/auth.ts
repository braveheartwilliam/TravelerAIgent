import { redirect, type Cookies, type RequestEvent } from '@sveltejs/kit';

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: unknown;
} | null;

export function getUserFromCookies(cookies: Cookies): User | null {
  try {
    const session = cookies.get('session');
    if (!session) return null;
    return JSON.parse(session);
  } catch (error) {
    console.error('Error parsing user from cookies:', error);
    return null;
  }
}

export function requireAuth(event: RequestEvent): never | User {
  const user = getUserFromCookies(event.cookies);
  
  if (!user) {
    // Store the current URL for redirecting back after login
    const fromUrl = event.url.pathname + event.url.search;
    throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(fromUrl)}`);
  }
  
  return user as User; // We know user is not null here due to the check above
}

export function requireRole(event: RequestEvent, roles: string | string[]): User {
  // requireAuth will throw a redirect if user is not authenticated
  const user = requireAuth(event);
  
  // If we get here, user is defined (requireAuth would have thrown otherwise)
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  // Type assertion since we know user is not null here
  const userWithRole = user as User & { role: string };
  
  if (!requiredRoles.includes(userWithRole.role)) {
    throw redirect(303, '/unauthorized');
  }
  
  return userWithRole;
}

export function createSessionCookies(user: User, rememberMe: boolean = false) {
  const sessionData = JSON.stringify(user);
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 1 week or 1 day
  
  return {
    'Set-Cookie': `session=${sessionData}; Path=/; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }; Max-Age=${maxAge}`
  };
}

export function clearSessionCookies() {
  return {
    'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly' +
      (process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Lax' : '')
  };
}
