import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: string;
} | null;

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

// Helper to check if user is authenticated
export const isAuthenticated = (user: User | null | undefined): boolean => {
  return !!user?.id;
};

// Helper to check if user has a specific role
export const hasRole = (user: User | null | undefined, role: string): boolean => {
  return user?.role === role;
};
