/**
 * TanStack Query configuration
 * Provides a consistent data fetching pattern for the application
 */

import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';

// Create a QueryClient instance with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Only refetch on window focus in browser environment
      refetchOnWindowFocus: browser,
      // Retry failed queries 1 time
      retry: 1,
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Show error toast on failure
      onError: (error: Error) => {
        toast.error(`Error fetching data: ${error.message}`);
        console.error('Query error:', error);
      },
    },
    mutations: {
      // Show error toast on failure
      onError: (error: Error) => {
        toast.error(`Error updating data: ${error.message}`);
        console.error('Mutation error:', error);
      },
      // Show success toast on success (can be overridden in individual mutations)
      onSuccess: () => {
        toast.success('Operation completed successfully');
      },
    },
  },
});

/**
 * Create API fetch function with error handling
 * @param baseUrl Base URL for API requests
 * @returns Fetch function with error handling
 */
export function createApiFetch(baseUrl: string = '/api') {
  return async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies for authentication
      });
      
      // Handle non-OK responses
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // Ignore JSON parsing errors
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse JSON response
      return await response.json() as T;
    } catch (error) {
      console.error(`API fetch error for ${url}:`, error);
      throw error;
    }
  };
}

// Create default API fetch function
export const apiFetch = createApiFetch();

/**
 * Type for query keys to ensure consistent naming
 */
export type QueryKeys = 
  | ['auth', 'session']
  | ['auth', 'user']
  | ['trips', string | number]
  | ['trips', 'list', Record<string, any>?]
  | ['destinations', string | number]
  | ['destinations', 'list', string | number]
  | ['transportation', string | number]
  | ['transportation', 'list', string | number]
  | ['lodging', string | number]
  | ['lodging', 'list', string | number]
  | ['activities', string | number]
  | ['activities', 'list', string | number];

/**
 * Create a query key with proper typing
 * @param key Query key parts
 * @returns Properly typed query key
 */
export function createQueryKey<T extends QueryKeys>(key: T): T {
  return key;
}
