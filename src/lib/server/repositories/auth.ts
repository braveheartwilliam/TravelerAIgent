import { db } from '$lib/server/db';
import { eq, and, gte } from 'drizzle-orm';
import { users } from '$lib/server/schema.updated';
import { getUserByEmail, getUserById, getUserByUserName, createUser } from './users';
import type { User, NewUser } from '$lib/types/users';
// Using dynamic import for bcrypt to handle the type declaration issue
const bcrypt = require('bcrypt');
import { authenticateUser, registerUser, hasRole, validateSession, getSafeUser } from '$lib/server/auth/utils';

/**
 * Authentication Repository
 * Provides functions for user authentication using better-auth
 */

// Constants
const SALT_ROUNDS = 10;

// Export the consolidated authentication functions
export { authenticateUser, registerUser, hasRole, validateSession, getSafeUser };

/**
 * Register a new user
 * This function is now imported from the consolidated auth utilities
 * @see $lib/server/auth/utils.ts
 */

/**
 * Authenticate a user with email and password
 * This function is now imported from the consolidated auth utilities
 * @see $lib/server/auth/utils.ts
 */

/**
 * Change user password
 * @param userId User ID
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns True if password was changed successfully, false otherwise
 */
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return false; // User not found
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return false; // Current password doesn't match
    }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password
    await db.update(users)
      .set({ 
        password: newHashedPassword,
        updated_at: new Date()
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}

/**
 * Request password reset
 * @param email User's email
 * @returns Reset token or null if user not found
 */
export async function requestPasswordReset(email: string): Promise<string | null> {
  try {
    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return null; // User not found
    }

    // Generate reset token (this would typically be a more secure token)
    const resetToken = crypto.randomUUID();
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valid for 1 hour

    // Store reset token in database
    await db.update(users)
      .set({ 
        reset_token: resetToken,
        reset_token_expires: resetExpiry,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    return resetToken;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return null;
  }
}

/**
 * Reset password with token
 * @param token Reset token
 * @param newPassword New password
 * @returns True if password was reset successfully, false otherwise
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    // Find user with this reset token
    const result = await db.select()
      .from(users)
      .where(and(
        eq(users.reset_token, token),
        gte(users.reset_token_expires, new Date())
      ))
      .limit(1);

    if (result.length === 0) {
      return false; // Invalid or expired token
    }

    const user = result[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password and clear reset token
    await db.update(users)
      .set({ 
        password: hashedPassword,
        reset_token: null,
        reset_token_expires: null,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
}

/**
 * Verify email with token
 * @param userId User ID
 * @param token Verification token
 * @returns True if email was verified successfully, false otherwise
 */
export async function verifyEmail(userId: number, token: string): Promise<boolean> {
  try {
    // Find user with this verification token
    const result = await db.select()
      .from(users)
      .where(and(
        eq(users.id, userId),
        eq(users.verification_token, token)
      ))
      .limit(1);

    if (result.length === 0) {
      return false; // Invalid token
    }

    // Update user as verified
    await db.update(users)
      .set({ 
        email_verified: true,
        verification_token: null,
        updated_at: new Date()
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
}

/**
 * Generate email verification token
 * @param userId User ID
 * @returns Verification token or null if user not found
 */
export async function generateEmailVerificationToken(userId: number): Promise<string | null> {
  try {
    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return null; // User not found
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();

    // Store verification token in database
    await db.update(users)
      .set({ 
        verification_token: verificationToken,
        updated_at: new Date()
      })
      .where(eq(users.id, userId));

    return verificationToken;
  } catch (error) {
    console.error('Error generating email verification token:', error);
    return null;
  }
}

/**
 * Check if user has required role
 * This function is now imported from the consolidated auth utilities
 * @see $lib/server/auth/utils.ts
 */

/**
 * Update user session data
 * This function would typically be used with better-auth to update session data
 * @param userId User ID
 * @param sessionData Session data to update
 * @returns True if session was updated successfully, false otherwise
 */
export async function updateSessionData(userId: number, sessionData: Record<string, any>): Promise<boolean> {
  try {
    // This would be implemented according to better-auth's session handling
    // For now, we'll just return true
    return true;
  } catch (error) {
    console.error('Error updating session data:', error);
    return false;
  }
}
