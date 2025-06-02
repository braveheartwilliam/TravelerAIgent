/**
 * Authentication utilities index
 * Exports all authentication-related functions and types from a single location
 */

export * from './auth';

// Re-export specific functions for backward compatibility
import { signIn, signOut, isAuthenticated, user, userRole, hasRole, requireAuth } from './auth';
export { signIn, signOut, isAuthenticated, user, userRole, hasRole, requireAuth };
