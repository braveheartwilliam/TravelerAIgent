/**
 * Server-side authentication utilities
 * Provides consistent authentication functions for better-auth integration
 */

import { db } from '$lib/server/db';
import { eq, and, gte } from 'drizzle-orm';
import { users } from '$lib/server/schema.updated';
import { getUserByEmail, getUserById, getUserByUserName, createUser } from '../repositories/users';
import type { User } from '$lib/types/users';
// Using dynamic import for bcrypt to handle the type declaration issue
const bcrypt = require('bcrypt');
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// Constants
const SALT_ROUNDS = 10;

/**
 * Require authentication for a route
 * Redirects to sign in page if user is not authenticated
 */
export async function requireAuth(event: RequestEvent) {
  const session = await event.locals.getSession?.();
  
  if (!session?.user) {
    throw redirect(303, `/auth/signin?callbackUrl=${event.url.pathname}`);
  }

  return session;
}

/**
 * Redirect if user is already authenticated
 * Useful for auth pages that should only be accessible to unauthenticated users
 */
export async function redirectIfAuthenticated(event: RequestEvent) {
  const session = await event.locals.getSession?.();
  
  if (session?.user) {
    throw redirect(303, '/');
  }

  return session;
}

/**
 * Check if user has required role
 * @param userId User ID
 * @param requiredRole Required role
 * @returns True if user has required role, false otherwise
 */
export async function hasRole(userId: number, requiredRole: string): Promise<boolean> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return false;
    }

    return user.role === requiredRole || user.role === 'admin';
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Authenticate a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns The authenticated user or null if authentication failed
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return null; // User not found
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password || '');
    if (!passwordMatch) {
      return null; // Password doesn't match
    }

    // Update last login timestamp
    await db.update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, user.id));

    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Register a new user
 * @param email User's email
 * @param password User's password
 * @param userName User's userName
 * @param fullName User's full name
 * @returns The created user or null if registration failed
 */
export async function registerUser(
  email: string,
  password: string,
  userName: string,
  fullName: string
): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return null; // User already exists
    }

    // Check if userName is taken
    const existingUserName = await getUserByUserName(userName);
    if (existingUserName) {
      return null; // UserName already taken
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = {
      email,
      userName,
      password: hashedPassword,
      fullName,
      role: 'user',
      email_verified: false,
      is_active: true,
    };

    return await createUser(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
}

/**
 * Validate session data
 * @param session Session data to validate
 * @returns True if session is valid, false otherwise
 */
export function validateSession(session: any): boolean {
  if (!session) return false;
  
  // Check if session has required fields
  if (!session.user?.id) return false;
  
  // Check if session is expired
  const expiresAt = session.expires_at ? new Date(session.expires_at) : null;
  if (expiresAt && expiresAt < new Date()) return false;
  
  return true;
}

/**
 * Get safe user data for client-side use
 * Removes sensitive fields from user data
 * @param user User data
 * @returns Safe user data for client-side use
 */
export function getSafeUser(user: User | null): Partial<User> | null {
  if (!user) return null;
  
  // Return only safe fields
  return {
    id: user.id,
    userName: user.userName,
    email: user.email,
    fullName: user.fullName,
    profile_picture: user.profile_picture,
    role: user.role,
    is_active: user.is_active,
    email_verified: user.email_verified,
  };
}
