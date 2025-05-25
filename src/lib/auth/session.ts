import { page } from '$app/stores';
import { derived } from 'svelte/store';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  image?: string;
}

export const user = derived(
  page,
  ($page) => $page.data.user as User | null
);

export const isAuthenticated = derived(
  user,
  ($user) => !!$user?.id
);

export const userRole = derived(
  user,
  ($user) => $user?.role || null
);

export function hasRole(role: string) {
  return derived(
    userRole,
    ($userRole) => $userRole === role
  );
}

// Helper function to require authentication
export async function requireAuth() {
  const { user: currentUser } = await import('$lib/auth/session');
  const { goto } = await import('$app/navigation');
  
  return derived(
    currentUser,
    ($user) => {
      if (!$user) {
        goto('/auth/signin');
      }
      return $user;
    }
  );
}
