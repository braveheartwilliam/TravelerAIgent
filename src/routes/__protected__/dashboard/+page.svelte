<script lang="ts">
  import { page } from '$app/stores';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Calendar, Clock, MapPin, Plane, Wallet, Camera, Building } from 'lucide-svelte';
  
  // Define types for TypeScript
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
  }
  
  interface Trip {
    id: number;
    destination: string;
    date: string;
    duration: string;
    image: string;
  }
  
  // Get user from page data with proper typing
  const user = $derived(($page.data?.user || $page.data?.session?.user) as User | undefined);
  
  // Format date for display
  function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  }
  
  // Sample upcoming trips data
  const upcomingTrips: Trip[] = [
    {
      id: 1,
      destination: 'Bali, Indonesia',
      date: '2023-12-15',
      duration: '7 days',
      image: '/placeholder.svg?height=200&width=350&text=Bali'
    },
    {
      id: 2,
      destination: 'Kyoto, Japan',
      date: '2024-03-22',
      duration: '10 days',
      image: '/placeholder.svg?height=200&width=350&text=Kyoto'
    }
  ];
  
  // Sample recent activity
  const recentActivity = [
    { id: 1, type: 'trip', title: 'Trip to Bali', date: '2023-11-20' },
    { id: 2, type: 'photo', title: 'Added new photo', date: '2023-11-18' },
    { id: 3, type: 'accommodation', title: 'Booked hotel', date: '2023-11-15' }
  ];
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        Welcome back, {user?.name || (user?.email ? user.email.split('@')[0] : 'Traveler')}!
      </h1>
      <p class="text-muted-foreground">Here's what's happening with your trips.</p>
    </div>
    <Button size="lg">
      <Plane class="mr-2 h-4 w-4" />
      New Trip
    </Button>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    <Card class="col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Trips</CardTitle>
        <CardDescription>Your upcoming adventures around the world.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each upcomingTrips as trip (trip.id)}
            <div class="flex items-center space-x-4 rounded-lg border p-4">
              <img
                src={trip.image}
                alt={trip.destination}
                class="h-16 w-16 rounded-md object-cover"
              />
              <div class="flex-1">
                <h3 class="font-medium">{trip.destination}</h3>
                <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar class="h-4 w-4" />
                  <span>{formatDate(trip.date)}</span>
                  <span>•</span>
                  <Clock class="h-4 w-4" />
                  <span>{trip.duration}</span>
                </div>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>

    <Card class="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest travel updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each recentActivity as item (item.id)}
            <div class="flex items-start space-x-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                {#if item.type === 'trip'}
                  <Plane class="h-4 w-4 text-primary" />
                {:else if item.type === 'photo'}
                  <Camera class="h-4 w-4 text-primary" />
                {:else if item.type === 'accommodation'}
                  <Building class="h-4 w-4 text-primary" />
                {/if}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{item.title}</p>
                <p class="text-xs text-muted-foreground">{formatDate(item.date)}</p>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>

  <div class="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Destinations</CardTitle>
        <CardDescription>Places you've visited</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">12</div>
        <p class="text-xs text-muted-foreground">+2 from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Trips</CardTitle>
        <CardDescription>Total trips planned</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">5</div>
        <p class="text-xs text-muted-foreground">+1 from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Memories</CardTitle>
        <CardDescription>Photos and moments</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">47</div>
        <p class="text-xs text-muted-foreground">+12 from last month</p>
      </CardContent>
    </Card>
  </div>
</div>
