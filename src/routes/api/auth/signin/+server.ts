import { json, type RequestHandler } from '@sveltejs/kit';
import { createSessionCookies } from '$lib/utils/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';

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

// Handle sign-in POST requests
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
  try {
    // Parse request body
    let email: string, password: string, rememberMe: boolean;
    
    try {
      const body = await request.json();
      email = body.email?.trim().toLowerCase();
      password = body.password;
      rememberMe = Boolean(body.rememberMe);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return json(
        { success: false, error: 'Invalid request body' },
        { status: 400, headers: setCorsHeaders(request) }
      );
    }

    // Validate input
    if (!email || !password) {
      return json(
        { success: false, error: 'Email and password are required' },
        { status: 400, headers: setCorsHeaders(request) }
      );
    }

    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      console.error('User not found:', email);
      return json(
        { success: false, error: 'Invalid email or password' },
        { status: 401, headers: setCorsHeaders(request) }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return json(
        { success: false, error: 'This account has been deactivated. Please contact support.' },
        { status: 403, headers: setCorsHeaders(request) }
      );
    }

    // Check if account is locked due to too many failed attempts
    if (user.last_failed_login) {
      const lockoutTime = new Date(user.last_failed_login).getTime();
      const timeSinceLockout = Date.now() - lockoutTime;
      
      if (timeSinceLockout < LOCKOUT_DURATION) {
        const remainingSeconds = Math.ceil((LOCKOUT_DURATION - timeSinceLockout) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        const timeLeft = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
        
        return json(
          { 
            success: false, 
            error: `Too many failed login attempts. Please try again in ${timeLeft}.` 
          },
          { status: 429, headers: setCorsHeaders(request) }
        );
      } else {
        // Reset failed login tracking after lockout period has passed
        console.log('Lockout period has passed, resetting failed login tracking');
        try {
          await db.update(users)
            .set({ 
              last_failed_login: null,
              updated_at: new Date()
            })
            .where(eq(users.id, user.id));
        } catch (error) {
          console.error('Error resetting failed login tracking:', error);
          // Continue with login despite error
        }
      }
    }

    // Verify password
    if (!user.password) {
      console.error('No password set for user:', user.email);
      return json(
        { success: false, error: 'Password not set for this account. Please use a different login method.' },
        { status: 400, headers: setCorsHeaders(request) }
      );
    }

    // Hash the input password with the stored salt using SHA-256 (Node.js crypto)
    const inputHashHex = createHash('sha256')
      .update(password + (user.salt || ''))
      .digest('hex');
    
    // Compare the hashes (case-insensitive comparison)
    const isValid = inputHashHex.toLowerCase() === user.password.toLowerCase();
    
    console.log('Password verification:', {
      input: password,
      salt: user.salt,
      inputHash: inputHashHex,
      storedHash: user.password,
      match: isValid
    });
    
    if (!isValid) {
      console.error('Invalid password for user:', user.email);
      
      // Update failed login attempt
      await db.update(users)
        .set({ 
          last_failed_login: new Date(),
          updated_at: new Date()
        })
        .where(eq(users.id, user.id));
      
      return json(
        { success: false, error: 'Invalid email or password' },
        { status: 401, headers: setCorsHeaders(request) }
      );
    }

    // Update last login time and reset failed login attempts
    console.log('Authentication successful for user:', user.email);
    
    await db.update(users)
      .set({ 
        last_login: new Date(),
        last_failed_login: null, // Reset failed login attempts on successful login
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));
    
    // Create session cookie
    const session = await createSessionCookies({
      id: user.id.toString(),
      email: user.email,
      name: user.fullName || user.email,
      role: user.role || 'user'
    });
    
    console.log('Sign in successful for user:', user.email);
    
    // Prepare response headers
    const headers = new Headers();
    headers.append('Set-Cookie', session);
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');
    
    // Add CORS headers
    const corsHeaders = setCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (value) headers.append(key, value);
    });
    
    // Return success response with user data (excluding sensitive info)
    return json(
      { 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role
        },
        redirectTo: '/__protected__/dashboard' // Explicitly set redirect URL
      },
      { 
        status: 200,
        headers
      }
    );
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
