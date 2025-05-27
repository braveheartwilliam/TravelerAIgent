import type { Cookies } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { User as DbUser } from '$lib/server/schema';
import { db } from '$lib/server/db';
import { sessions, users } from '$lib/server/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { eq, and, gte } from 'drizzle-orm';
import { generateToken } from './auth-utils';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      COOKIE_DOMAIN?: string;
    }
  }
}

// Helper function to validate and return session data
function validateAndReturnSession(sessionData: SessionData): SessionData | null {
  try {
    // Log the session data for debugging
    console.log('Validating session data:', {
      id: sessionData.id,
      userId: sessionData.user?.id,
      email: sessionData.user?.email,
      expiresAt: sessionData.expiresAt
    });

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(sessionData.expiresAt);
    
    if (expiresAt < now) {
      console.log('Session expired');
      return null;
    }
    
    // Ensure required fields are present
    if (!sessionData.user?.id || !sessionData.user?.email) {
      console.error('Invalid session data: missing required fields');
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

// Helper function to get user data by ID
async function getUserById(userId: string | number): Promise<SessionUser | null> {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, typeof userId === 'string' ? parseInt(userId, 10) : userId),
    columns: {
      id: true,
      email: true,
      userName: true,
      role: true,
      fullName: true,
      is_active: true,
      created_at: true,
      updated_at: true
    }
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email || '',
    userName: user.userName || '',
    fullName: user.fullName || null,
    role: user.role || 'user',
    is_active: user.is_active ?? true,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

// Import shared constants
import { SESSION_COOKIE_NAME as COOKIE_NAME, SESSION_MAX_AGE } from '$lib/constants';

// Re-export for backward compatibility
export const SESSION_COOKIE_NAME = COOKIE_NAME;

// Session configuration
export const SESSION_TOKEN_LENGTH = 64;

// User type for session data
export interface SessionUser {
  id: string | number;
  email: string;
  userName: string;
  fullName?: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

// Session data type
/**
 * Represents the session data structure stored in the database
 */
export interface SessionData {
  id: string;
  user: {
    id: number;
    email: string;
    userName: string;
    fullName: string | null;
    role: 'user' | 'admin';
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  };
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Create a new session for the user and store it in the database
 * @param user The user to create a session for
 * @param cookies Optional cookies object for cookie serialization
 * @returns The session data and cookie string
 */
export async function createSession(
  user: SessionUser,
  cookies?: { serialize: (name: string, value: string, options: any) => string }
): Promise<{ session: SessionData; cookie: string }> {
  console.log('[createSession] Creating new session for user:', user.id);
  
  try {
    // Generate a secure session ID
    const sessionId = generateToken(SESSION_TOKEN_LENGTH);
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE);

    console.log('[createSession] Generated session ID:', sessionId);
    console.log('[createSession] Session expires at:', expiresAt.toISOString());
    
    // Ensure user ID is a number
    const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    
    // Create the session in the database with snake_case column names
    await db.insert(sessions).values({
      id: sessionId,
      user_id: userId,  // Using snake_case to match database schema
      expires_at: expiresAt,  // Using snake_case to match database schema
      created_at: now  // Using snake_case to match database schema
    });
    
    console.log('[createSession] Session created in database for user:', userId);
    
    // Ensure dates are properly initialized
    const createdAt = user.createdAt ? new Date(user.createdAt) : now;
    const updatedAt = user.updatedAt ? new Date(user.updatedAt) : now;
    
    // Create the session data object
    const sessionData: SessionData = {
      id: sessionId,
      user: {
        id: userId,
        email: user.email || '',
        userName: user.userName || '',
        fullName: user.fullName || null,
        role: user.role || 'user',
        is_active: user.is_active ?? true,
        created_at: createdAt,
        updated_at: updatedAt
      },
      expiresAt,
      createdAt: now
    };

    // Create cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? process.env.COOKIE_DOMAIN : undefined;
    
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: SESSION_MAX_AGE,
      domain
    };

    let cookieString: string;
    
    try {
      if (cookies?.serialize) {
        // Use provided cookies.serialize if available
        cookieString = cookies.serialize(SESSION_COOKIE_NAME, sessionId, cookieOptions);
      } else {
        // Fallback to manual cookie construction
        const cookieParts = [
          `${SESSION_COOKIE_NAME}=${sessionId}`,
          `Path=${cookieOptions.path}`,
          `Max-Age=${cookieOptions.maxAge}`,
          `HttpOnly`,
          `SameSite=${cookieOptions.sameSite}`,
          `Secure=${cookieOptions.secure}`
        ];
        
        if (cookieOptions.domain) {
          cookieParts.push(`Domain=${cookieOptions.domain}`);
        }
        
        cookieString = cookieParts.join('; ');
      }
      
      console.log(`[createSession] Created session cookie for user ${userId} with options:`, {
        secure: cookieOptions.secure,
        domain: cookieOptions.domain,
        maxAge: cookieOptions.maxAge,
        sameSite: cookieOptions.sameSite,
        httpOnly: cookieOptions.httpOnly,
        path: cookieOptions.path
      });

      console.log('[createSession] Session created successfully');
      return { 
        session: sessionData, 
        cookie: cookieString 
      };
    } catch (error) {
      console.error('[createSession] Error creating cookie:', error);
      throw new Error('Failed to create session cookie');
    }
  } catch (error) {
    console.error('[createSession] Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Get the current session from the request
 */
export async function getSession(cookies: Cookies): Promise<SessionData | null> {
  const sessionToken = cookies.get(SESSION_COOKIE_NAME);
  
  if (!sessionToken) {
    console.log('[getSession] No session cookie found');
    return null;
  }
  
  // Trim any whitespace or quotes from the session token
  const cleanToken = sessionToken.trim().replace(/^["']|["']$/g, '');
  
  if (!cleanToken) {
    console.log('[getSession] Empty session token after cleaning');
    return null;
  }
  
  console.log('[getSession] Session token found');
  
  // Get the session from the database with all required fields
  const now = new Date();
  console.log(`[getSession] Looking up session with token: ${cleanToken.substring(0, 10)}...`);
  
  try {
    const session = await db.query.sessions.findFirst({
      where: (sessions, { eq, and, gte }) => and(
        eq(sessions.id, cleanToken),
        gte(sessions.expires_at, now)
      )
    });
    
    if (!session) {
      console.log('[getSession] No valid session found in database or session expired');
      return null;
    }
    
    console.log(`[getSession] Found session for user ID: ${session.user_id}`);
    
    // Get the user data with proper type safety
    const userResult = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user_id)
    });

    if (!userResult) {
      console.error(`[getSession] User not found for session: ${session.id}`);
      return null;
    }
    
    // Log the user data for debugging
    console.log(`[getSession] Found user: ${userResult.email} (ID: ${userResult.id})`);

    // Check if user account is active
    if (userResult.is_active === false) {
      console.error(`[getSession] User account is deactivated: ${userResult.email}`);
      return null;
    }

    // Convert to SessionData format with proper default values and type safety
    const userCreatedAt = userResult.created_at ? new Date(userResult.created_at) : new Date();
    const userUpdatedAt = userResult.updated_at ? new Date(userResult.updated_at) : userCreatedAt;
    
    const sessionData: SessionData = {
      id: session.id,
      user: {
        id: userResult.id,
        email: userResult.email || '',
        userName: userResult.userName || '',
        fullName: userResult.fullName || null,
        role: (userResult.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
        is_active: userResult.is_active ?? true,
        created_at: userCreatedAt,
        updated_at: userUpdatedAt
      },
      expiresAt: new Date(session.expires_at),
      createdAt: new Date(session.created_at)
    };

    console.log('[getSession] Valid session data for user:', {
      userId: sessionData.user.id,
      email: sessionData.user.email,
      expiresAt: sessionData.expiresAt.toISOString()
    });

    return sessionData;
  } catch (error) {
    console.error('[getSession] Error getting session:', error);
    return null;
  }
}

/**
 * Delete the current session
 */
export async function deleteSession(cookies?: Cookies, sessionId?: string): Promise<string[]> {
  try {
    // If we have a session ID, delete it from the database
    if (sessionId) {
      await db
        .delete(sessions)
        .where(eq(sessions.id, sessionId));
      console.log(`[deleteSession] Deleted session from database: ${sessionId}`);
    }
    
    // If we have cookies, clear the session cookie
    if (cookies) {
      cookies.delete(SESSION_COOKIE_NAME, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' 
          ? process.env.COOKIE_DOMAIN || undefined 
          : 'localhost'
      });
      console.log('[deleteSession] Cleared session cookie');
    }
    
    // Return the cookie header for manual setting if needed
    const cookieParts = [
      `${SESSION_COOKIE_NAME}=`,
      'Path=/',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'HttpOnly',
      'SameSite=Lax',
      `Secure=${process.env.NODE_ENV === 'production'}`,
      `Domain=${process.env.NODE_ENV === 'production' ? (process.env.COOKIE_DOMAIN || '') : 'localhost'}`
    ];

    // Filter out any empty parts and join with semicolons
    const cookieString = cookieParts
      .filter(part => !part.endsWith('=') && part !== '')
      .join('; ');

    return [cookieString];
  } catch (error) {
    console.error('[deleteSession] Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
}

/**
 * Create a session cookie string with consistent settings
 */
export function createSessionCookie(sessionData: SessionData): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = isProduction ? process.env.COOKIE_DOMAIN || '' : '';
  
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${sessionData.id}`,
    'Path=/',
    `Max-Age=${SESSION_MAX_AGE}`,
    'HttpOnly',
    'SameSite=Lax',
    `Secure=${isProduction}`,
    ...(domain ? [`Domain=${domain}`] : [])
  ];

  // Log the cookie being set for debugging
  console.log(`[createSessionCookie] Creating session cookie for user ${sessionData.user.id}`, {
    secure: isProduction,
    domain: domain || 'localhost',
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    httpOnly: true,
    path: '/'
  });

  // Filter out any empty parts and join with semicolons
  const cookieString = cookieParts
    .filter(part => !part.endsWith('=') && part !== '')
    .join('; ');

  console.log(`[createSessionCookie] Cookie string: ${cookieString.substring(0, 50)}...`);
  return cookieString;
}
