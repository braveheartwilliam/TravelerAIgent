<script lang="ts">
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Card, CardContent, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Calendar, Plane, AlertCircle, RefreshCw, DollarSign, Plus } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Trip as DBTrip } from '$lib/server/schema';
  
  // Navigation helper
  function navigateTo(path: string) {
    goto(path);
  }
  
  // Handle button clicks
  function handleButtonClick(action: string, tripId?: string) {
    switch (action) {
      case 'createTrip':
        navigateTo('/trips/new');
        break;
      case 'explore':
        navigateTo('/explore');
        break;
      case 'viewTripDetails':
        if (tripId) {
          navigateTo(`/trips/${tripId}`);
        }
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  // Define the User interface to match our database schema
  interface User {
    id: number;
    userName: string;
    email: string;
    fullName?: string | null;
    role: 'user' | 'admin' | null;
    is_active: boolean | null;
    createdAt: string;
    updatedAt: string;
  }

  // Define the Trip interface to match our database schema
  interface Trip {
    id: number;
    user_id: number;
    destination: string;
    description?: string | null;
    start_date: string | Date;
    end_date: string | Date;
    budget?: string | null;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    created_at: string | Date;
    updated_at: string | Date;
  }

  // Get page data using $props() in Svelte 5
  const { data } = $props<{ data: PageData }>();
  
  // Debug log the incoming data
  $effect(() => {
    try {
      if (data) {
        const getCircularReplacer = () => {
          const seen = new WeakSet();
          return (key: string, value: any) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]';
              }
              seen.add(value);
            }
            return value;
          };
        };
        
        console.log('Page data received:', JSON.parse(JSON.stringify(data, getCircularReplacer())));
      } else {
        console.log('No page data received');
      }
    } catch (err) {
      console.error('Error logging page data:', err);
    }
  });
  
  // State management with $state
  let userData = $state<User | null>(null);
  let userTrips = $state<Trip[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Initialize state when data is available
  $effect(() => {
    if (!data) {
      console.error('No data received from server');
      error = 'No data received from server';
      isLoading = false;
      return;
    }

    console.log('Initializing with data:', data);
    
    try {
      // Validate user data
      if (!data.user || typeof data.user !== 'object') {
        throw new Error('Invalid user data received');
      }
      
      // Ensure required fields are present
      if (!data.user.id || !data.user.email) {
        throw new Error('Incomplete user data received');
      }
      
      userData = {
        id: Number(data.user.id),
        email: data.user.email || '',
        userName: data.user.userName || data.user.email.split('@')[0],
        fullName: data.user.fullName || null,
        role: (data.user.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin' | null,
        is_active: Boolean(data.user.is_active),
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: data.user.updatedAt || new Date().toISOString()
      };
      
      // Validate and set trips
      userTrips = Array.isArray(data.trips) 
        ? data.trips.map((trip: DBTrip) => ({
            ...trip,
            start_date: new Date(trip.start_date),
            end_date: new Date(trip.end_date),
            created_at: new Date(trip.created_at || new Date()),
            updated_at: new Date(trip.updated_at || new Date()),
            // Add any other required fields with default values
            id: trip.id || 0,
            user_id: trip.user_id || 0,
            destination: trip.destination || '',
            description: trip.description || null,
            budget: trip.budget || null,
            status: trip.status || 'planned'
          }))
        : [];
      
      isLoading = false;
      error = null;
      
    } catch (err) {
      console.error('Error initializing dashboard data:', err);
      error = err instanceof Error ? err.message : 'Failed to load dashboard data';
      isLoading = false;
    }
  });
  
  // Computed values
  const hasUserData = $derived(Boolean(userData && userData.id));
  const hasTrips = $derived(userTrips.length > 0);
  
  // Format date for display
  function formatDate(dateString?: string | Date | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid date' 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
  }
  
  // Format currency
  function formatCurrency(amount?: string | null): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  }
  
  // Get user's display name
  function getDisplayName(user: User): string {
    return user.fullName || user.userName || 'Traveler';
  }
  
  // Initialize component
  onMount(() => {
    try {
      console.log('Dashboard mounted with data:', { userData, userTrips });
    } catch (err) {
      console.error('Error in dashboard onMount:', err);
      error = 'Failed to initialize dashboard';
    } finally {
      isLoading = false;
    }
  });
</script>

<main class="container mx-auto px-4 py-8">
  {#if !hasUserData}
    <div class="text-center py-16">
      <AlertCircle class="mx-auto h-12 w-12 text-yellow-500 mb-4" />
      <h3 class="text-2xl font-bold mb-2">Welcome to TravelerAIgent</h3>
      <p class="text-muted-foreground max-w-2xl mx-auto mb-6">
        We're having trouble loading your dashboard. Please sign in to continue planning your next adventure.
      </p>
      <div class="flex gap-4 justify-center">
        <Button on:click={() => navigateTo('/auth/signin')}>
          Sign In
        </Button>
        <Button on:click={() => window.location.reload()} variant="outline">
          <RefreshCw class="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  {:else if isLoading}
    <div class="flex flex-col items-center justify-center h-64 space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p class="text-muted-foreground">Loading your dashboard...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <AlertCircle class="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 class="text-lg font-medium mb-2">Error Loading Dashboard</h3>
      <p class="text-muted-foreground mb-4">{error}</p>
      <Button onclick={() => window.location.reload()} variant="outline">
        <RefreshCw class="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  {:else if userData}
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">
            Welcome back, {getDisplayName(userData)}!
          </h1>
          <p class="text-muted-foreground">
            Here's what's happening with your trips.
          </p>
        </div>
        <Button on:click={() => navigateTo('/trips/new')}>
          <Plus class="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      <!-- Upcoming Trips -->
      <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-6">Upcoming Trips</h2>
        {#if !hasTrips}
          <Card>
            <CardContent class="p-8 text-center">
              <Plane class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 class="text-lg font-medium mb-2">No upcoming trips</h3>
              <p class="text-muted-foreground mb-4">
                You don't have any trips planned yet. Start by creating a new trip!
              </p>
              <Button on:click={() => navigateTo('/trips/new')}>
                <Plus class="mr-2 h-4 w-4" />
                Create Trip
              </Button>
            </CardContent>
          </Card>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each userTrips as trip}
              <Card class="hover:shadow-md transition-shadow">
                <CardContent class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold">{trip.destination}</h3>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {trip.status?.replace('_', ' ').toUpperCase() || 'PLANNED'}
                    </span>
                  </div>
                  
                  <div class="space-y-3 text-sm">
                    <div class="flex items-center text-muted-foreground">
                      <Calendar class="mr-2 h-4 w-4" />
                      <span>
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </span>
                    </div>
                    
                    {#if trip.budget}
                      <div class="flex items-center text-muted-foreground">
                        <DollarSign class="mr-2 h-4 w-4" />
                        <span>{formatCurrency(trip.budget)}</span>
                      </div>
                    {/if}
                    
                    {#if trip.description}
                      <p class="mt-2 text-muted-foreground line-clamp-2">
                        {trip.description}
                      </p>
                    {/if}
                  </div>
                  
                  <div class="mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      on:click={() => handleButtonClick('viewTripDetails', trip.id.toString())}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Recent Activity -->
      <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-6">Recent Activity</h2>
        <Card>
          <CardContent class="p-6">
            {#if hasTrips}
              <div class="space-y-4">
                {#each userTrips.slice(0, 3) as trip}
                  <div class="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plane class="h-5 w-5 text-primary" />
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium">
                        Added trip to {trip.destination}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {formatDate(trip.created_at)}
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <p class="text-muted-foreground">No recent activity to show</p>
              </div>
            {/if}
          </CardContent>
        </Card>
      </div>
    </div>
  {/if}
</main>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Ensure line clamping works in all browsers */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
  
  /* Animation for the loading spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Responsive padding */
  @media (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
