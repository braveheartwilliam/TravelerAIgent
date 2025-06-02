/**
 * Client-side authentication utilities
 * Provides consistent authentication functions for better-auth integration
 */

import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import { derived } from 'svelte/store';

// User type definition
export interface AuthUser {
  id: string;
  userName: string;
  email: string;
  fullName?: string;
  profile_picture?: string;
  role?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

/**
 * Reactive store for the current user
 * Automatically updates when the page store changes
 */
export const user = derived(
  page,
  ($page) => $page.data.user as AuthUser | null
);

/**
 * Reactive store for authentication status
 * Automatically updates when the user store changes
 */
export const isAuthenticated = derived(
  user,
  ($user) => !!$user?.id
);

/**
 * Reactive store for user role
 * Automatically updates when the user store changes
 */
export const userRole = derived(
  user,
  ($user) => $user?.role || null
);

/**
 * Helper function to check if user has a specific role
 * Returns a derived store that updates when the userRole store changes
 */
export function hasRole(role: string) {
  return derived(
    userRole,
    ($userRole) => $userRole === role || $userRole === 'admin'
  );
}

/**
 * Sign in with a provider
 * @param provider Provider name (e.g., 'email', 'github')
 * @param options Options for sign in
 */
export const signIn = async (provider: string, options?: { callbackUrl?: string }) => {
  try {
    const callbackUrl = options?.callbackUrl || '/';
    window.location.href = `/auth/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  } catch (error) {
    console.error('Auth sign in error:', error);
    toast.error('Failed to sign in. Please try again.');
    throw error;
  }
};

/**
 * Sign out the current user
 * @param options Options for sign out
 */
export const signOut = async (options?: { callbackUrl?: string }) => {
  try {
    const callbackUrl = options?.callbackUrl || '/';
    
    const response = await fetch('/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to sign out');
    }
    
    // Redirect after successful sign out
    window.location.href = callbackUrl;
  } catch (error) {
    console.error('Auth sign out error:', error);
    toast.error('Failed to sign out. Please try again.');
    throw error;
  }
};

/**
 * Helper function to require authentication
 * Redirects to sign in page if user is not authenticated
 * Returns a derived store that updates when the user store changes
 */
export function requireAuth() {
  return derived(
    user,
    ($user) => {
      if (!$user) {
        goto('/auth/signin');
        return null;
      }
      return $user;
    }
  );
}

/**
 * Helper function to validate a redirect URL
 * Ensures the URL is safe and relative
 * @param url URL to validate
 * @param defaultUrl Default URL to use if the provided URL is invalid
 */
export function validateRedirectUrl(url: string | null, defaultUrl = '/'): string {
  if (!url) return defaultUrl;
  
  // Ensure the URL is relative
  if (url.startsWith('http') || url.startsWith('//')) {
    console.warn('Invalid redirect URL (absolute URL), using default');
    return defaultUrl;
  }
  
  // Basic validation to prevent open redirects
  try {
    // Ensure it's a valid URL when combined with origin
    new URL(url, window.location.origin);
    
    // Ensure it starts with a slash
    return url.startsWith('/') ? url : `/${url}`;
  } catch (e) {
    console.warn('Invalid redirect URL, using default:', e);
    return defaultUrl;
  }
}
