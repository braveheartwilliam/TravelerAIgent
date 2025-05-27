import { json, error, type RequestHandler, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createSession, type SessionData } from '$lib/server/session-utils';
import { verifyPassword } from '$lib/server/auth-utils';

interface SignInRequest {
  email: string;
  password: string;
  remember?: boolean;
  callbackUrl?: string;
}

export const POST: RequestHandler = async ({ request, cookies, locals, url }) => {
  try {
    // Parse the request body as JSON
    let requestData: SignInRequest;
    try {
      requestData = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { email, password, callbackUrl } = requestData;

    if (!email || !password) {
      return json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));

    if (!user) {
      throw error(401, 'Invalid email or password');
    }

    // Verify the password hash
    if (!user.password || !user.salt) {
      console.error('User password or salt is missing');
      throw error(401, 'Invalid email or password');
    }
    
    const isPasswordValid = await verifyPassword(password, user.password, user.salt);
    if (!isPasswordValid) {
      console.error('Invalid password for user:', user.email);
      throw error(401, 'Invalid email or password');
    }

    // Create session using the session utility function
    console.log('=== CREATING SESSION IN SIGNIN HANDLER ===');
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('User Name:', user.userName);
    console.log('Role:', user.role || 'user');
    
    // Prepare user data for session
    const userData = {
      id: user.id,
      email: user.email || '',
      userName: user.userName || '',
      role: (user.role as 'user' | 'admin') || 'user',
      is_active: user.is_active !== false,
      name: user.fullName || user.userName || '',
      createdAt: user.created_at.toISOString(),
      updatedAt: (user.updated_at || new Date()).toISOString()
    };

    // Prepare user data for session
    const sessionUserData = {
      id: user.id.toString(), // Ensure ID is a string
      email: user.email || '',
      userName: user.userName || '',
      role: (user.role as 'user' | 'admin') || 'user',
      is_active: user.is_active !== false,
      name: user.fullName || user.userName || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at || new Date()
    };

    // Create session with the user data
    const { session: sessionData, cookie: sessionCookie } = await createSession(sessionUserData);
    
    console.log('Created session data:', JSON.stringify(sessionData, null, 2));
    
    // Create the user data for the response
    const responseUser = {
      id: user.id.toString(),
      email: user.email || '',
      name: user.fullName || user.userName || '',
      userName: user.userName || '',
      fullName: user.fullName || null,
      role: (user.role as 'user' | 'admin') || 'user',
      is_active: user.is_active !== false,
      createdAt: user.created_at.toISOString(),
      updatedAt: (user.updated_at || new Date()).toISOString(),
      expires: sessionData.expiresAt.toISOString()
    };
    
    // Set the user in locals
    locals.user = responseUser;
    
    console.log('=== SESSION CREATED SUCCESSFULLY ===');
    console.log('Session ID:', sessionData.id);
    console.log('Session expires at:', sessionData.expiresAt);
    console.log('Session user ID:', sessionData.user.id);
    console.log('Session cookie (first 50 chars):', sessionCookie.substring(0, 50) + '...');

    // Set the user in locals for the current request
    const currentUserData = {
      id: user.id.toString(),
      email: user.email,
      name: user.fullName || user.userName,
      userName: user.userName,
      fullName: user.fullName || null,
      role: user.role || 'user',
      is_active: user.is_active !== false,
      createdAt: user.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: user.updated_at?.toISOString() || new Date().toISOString(),
      expires: sessionData.expiresAt
    };
    
    // Assign to locals
    locals.user = userData;

    // Set the session cookie with proper attributes
    console.log('=== SETTING SESSION COOKIE ===');
    console.log('Cookie string length:', sessionCookie.length);
    
    // Parse the cookie to log its components
    const cookieParts = sessionCookie.split('; ');
    const nameValue = cookieParts[0] || '';
    const options = cookieParts.slice(1);
    console.log('Cookie components:', {
      nameValue: nameValue.substring(0, 50) + (nameValue.length > 50 ? '...' : ''),
      options: options.join('; ')
    });
    
    // Determine redirect URL
    const redirectTo = (typeof callbackUrl === 'string' && callbackUrl.startsWith('/')) 
      ? callbackUrl 
      : '/__protected__/dashboard';

    // Create response with user data and redirect URL
    const responseData = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName || user.userName,
        userName: user.userName,
        role: user.role || 'user',
        is_active: user.is_active !== false,
        fullName: user.fullName,
        createdAt: user.created_at?.toISOString() || new Date().toISOString(),
        updatedAt: user.updated_at?.toISOString() || new Date().toISOString(),
        expires: sessionData.expiresAt
      },
      redirect: redirectTo
    };
    
    console.log('Sending response with user data and redirect:', redirectTo);
    
    // Create response with secure cookie
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': sessionCookie,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (err: unknown) {
    console.error('Sign in error:', err);
    if (err && typeof err === 'object' && 'status' in err && err.status === 400) {
      const errorWithBody = err as { body?: { message?: string } };
      return json({ error: errorWithBody.body?.message || 'Bad request' }, { status: 400 });
    }
    return json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
