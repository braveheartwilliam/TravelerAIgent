import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth-utils';
import { createSession } from '$lib/server/session-utils';
import { SESSION_COOKIE_NAME } from '$lib/constants';
import { dev } from '$app/environment';
import type { User } from '$lib/server/schema';

// Maximum number of failed login attempts before account is locked
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to set CORS headers
function setCorsHeaders(request: Request, additionalHeaders: Record<string, string> = {}) {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    ...additionalHeaders
  };
  return headers;
}

// Handle OPTIONS requests for CORS preflight
export const OPTIONS: RequestHandler = async ({ request }) => {
  return new Response(null, {
    status: 204,
    headers: setCorsHeaders(request, {
      'Access-Control-Max-Age': '86400' // 24 hours
    })
  });
};

// Helper function to create error response
function createErrorResponse(
  error: string, 
  status: number, 
  request: Request, 
  additionalInfo: Record<string, unknown> = {}
) {
  console.error(`[${status}] ${error}`, additionalInfo);
  return json(
    { success: false, error, ...additionalInfo },
    { 
      status, 
      headers: setCorsHeaders(request) 
    }
  );
}

// Handle sign-in POST requests
export const POST: RequestHandler = async (event) => {
  const { request, cookies, url } = event;
  console.log('=== SIGN IN REQUEST STARTED ===');
  
  try {
    const { email, password } = await request.json() as { email?: string; password?: string };
    
    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400, request);
    }
    
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      return createErrorResponse('Invalid email or password', 401, request);
    }
    
    // Check if account is locked
    if (user.last_failed_login) {
      const lastFailedLogin = new Date(user.last_failed_login).getTime();
      const lockoutTime = lastFailedLogin + LOCKOUT_DURATION;
      
      if (Date.now() < lockoutTime) {
        const retryAfter = Math.ceil((lockoutTime - Date.now()) / 1000);
        return createErrorResponse(
          'Account locked due to too many failed attempts. Please try again later.',
          429,
          request,
          { retryAfter }
        );
      }
    }
    
    // Verify password
    if (!user.password || !user.salt || !await verifyPassword(password, user.password, user.salt)) {
      // Update failed login attempt
      await db.update(users)
        .set({ 
          last_failed_login: new Date() 
        })
        .where(eq(users.id, user.id));
      
      return createErrorResponse('Invalid email or password', 401, request);
    }
    
    // Reset failed login attempts on successful login
    if (user.last_failed_login) {
      await db.update(users)
        .set({ last_failed_login: null })
        .where(eq(users.id, user.id));
    }
    
    // Update last login time
    await db.update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, user.id));
    
    // Create session with non-null role and is_active
    const userRole = user.role ?? 'user';
    const isUserActive = user.is_active ?? true;
    
    // Create a new session for the user
    try {
      // Create a new session
      const { session, cookie } = await createSession({
        id: user.id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName,
        role: userRole === 'user' || userRole === 'admin' ? userRole : 'user',
        is_active: isUserActive,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      });
      
      // Set session cookie with consistent options
      const isProduction = process.env.NODE_ENV === 'production';
      const domain = isProduction ? process.env.COOKIE_DOMAIN : undefined;
      
      // Set the session cookie using the cookies API
      cookies.set(SESSION_COOKIE_NAME, session.id, {
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        domain
      });
      
      console.log(`[signin] Successfully created session for user ${user.id}`);
      
      // Log the cookie details for debugging
      console.log(`[signin] Set session cookie with options:`, {
        secure: isProduction,
        domain: domain || 'localhost',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
        httpOnly: true,
        path: '/'
      });
    } catch (error) {
      console.error('[signin] Error creating session:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to create session'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return success response with user data (excluding sensitive fields)
    const userData = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      fullName: user.fullName,
      role: user.role,
      is_active: user.is_active
    };
    
    return new Response(JSON.stringify({
      success: true,
      user: userData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...setCorsHeaders(request)
      }
    });
    
  } catch (error) {
    console.error('Signin error:', error);
    return createErrorResponse(
      'An error occurred during signin',
      500,
      request,
      dev ? { error: error instanceof Error ? error.message : String(error) } : {}
    );
  }
};
