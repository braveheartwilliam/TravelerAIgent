import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions<T = unknown> {
  method?: RequestMethod;
  body?: T;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  silent?: boolean; // If true, won't show error toasts
}

/**
 * Make an authenticated API request
 * @param path The API endpoint path (without the base URL)
 * @param options Request options
 * @returns The response data
 */
export async function api<T = unknown, R = unknown>(
  path: string,
  options: ApiRequestOptions<T> = {}
): Promise<R> {
  const {
    method = 'GET',
    body,
    headers = {},
    credentials = 'include',
    silent = false
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    credentials,
    body: body ? JSON.stringify(body) : undefined
  };

  try {
    const response = await fetch(`/api${path}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle 401 Unauthorized (token expired or invalid)
      if (response.status === 401) {
        if (!silent) {
          toast.error('Your session has expired. Please sign in again.');
        }
        // Redirect to sign-in with current path as callback
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        goto(`/auth/signin?callbackUrl=${callbackUrl}`);
        throw new Error('Unauthorized');
      }

      // Handle other errors
      const errorMessage = data.message || 'An error occurred';
      if (!silent) {
        toast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }

    return data as R;
  } catch (error) {
    if (!silent && error instanceof Error) {
      toast.error(error.message || 'An unexpected error occurred');
    }
    throw error;
  }
}

/**
 * Make a GET request
 * @param path The API endpoint path
 * @param options Request options
 * @returns The response data
 */
export async function get<T = unknown>(
  path: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return api<T, T>(path, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 * @param path The API endpoint path
 * @param body The request body
 * @param options Request options
 * @returns The response data
 */
export async function post<T = unknown, R = unknown>(
  path: string,
  body: T,
  options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>
): Promise<R> {
  return api<T, R>(path, { ...options, method: 'POST', body });
}

/**
 * Make a PUT request
 * @param path The API endpoint path
 * @param body The request body
 * @param options Request options
 * @returns The response data
 */
export async function put<T = unknown, R = unknown>(
  path: string,
  body: T,
  options?: Omit<ApiRequestOptions<T>, 'method' | 'body'>
): Promise<R> {
  return api<T, R>(path, { ...options, method: 'PUT', body });
}

/**
 * Make a PATCH request
 * @param path The API endpoint path
 * @param body The request body
 * @param options Request options
 * @returns The response data
 */
export async function patch<T = unknown, R = unknown>(
  path: string,
  body: Partial<T>,
  options?: Omit<ApiRequestOptions<Partial<T>>, 'method' | 'body'>
): Promise<R> {
  return api<Partial<T>, R>(path, { ...options, method: 'PATCH', body });
}

/**
 * Make a DELETE request
 * @param path The API endpoint path
 * @param options Request options
 * @returns The response data
 */
export async function del<T = void>(
  path: string,
  options?: Omit<ApiRequestOptions, 'method'>
): Promise<T> {
  return api<never, T>(path, { ...options, method: 'DELETE' });
}
