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
  if (!user) {
    throw new Error('Cannot create session cookies: User is required');
  }
  
  // Create a safe user object with only the necessary fields
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    // Add any other necessary fields, but be careful with sensitive data
  };
  
  const sessionData = JSON.stringify(sessionUser);
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 2; // 1 week or 2 days
  
  // Create the cookie string
  const cookieParts = [
    `session=${encodeURIComponent(sessionData)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`
  ];
  
  // Add Secure flag in production
  if (process.env.NODE_ENV === 'production') {
    cookieParts.push('Secure');
  }
  
  // Add domain if in production
  if (process.env.NODE_ENV === 'production' && process.env['COOKIE_DOMAIN']) {
    cookieParts.push(`Domain=${process.env['COOKIE_DOMAIN']}`);
  }
  
  return {
    'Set-Cookie': cookieParts.join('; ')
  };
}

export function clearSessionCookies() {
  return {
    'Set-Cookie': 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly' +
      (process.env.NODE_ENV === 'production' ? '; Secure; SameSite=Lax' : '')
  };
}
