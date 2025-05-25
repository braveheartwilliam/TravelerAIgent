import { json, type RequestHandler } from '@sveltejs/kit';
import { createSessionCookies } from '$lib/utils/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { dev } from '$app/environment';
import type { DatabaseError } from 'pg';

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

// Helper function to safely format dates
function formatDate(dateValue: Date | string | null | undefined): string {
  if (!dateValue) return '';
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', { dateValue, error });
    return '';
  }
}

// Helper function to create error response
function createErrorResponse(error: string, status: number, request: Request, additionalInfo: Record<string, unknown> = {}) {
  console.error(`[${status}] ${error}`, additionalInfo);
  return json(
    { success: false, error, ...additionalInfo },
    { status, headers: setCorsHeaders(request) }
  );
}

// Helper function to verify password
async function verifyPassword(inputPassword: string, storedHash: string, salt: string): Promise<boolean> {
  try {
    const inputHashHex = createHash('sha256')
      .update(inputPassword + salt)
      .digest('hex')
      .toLowerCase();
    
    return inputHashHex === storedHash.toLowerCase();
  } catch (error) {
    console.error('Error in verifyPassword:', error);
    return false;
  }
}

// Type guard for database errors
function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}

// Define user type for better type safety
type UserRecord = {
  id: number;
  email: string;
  userName: string;
  password: string | null;
  salt: string | null;
  is_active: boolean;
  role: string;
  created_at: Date;
};

// Handle sign-in POST requests
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
  console.log('=== SIGN IN REQUEST STARTED ===');
  console.log('Request URL:', request.url);
  console.log('Request Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Log environment variables (safely)
    console.log('Environment:', {
      NODE_ENV: process.env['NODE_ENV'],
      DB_HOST: process.env['DB_HOST'] ? '***' : 'not set',
      DB_NAME: process.env['DB_NAME'] ? '***' : 'not set',
      JWT_SECRET: process.env['JWT_SECRET'] ? '***' : 'not set'
    });
    
    // Parse request body
    let email: string, password: string, rememberMe: boolean;
    
    try {
      const body = await request.json() as { email?: string; password?: string; rememberMe?: boolean };
      console.log('Request body:', { 
        email: body.email,
        hasPassword: !!body?.password,
        rememberMe: body.rememberMe 
      });
      
      if (!body.email || !body.password) {
        return createErrorResponse('Email and password are required', 400, request);
      }
      
      email = body.email.trim().toLowerCase();
      password = body.password;
      rememberMe = Boolean(body.rememberMe);
      
      console.log('Parsed credentials:', { email, rememberMe, hasPassword: !!password });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error parsing request body:', error);
      return createErrorResponse('Invalid request body', 400, request, { error: errorMessage });
    }

    // Validate input
    if (!email || !password) {
      return json(
        { success: false, error: 'Email and password are required' },
        { status: 400, headers: setCorsHeaders(request) }
      );
    }

    // Look up user in database
    let user: UserRecord | null = null;
    
    try {
      console.log('Database connection state:', db ? 'Connected' : 'Not connected');
      
      // Test database connection
      try {
        await db.execute(sql`SELECT 1`);
        console.log('Database connection test successful');
      } catch (dbTestError) {
        const errorMessage = isDatabaseError(dbTestError) 
          ? dbTestError.message 
          : 'Unknown database error';
        const errorCode = isDatabaseError(dbTestError) ? dbTestError.code : 'UNKNOWN';
        
        console.error('Database connection test failed:', dbTestError);
        return createErrorResponse('Database connection error', 500, request, { 
          error: errorMessage,
          code: errorCode
        });
      }
      
      // Look up user by email
      console.log('Looking up user by email:', email);
      const result = await db.execute<UserRecord>(sql`
        SELECT 
          id, 
          email, 
          "userName", 
          password, 
          salt, 
          is_active, 
          role, 
          created_at::timestamp as created_at
        FROM users
        WHERE email = ${email}
        LIMIT 1
      `);
      
      user = result[0] || null;
      
      if (user) {
        console.log('User found:', {
          id: user.id,
          email: user.email,
          userName: user.userName,
          hasPassword: !!user.password,
          isActive: user.is_active
        });
      } else {
        console.log('User not found with email:', email);
        // Don't reveal that the email doesn't exist for security reasons
        return createErrorResponse('Invalid email or password', 401, request);
      }
      
    } catch (dbError) {
      const errorMessage = isDatabaseError(dbError) 
        ? dbError.message 
        : 'Unknown database error';
      const errorCode = isDatabaseError(dbError) ? dbError.code : 'UNKNOWN';
      
      console.error('Database error during user lookup:', dbError);
      return createErrorResponse('Database error during authentication', 500, request, {
        error: errorMessage,
        code: errorCode
      });
    }

    // Check if user is active
    if (!user.is_active) {
      console.log('Login failed: User account is inactive');
      return createErrorResponse(
        'Your account has been deactivated. Please contact support.', 
        403, 
        request
      );
    }

    // Check if password is set and matches
    if (!user.password || !user.salt) {
      console.log('Login failed: No password set for user');
      return createErrorResponse(
        'Password not set for this account. Please reset your password.', 
        403, 
        request
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password, user.salt);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      
      // Update failed login attempt
      try {
        await db.execute(sql`
          UPDATE users 
          SET last_failed_login = NOW(), 
              updated_at = NOW()
          WHERE id = ${user.id}
        `);
      } catch (error) {
        console.error('Failed to update failed login attempt:', error);
      }
      
      return createErrorResponse('Invalid email or password', 401, request);
    }

    // Update last login time and reset failed login attempts
    console.log('Login successful, updating last login time');
    
    try {
      await db.execute(sql`
        UPDATE users 
        SET last_login = NOW(), 
            last_failed_login = NULL, 
            updated_at = NOW()
        WHERE id = ${user.id}
      `);
      
      // Create session data
      const sessionData = {
        id: user.id.toString(),
        email: user.email,
        name: user.userName,
        role: user.role,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      };
      
      // Create session cookie
      const sessionCookie = JSON.stringify(sessionData);
      const encodedSession = encodeURIComponent(sessionCookie);
      
      // Set cookie with proper attributes
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = [
        `Path=/`,
        `HttpOnly`,
        `SameSite=Lax`,
        `Max-Age=${7 * 24 * 60 * 60}`, // 7 days in seconds
        `Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`
      ];
      
      if (isProduction) {
        cookieOptions.push('Secure');
      }
      
      const cookieValue = `session=${encodedSession}; ${cookieOptions.join('; ')}`;
      
      // Prepare response headers
      const headers = new Headers();
      headers.append('Set-Cookie', cookieValue);
      
      // Add CORS headers
      const corsHeaders = setCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.append(key, value);
      });
      
      // Log the raw user data for debugging
      console.log('Raw user data from DB:', {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        created_at_type: typeof user.created_at,
        created_at_value: user.created_at
      });

      // Prepare response data with safe date handling
      const responseData = {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          role: user.role,
          createdAt: formatDate(user.created_at) || new Date().toISOString()
        },
        redirectTo: '/dashboard' // Default redirect
      };
      
      console.log('Sign in successful for user:', user.email);
      return json(responseData, { status: 200, headers });
      
    } catch (error) {
      console.error('Error updating user login time:', error);
      return createErrorResponse(
        'Error completing sign in. Please try again.',
        500,
        request,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  } catch (error) {
    console.error('Error in sign-in endpoint:', error);
    return json(
      { success: false, error: 'Internal server error' },
      { 
        status: 500,
        headers: setCorsHeaders(request)
      }
    );
  }
};
