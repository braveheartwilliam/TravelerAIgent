/**
 * TanStack Query hooks
 * Provides reusable query and mutation hooks for common data fetching patterns
 */

import { 
  createQuery, 
  createMutation,
  type CreateQueryOptions,
  type CreateMutationOptions
} from '@tanstack/svelte-query';
import { apiFetch, createQueryKey, type QueryKeys } from './query';
import { toast } from 'svelte-sonner';

/**
 * Create a query for fetching a single item by ID
 * @param entityType Entity type (e.g., 'trips', 'destinations')
 * @param id Entity ID
 * @param options Additional query options
 * @returns Query result
 */
export function createEntityQuery<TData>(
  entityType: string,
  id: string | number,
  options?: Partial<CreateQueryOptions<TData, Error, TData, QueryKeys>>
) {
  return createQuery<TData, Error, TData, QueryKeys>({
    queryKey: createQueryKey([entityType as any, id]),
    queryFn: () => apiFetch<TData>(`/${entityType}/${id}`),
    ...options
  });
}

/**
 * Create a query for fetching a list of items
 * @param entityType Entity type (e.g., 'trips', 'destinations')
 * @param params Query parameters
 * @param options Additional query options
 * @returns Query result
 */
export function createEntityListQuery<TData>(
  entityType: string,
  params?: Record<string, any>,
  options?: Partial<CreateQueryOptions<TData, Error, TData, QueryKeys>>
) {
  // Build query string from params
  const queryString = params 
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString()}`
    : '';
  
  return createQuery<TData, Error, TData, QueryKeys>({
    queryKey: createQueryKey([entityType as any, 'list', params || {}] as any),
    queryFn: () => apiFetch<TData>(`/${entityType}${queryString}`),
    ...options
  });
}

/**
 * Create a mutation for creating a new entity
 * @param entityType Entity type (e.g., 'trips', 'destinations')
 * @param options Additional mutation options
 * @returns Mutation result
 */
export function createEntityMutation<TData, TVariables>(
  entityType: string,
  options?: Partial<CreateMutationOptions<TData, Error, TVariables>>
) {
  return createMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => 
      apiFetch<TData>(`/${entityType}`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: (data, variables, context) => {
      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1, -1)} created successfully`);
      options?.onSuccess?.(data, variables, context);
    },
    ...options
  });
}

/**
 * Create a mutation for updating an existing entity
 * @param entityType Entity type (e.g., 'trips', 'destinations')
 * @param id Entity ID
 * @param options Additional mutation options
 * @returns Mutation result
 */
export function createEntityUpdateMutation<TData, TVariables>(
  entityType: string,
  id: string | number,
  options?: Partial<CreateMutationOptions<TData, Error, TVariables>>
) {
  return createMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => 
      apiFetch<TData>(`/${entityType}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: (data, variables, context) => {
      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1, -1)} updated successfully`);
      options?.onSuccess?.(data, variables, context);
    },
    ...options
  });
}

/**
 * Create a mutation for deleting an entity
 * @param entityType Entity type (e.g., 'trips', 'destinations')
 * @param id Entity ID
 * @param options Additional mutation options
 * @returns Mutation result
 */
export function createEntityDeleteMutation<TData>(
  entityType: string,
  id: string | number,
  options?: Partial<CreateMutationOptions<TData, Error, void>>
) {
  return createMutation<TData, Error, void>({
    mutationFn: () => 
      apiFetch<TData>(`/${entityType}/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: (data, variables, context) => {
      toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1, -1)} deleted successfully`);
      options?.onSuccess?.(data, variables, context);
    },
    ...options
  });
}

/**
 * Create a session query hook
 * @param options Additional query options
 * @returns Query result for the current session
 */
export function createSessionQuery<TData>(
  options?: Partial<CreateQueryOptions<TData, Error, TData, QueryKeys>>
) {
  return createQuery<TData, Error, TData, QueryKeys>({
    queryKey: createQueryKey(['auth', 'session']),
    queryFn: () => apiFetch<TData>('/auth/session'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

/**
 * Create a user profile query hook
 * @param options Additional query options
 * @returns Query result for the current user profile
 */
export function createUserProfileQuery<TData>(
  options?: Partial<CreateQueryOptions<TData, Error, TData, QueryKeys>>
) {
  return createQuery<TData, Error, TData, QueryKeys>({
    queryKey: createQueryKey(['auth', 'user']),
    queryFn: () => apiFetch<TData>('/auth/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}
