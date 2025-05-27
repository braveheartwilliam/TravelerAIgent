import { redirect, type Cookies, type RequestEvent } from '@sveltejs/kit';

interface UserBase {
  id: string | number;
  email: string;
  name: string;
  userName: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  expires: string;
}

type User = UserBase & {
  [key: string]: unknown;
};

interface NullableUser extends Omit<Partial<User>, 'id' | 'email' | 'name' | 'userName' | 'role'> {
  id?: string | number | null;
  email?: string | null;
  name?: string | null;
  userName?: string | null;
  role?: string | null;
}

export function getUserFromCookies(cookies: Cookies): User | null {
  try {
    const session = cookies.get('session');
    if (!session) {
      console.log('No session cookie found');
      return null;
    }

    // Log the raw session cookie for debugging
    console.log('Raw session cookie:', session.substring(0, 100) + (session.length > 100 ? '...' : ''));
    
    let parsedData: unknown;
    try {
      // First try to parse as is (might be already decoded)
      parsedData = JSON.parse(session);
    } catch (e) {
      try {
        // If that fails, try URL decoding first
        const decodedSession = decodeURIComponent(session);
        console.log('Decoded session:', decodedSession);
        parsedData = JSON.parse(decodedSession);
      } catch (parseError) {
        console.error('Error parsing session data:', parseError);
        return null;
      }
    }
    
    console.log('Parsed session data:', parsedData);
    
    if (!parsedData || typeof parsedData !== 'object' || parsedData === null) {
      console.log('Invalid session data format');
      return null;
    }
    
    // Type guard to check if the parsed data has the required fields
    const hasRequiredFields = (data: unknown): data is { id: unknown; email: unknown } => {
      if (!data || typeof data !== 'object' || data === null) return false;
      
      const hasId = 'id' in data && (typeof data.id === 'string' || typeof data.id === 'number');
      const hasEmail = 'email' in data && typeof data.email === 'string';
      
      if (!hasId || !hasEmail) {
        console.log('Missing required fields in session data', { hasId, hasEmail });
        return false;
      }
      
      return true;
    };

    if (!hasRequiredFields(parsedData)) {
      console.error('Session data missing required fields');
      return null;
    }

    // Safe type assertion since we've validated the shape
    const sessionData = parsedData as Record<string, unknown>;
    
    // Extract fields with type safety using bracket notation
    const id = String(sessionData['id'] || '');
    const email = String(sessionData['email'] || '');
    const name = String(sessionData['name'] || sessionData['userName'] || email.split('@')[0] || 'User');
    const userName = String(sessionData['userName'] || sessionData['name'] || email.split('@')[0] || 'user');
    const role = String(sessionData['role'] || 'user');
    const is_active = sessionData['is_active'] !== false;
    const now = new Date().toISOString();
    const createdAt = String(sessionData['createdAt'] || now);
    const updatedAt = String(sessionData['updatedAt'] || now);
    const expires = String(sessionData['expires'] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    // Create the base user object with all required fields
    const userBase: UserBase = {
      id,
      email,
      name,
      userName,
      role,
      is_active,
      createdAt,
      updatedAt,
      expires
    };

    // Create the full user object with any additional properties
    const user: User = {
      ...userBase,
      // Include any additional properties from sessionData
      ...Object.fromEntries(
        Object.entries(sessionData).filter(([key]) => !(key in userBase))
      )
    };
    
    console.log('Returning user from session cookie:', { 
      id: user.id, 
      email: user.email, 
      userName: user.userName,
      role: user.role
    });
    
    return user;
  } catch (error) {
    console.error('Error parsing user from cookies:', error);
    return null;
  }
}

export function requireAuth(event: RequestEvent): User {
  const user = getUserFromCookies(event.cookies);
  
  if (!user) {
    // Store the current URL for redirecting back after login
    const fromUrl = event.url.pathname + event.url.search;
    throw redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(fromUrl)}`);
  }
  
  return user;
}

export function requireRole(event: RequestEvent, roles: string | string[]): User {
  // requireAuth will throw a redirect if user is not authenticated
  const user = requireAuth(event);
  
  // If we get here, user is defined (requireAuth would have thrown otherwise)
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  
  if (!requiredRoles.includes(user.role)) {
    throw redirect(303, '/unauthorized');
  }
  
  return user;
}

export function createSessionCookies(user: User, rememberMe: boolean = false) {
  if (!user) {
    throw new Error('Cannot create session cookies: User is required');
  }
  
  // Validate required fields with proper type checking
  const requiredFields = ['id', 'email'] as const;
  const missingFields = requiredFields.filter(field => {
    const value = user[field as keyof User];
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Cannot create session cookies: Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Ensure all required fields are present and properly typed
  const sessionData: UserBase = {
    id: String(user.id),
    email: String(user.email),
    name: String(user.name || user.userName || user.email.split('@')[0] || 'User'),
    userName: String(user.userName || user.name || user.email.split('@')[0] || 'user'),
    role: String(user.role || 'user'),
    is_active: user.is_active !== false, // Default to true if not set
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
    expires: user.expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days
  };
  
  console.log('Creating session with data:', {
    id: sessionData.id,
    email: sessionData.email,
    userName: sessionData.userName,
    expires: sessionData.expires
  });
  
  const session = JSON.stringify(sessionData);
  const encodedSession = encodeURIComponent(session);
  
  // Set cookie to expire in 30 days for 'remember me', or when browser closes otherwise
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined;
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge
  };
  
  // Set the session cookie
  const cookies: Record<string, string> = {};
  cookies['session'] = encodedSession;
  
  // Set additional auth cookies if needed
  if (rememberMe) {
    cookies['remember_me'] = 'true';
  }
  
  // Format cookies for HTTP headers
  const cookieStrings = Object.entries(cookies).map(([name, value]) => {
    const options = {
      ...cookieOptions,
      // Convert maxAge to expires date string
      expires: maxAge ? new Date(Date.now() + maxAge * 1000).toUTCString() : undefined
    };
    
    let cookie = `${name}=${value}; Path=${options.path};`;
    if (options.maxAge) cookie += ` Max-Age=${options.maxAge};`;
    if (options.expires) cookie += ` Expires=${options.expires};`;
    if (options.httpOnly) cookie += ' HttpOnly;';
    if (options.secure) cookie += ' Secure;';
    if (options.sameSite) cookie += ` SameSite=${options.sameSite};`;
    
    // Add Domain if specified
    if (process.env['COOKIE_DOMAIN']) {
      cookie += ` Domain=${process.env['COOKIE_DOMAIN']};`;
    }
    
    return cookie;
  });
  
  return {
    'Set-Cookie': cookieStrings
  };
}

export function clearSessionCookies(): string[] {
  const cookies = [
    // Main session cookie
    'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    
    // Auth.js related cookies
    'authjs.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    'authjs.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    'authjs.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    'authjs.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    
    // Remember me cookie
    'remember_me=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
  ];

  // Add secure flag in production
  if (process.env.NODE_ENV === 'production') {
    return cookies.map(cookie => cookie + '; Secure');
  }
  
  return cookies;
}
