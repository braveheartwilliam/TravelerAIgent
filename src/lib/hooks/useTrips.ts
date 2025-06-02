import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';
import { getTrips, type PaginatedTripsResult as ServicePaginatedTripsResult } from '../services/tripService';
import type { TripStatus, TripType, TripVisibility } from '../types/trip';
import { browser } from '$app/environment';
import { error } from '../utils/error';


/**
 * Options for configuring the trips query
 * 
 * @remarks
 * This interface defines all the parameters that can be used to filter, sort, and paginate trips.
 * All parameters except userId are optional and have sensible defaults.
 */
export interface TripsQueryOptions {
  /** User ID to fetch trips for */
  userId: string;
  /** Whether the query should be enabled */
  enabled?: boolean;
  /** Current page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Search query for filtering trips */
  search?: string;
  /** Filter by trip status */
  status?: TripStatus | '';
  /** Filter by trip type */
  type?: TripType | '';
  /** Filter by trip visibility */
  visibility?: TripVisibility | '';
  /** Filter by start date (from) */
  dateFrom?: Date | null;
  /** Filter by end date (to) */
  dateTo?: Date | null;
  /** Filter by minimum budget */
  minBudget?: number;
  /** Filter by maximum budget */
  maxBudget?: number;
  /** Sort order (e.g., 'date-desc', 'name-asc') */
  sortBy?: string;
  /** Stale time in milliseconds (default: 5 minutes) */
  staleTime?: number;
  /** Whether to refetch on window focus */
  refetchOnWindowFocus?: boolean;
}

/**
 * Result of a paginated trips query
 * 
 * @remarks
 * Extends the service result with additional client-side properties such as
 * the timestamp when the data was fetched. This helps with caching and
 * determining if data is stale.
 */
export interface PaginatedTripsResult extends ServicePaginatedTripsResult {
  /** Timestamp when the data was fetched */
  fetchedAt?: number;
}

/**
 * Result type for the useTrips hook
 */
export interface TripsQueryResult {
  /** Paginated trips data */
  data: PaginatedTripsResult | undefined;
  /** Whether the initial data is loading */
  isLoading: boolean;
  /** Error if the query failed */
  error: Error | null;
  /** Function to manually refetch data */
  refetch: () => Promise<unknown>;
  /** Whether the query is currently fetching (initial or background) */
  isFetching: boolean;
  /** Whether the data is stale and being refetched */
  isRefetching: boolean;
  /** Whether the query was successful */
  isSuccess: boolean;
  /** Status of the query */
  status: 'loading' | 'error' | 'success';
}

/**
 * Hook for fetching trips with TanStack Query
 * 
 * @remarks
 * This hook provides a comprehensive solution for fetching, caching, and managing trips data.
 * It integrates with TanStack Query to provide proper caching, loading states, and error handling.
 * The hook supports server-side pagination, filtering, and sorting through the tripService.
 * 
 * Key features:
 * - Client-side state management with TanStack Query
 * - Loading, success, and error states
 * - Automatic refetching on window focus (configurable)
 * - Stale time configuration for cache control
 * - Comprehensive filtering options
 * 
 * @param options - Configuration options for the trips query
 * @returns An object containing the query result and state information
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useTrips({
 *   userId: 'user123',
 *   page: 1,
 *   limit: 10,
 *   search: 'europe',
 *   status: 'draft'
 * });
 * ```
 */
export function useTrips(options: TripsQueryOptions): TripsQueryResult {
  // Define a type for our query result that extends both TanStack Query result and our TripsQueryResult
  interface QueryResultWithData extends CreateQueryResult<PaginatedTripsResult, Error>, TripsQueryResult {}
  
  // This ensures the query result has all properties defined in TripsQueryResult
  // while also maintaining compatibility with TanStack Query's CreateQueryResult
  
  const { 
    userId, 
    enabled = true,
    page = 1,
    limit = 9,
    search = '',
    status = '',
    type = '',
    visibility = '',
    dateFrom = null,
    dateTo = null,
    minBudget,
    maxBudget,
    sortBy = 'date-desc',
    staleTime = 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus = true
  } = options;

  // Don't run the query on the server
  const isEnabled = browser && enabled && !!userId;

  // Create a query key that includes all filter parameters
  const queryKey = [
    'trips', 
    userId,
    page,
    limit,
    search,
    status,
    type,
    visibility,
    dateFrom?.toISOString() || null,
    dateTo?.toISOString() || null,
    minBudget,
    maxBudget,
    sortBy
  ];

  // Create the query with proper typing and error handling
  const query = createQuery<PaginatedTripsResult, Error>({
    queryKey,
    queryFn: async (): Promise<PaginatedTripsResult> => {
      try {
        // Call the service function with the query parameters
        const result = await getTrips({
          userId,
          page,
          limit,
          search,
          status,
          type,
          visibility,
          dateFrom,
          dateTo,
          minBudget,
          maxBudget,
          sortBy
        });
        
        // Ensure we're getting a PaginatedTripsResult
        if (!('trips' in result)) {
          throw new Error('Unexpected response format from getTrips');
        }
        
        return {
          ...result,
          fetchedAt: Date.now()
        };
      } catch (err) {
        console.error('Error fetching trips:', err);

        throw error({
          message: 'Failed to load trips. Please try again later.',
          cause: err instanceof Error ? err : new Error(String(err)),
          context: { userId, page, limit }
        });
      }
    },
    enabled: isEnabled,
    staleTime, 
    refetchOnWindowFocus,
    refetchOnMount: true,
    retry: 2,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Cast the query to our extended type and extract the properties we need
  const queryWithData = query as unknown as QueryResultWithData;
  
  // Return the query with the expected structure
  const result: TripsQueryResult = {
    data: queryWithData.data,
    isLoading: queryWithData.isLoading,
    error: queryWithData.error,
    refetch: queryWithData.refetch,
    isFetching: queryWithData.isFetching,
    isRefetching: queryWithData.isRefetching,
    isSuccess: queryWithData.isSuccess,
    status: queryWithData.status
  };
  
  return result;
}
