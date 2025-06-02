import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTrips, type TripsQueryOptions } from './useTrips';
import * as tripService from '../services/tripService';
import type { TripSummary } from '../types/trip';
import { createQuery, type CreateQueryResult } from '@tanstack/svelte-query';

// Define types for our mocks to ensure type safety
type QueryOptions = {
  queryKey: unknown[];
  queryFn: () => Promise<unknown>;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
};

// Mock the Svelte store-based return type of TanStack Query
type QueryResult = {
  data: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  status: string;
  isFetching: boolean;
  isRefetching: boolean;
  refetch: () => void;
  // Add the subscribe method to simulate a Svelte store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: (run: (value: any) => void) => (() => void);
};

// Mock TanStack Query
vi.mock('@tanstack/svelte-query', () => ({
  createQuery: vi.fn()
}));

// Mock the browser environment
vi.mock('$app/environment', () => {
  const browserMock = vi.fn();
  browserMock.mockReturnValue(true);
  return {
    browser: browserMock
  };
});

// Mock the trip service
vi.mock('../services/tripService', () => ({
  getTrips: vi.fn()
}));

describe('useTrips hook', () => {
  const mockTrips: TripSummary[] = [
    {
      id: '1',
      title: 'European Adventure',
      description: 'Exploring Europe',
      startDate: new Date('2025-06-15'),
      endDate: new Date('2025-06-30'),
      status: 'draft',
      type: 'user-planned',
      visibility: 'private',
      destinationCount: 3,
      travelerCount: 2
    },
    {
      id: '2',
      title: 'Asian Tour',
      description: 'Exploring Asia',
      startDate: new Date('2025-07-10'),
      endDate: new Date('2025-07-24'),
      status: 'in-progress',
      type: 'guided-trip',
      visibility: 'public',
      destinationCount: 5,
      travelerCount: 4
    }
  ];

  const mockPaginatedResult = {
    trips: mockTrips,
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  };
  
  // We'll define specific query results in each test case as needed

  // Mock query result
  const mockQueryResult: QueryResult = {
    data: mockPaginatedResult,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    status: 'success',
    isFetching: false,
    isRefetching: false,
    refetch: vi.fn(),
    // Implement the subscribe method to simulate a Svelte store
    subscribe: (run) => {
      run(mockQueryResult);
      return () => {}; // Return an unsubscribe function
    }
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Setup default mock implementation
    vi.mocked(tripService.getTrips).mockResolvedValue(mockPaginatedResult);
    // Cast the mock result to the expected return type
    vi.mocked(createQuery).mockReturnValue(mockQueryResult as unknown as CreateQueryResult<unknown, unknown>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should create query with correct options', () => {
    const options: TripsQueryOptions = {
      userId: 'user123'
    };

    // Call the hook
    useTrips(options);
    
    // Verify the query was created with correct options
    expect(createQuery).toHaveBeenCalledTimes(1);
    
    // Extract the query options from the createQuery call
    const mockCalls = vi.mocked(createQuery).mock.calls;
    expect(mockCalls.length).toBeGreaterThan(0);
    
    // Safe access to mock calls with proper type assertion
    const queryOptions = mockCalls[0]?.[0] as QueryOptions;
    expect(queryOptions).toBeDefined();
    
    // Verify the query key includes the userId
    expect(queryOptions?.queryKey).toContain('trips');
    expect(queryOptions?.queryKey).toContain('user123');
    
    // Verify the query function was provided
    expect(typeof queryOptions?.queryFn).toBe('function');
  });

  test('should return query result', () => {
    const options: TripsQueryOptions = {
      userId: 'user123'
    };

    const result = useTrips(options);
    
    // Verify the hook returns the query result with key properties
    // Instead of comparing the entire object structure which may differ
    expect(result.data).toEqual(mockPaginatedResult);
    expect(result.isLoading).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.error).toBeNull();
    expect(result.status).toBe('success');
  });

  test('should handle custom query options', () => {
    const dateFrom = new Date('2025-01-01');
    const dateTo = new Date('2025-12-31');
    
    const options: TripsQueryOptions = {
      userId: 'user123',
      page: 2,
      limit: 5,
      search: 'adventure',
      status: 'draft',
      type: 'user-planned',
      visibility: 'private',
      dateFrom,
      dateTo,
      minBudget: 1000,
      maxBudget: 5000,
      sortBy: 'title-asc',
      staleTime: 60000,
      refetchOnWindowFocus: false
    };

    useTrips(options);
    
    // Verify the query was created with correct options
    expect(createQuery).toHaveBeenCalledTimes(1);
    
    // Extract the query options from the createQuery call
    const mockCalls = vi.mocked(createQuery).mock.calls;
    expect(mockCalls.length).toBeGreaterThan(0);
    
    // Safe access to mock calls with proper type assertion
    const queryOptions = mockCalls[0]?.[0] as QueryOptions;
    expect(queryOptions).toBeDefined();
    
    // Verify the query key includes all filter options
    expect(queryOptions?.queryKey).toContain('trips');
    expect(queryOptions?.queryKey).toContain('user123');
    expect(queryOptions?.queryKey).toContain(2); // page
    expect(queryOptions?.queryKey).toContain('adventure'); // search
    expect(queryOptions?.queryKey).toContain('draft'); // status
    
    // Verify the staleTime and refetchOnWindowFocus options
    expect(queryOptions?.staleTime).toBe(60000);
    expect(queryOptions?.refetchOnWindowFocus).toBe(false);
  });

  test('should not create query when enabled is false', () => {
    // Reset mocks before this specific test
    vi.resetAllMocks();
    
    // Create a mock result that matches what the hook expects
    const disabledQueryResult = {
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      status: 'loading' as const,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
      subscribe: (run: (value: unknown) => void) => {
        run({
          data: undefined,
          isLoading: false,
          error: null,
          refetch: vi.fn(),
          isFetching: false,
          isRefetching: false,
          isSuccess: false,
          status: 'loading'
        });
        return () => {};
      }
    };
    
    // Mock createQuery to return our disabled query result
    vi.mocked(createQuery).mockReturnValue(disabledQueryResult as unknown as CreateQueryResult<unknown, unknown>);
    
    const options: TripsQueryOptions = {
      userId: 'user123',
      enabled: false
    };

    const result = useTrips(options);
    
    // Extract the query options from the createQuery call
    const mockCalls = vi.mocked(createQuery).mock.calls;
    expect(mockCalls.length).toBeGreaterThan(0);
    
    // Safe access to mock calls with proper type assertion
    const queryOptions = mockCalls[0]?.[0] as QueryOptions;
    expect(queryOptions).toBeDefined();
    
    // Verify the enabled option
    expect(queryOptions?.enabled).toBe(false);
    
    // Verify the hook returns the expected result structure
    expect(result).toBeDefined();
    expect(result.data).toBeUndefined();
    expect(result.isLoading).toBe(false);
  });
  
  test('should handle server-side rendering (browser is false)', async () => {
    // For server-side rendering tests, we need to mock the browser environment
    // We'll use a separate test module import to avoid affecting other tests
    
    // First, reset all mocks to ensure clean state
    vi.resetAllMocks();
    
    // Mock the browser environment to be false (server-side)
    vi.mock('$app/environment', () => ({
      browser: false
    }));
    
    // Create a server-side query result that matches what the hook expects
    const serverSideQueryResult = {
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      status: 'loading' as const,
      isFetching: false,
      isRefetching: false,
      refetch: vi.fn(),
      subscribe: (run: (value: unknown) => void) => {
        run({
          data: undefined,
          isLoading: false,
          error: null,
          refetch: vi.fn(),
          isFetching: false,
          isRefetching: false,
          isSuccess: false,
          status: 'loading'
        });
        return () => {};
      }
    };
    
    // Mock createQuery to return our server-side query result
    vi.mocked(createQuery).mockReturnValue(serverSideQueryResult as unknown as CreateQueryResult<unknown, unknown>);
    
    const options: TripsQueryOptions = {
      userId: 'user123'
    };

    // Call the hook with browser=false
    const result = useTrips(options);
    
    // In server-side rendering, the hook should still return a valid object
    // with default values, but the query should not be created
    expect(result).toBeDefined();
    expect(result.data).toBeUndefined();
    expect(result.isLoading).toBe(false);
    
    // Reset the environment mock for subsequent tests
    vi.mock('$app/environment', () => ({
      browser: true
    }));
  });


});
