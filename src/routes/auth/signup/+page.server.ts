import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$lib/schemas/auth';
import { db } from '$lib/server/db/index'; // Import from index to use the correct schema
import { eq, or, sql } from 'drizzle-orm';
import { randomBytes, createHash } from 'crypto';
import type { PageServerLoad } from './$types';
import { users, sessions } from '$lib/server/schema'; // This is the correct schema with userName (camelCase)

// Type for user data from the signup form
type UserData = {
  userName: string;
  email: string;
  fullName?: string;
  password: string;
  confirmPassword: string;
};

// Enhanced debug logging utility
function debugLog(message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Signup] ${message}`);
  
  if (data) {
    try {
      console.log('Data:', JSON.stringify(data, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v, 2));
    } catch (e) {
      console.log('Data (could not stringify):', data);
    }
  }
}

// Password hashing utilities
function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

// Session management
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

function getSessionExpiration(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
  return expiresAt;
}

// Server-side load function
export const load: PageServerLoad = async ({ locals }) => {
  // If user is already logged in, redirect to dashboard
  if (locals.user) {
    throw redirect(303, '/__protected__/dashboard');
  }
  
  // Initialize form with default values
  const form = await superValidate(zod(signupSchema));
  return { form };
};

// Main signup handler
export const actions: Actions = {
  default: async ({ request, cookies, locals }) => {
    debugLog('=== SIGNUP HANDLER STARTED ===');
    
    try {
      // Validate form data
      const form = await superValidate(request, zod(signupSchema));
      debugLog('Form data received', { 
        valid: form.valid,
        data: { ...form.data, password: '***', confirmPassword: '***' } 
      });
      
      if (!form.valid) {
        debugLog('Form validation failed', { errors: form.errors });
        return fail(400, { 
          form,
          message: 'Validation failed',
          error: 'Please check the form for errors',
          fieldErrors: form.errors
        });
      }
      
      const { email, userName, fullName, password } = form.data as UserData;
      
      // Check if user already exists
      debugLog('Checking for existing user', { email, userName });
      const existingUser = await db.query.users.findFirst({
        where: or(
          eq(users.email, email),
          eq(users.userName, userName)
        )
      });
      
      if (existingUser) {
        debugLog('User already exists', { email, userName });
        return fail(400, {
          form,
          message: 'User already exists',
          error: 'A user with this email or username already exists.'
        });
      }
      
      // Hash password
      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);
      
      // Create user in database
      debugLog('Creating user in database', { email, userName });
      
      const [newUser] = await db.insert(users)
        .values({
          userName,
          email,
          fullName,
          password: passwordHash,
          salt,
          role: 'user',
          is_active: true,
          email_verified: null,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning({ id: users.id });
      
      if (!newUser?.id) {
        throw new Error('Failed to create user: No ID returned from database');
      }
      
      const userId = newUser.id;
      debugLog('User created successfully', { userId });
      
      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = getSessionExpiration();
      
      debugLog('Creating session', { 
        userId,
        expiresAt: expiresAt.toISOString() 
      });
      
      // Create session in database
      await db.insert(sessions).values({
        id: sessionToken,
        user_id: userId,
        expires_at: expiresAt,
        created_at: new Date()
      });
      
      // Create session data
      const sessionData = {
        id: String(userId),
        email: email,
        name: fullName || null,
        role: 'user'
      };

      // Set session cookie with proper JSON data
      const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        ...(process.env['COOKIE_DOMAIN'] && { domain: process.env['COOKIE_DOMAIN'] })
      };
      
      // Stringify the session data and encode it for the cookie
      cookies.set('session', JSON.stringify(sessionData), cookieOptions);
      
      debugLog('Signup completed successfully', { userId, email });
      
      // Redirect to dashboard after successful signup
      throw redirect(303, '/dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      debugLog('Error during signup', { 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return fail(500, {
        message: 'An error occurred during signup',
        error: process.env['NODE_ENV'] === 'development' ? errorMessage : 'Please try again later',
        form: {}
      });
    }
  }
};

        

