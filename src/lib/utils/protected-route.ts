import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { toast } from 'svelte-sonner';
import { userStore } from '$lib/stores/user';

/**
 * Redirect to sign-in if user is not authenticated
 * @param redirectPath Optional custom redirect path after sign-in
 */
export function requireAuth(redirectPath?: string): boolean {
  const user = get(userStore);
  
  if (!user) {
    const callbackUrl = encodeURIComponent(redirectPath || get(page).url.pathname);
    goto(`/auth/signin?callbackUrl=${callbackUrl}`);
    toast.error('Please sign in to access this page');
    return false;
  }
  
  return true;
}

/**
 * Check if user has required role
 * @param roles Array of allowed roles
 * @param redirectPath Optional custom redirect path if unauthorized
 * @returns boolean indicating if user has required role
 */
export function requireRole(roles: string | string[], redirectPath?: string): boolean {
  const user = get(userStore);
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  // First check if user is authenticated
  if (!requireAuth(redirectPath)) {
    return false;
  }
  
  // Then check if user has required role
  if (!user?.role || !roleArray.includes(user.role)) {
    const callbackUrl = encodeURIComponent(redirectPath || get(page).url.pathname);
    goto(`/unauthorized?from=${callbackUrl}`);
    toast.error('You do not have permission to access this page');
    return false;
  }
  
  return true;
}

/**
 * Higher-order function to protect a component that requires authentication
 * @param Component The component to protect
 * @returns A new component that checks authentication before rendering
 */
export function withAuth<T extends Record<string, any>>(Component: any) {
  return (props: T) => {
    const user = get(userStore);
    const currentPath = get(page).url.pathname;
    
    if (!user) {
      const callbackUrl = encodeURIComponent(currentPath);
      goto(`/auth/signin?callbackUrl=${callbackUrl}`);
      return null;
    }
    
    return <Component {...props} />;
  };
}

/**
 * Higher-order function to protect a component that requires a specific role
 * @param roles Array of allowed roles
 * @param Component The component to protect
 * @returns A new component that checks authorization before rendering
 */
export function withRole<T extends Record<string, any>>(roles: string | string[], Component: any) {
  return (props: T) => {
    const user = get(userStore);
    const currentPath = get(page).url.pathname;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    // Check authentication
    if (!user) {
      const callbackUrl = encodeURIComponent(currentPath);
      goto(`/auth/signin?callbackUrl=${callbackUrl}`);
      return null;
    }
    
    // Check authorization
    if (!user.role || !roleArray.includes(user.role)) {
      const callbackUrl = encodeURIComponent(currentPath);
      goto(`/unauthorized?from=${callbackUrl}`);
      return null;
    }
    
    return <Component {...props} />;
  };
}
