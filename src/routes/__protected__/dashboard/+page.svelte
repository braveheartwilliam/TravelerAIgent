<script lang="ts">
  import { page } from '$app/stores';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  // Using direct SVG for icons due to potential Lucide Svelte version issues
  const Calendar = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  `;
  
  const Clock = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `;
  
  const MapPin = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;
  
  const Plane = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 2L11 13"></path>
      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
    </svg>
  `;
  
  const WalletIcon = () => `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="1" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  `;
  
  // Get user from page data
  const user = $derived($page.data?.session?.user);
  
  // Sample upcoming trips data
  const upcomingTrips = [
    {
      id: 1,
      destination: 'Bali, Indonesia',
      date: '2023-11-15',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      destination: 'Kyoto, Japan',
      date: '2024-03-22',
      duration: '10 days',
      image: 'https://images.unsplash.com/photo-1492571350019-22cd08313268?auto=format&fit=crop&w=800&q=80',
    },
  ];
  
  // Format date
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Traveler'}!</h1>
      <p class="text-muted-foreground">Here's what's happening with your trips.</p>
    </div>
    <Button size="lg">
      <span class="mr-2 h-4 w-4" innerHTML={Plane()} />
      Plan New Trip
    </Button>
  </div>
  
  {/* Stats Cards */}
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Upcoming Trips</CardTitle>
        <span class="h-4 w-4 text-muted-foreground" innerHTML={Calendar()} />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">2</div>
        <p class="text-xs text-muted-foreground">+1 from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Countries Visited</CardTitle>
        <span class="h-4 w-4 text-muted-foreground" innerHTML={MapPin()} />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">12</div>
        <p class="text-xs text-muted-foreground">+2 this year</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Days Traveling</CardTitle>
        <span class="h-4 w-4 text-muted-foreground" innerHTML={Clock()} />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">45</div>
        <p class="text-xs text-muted-foreground">+12 from last year</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Bucket List</CardTitle>
        <span class="h-4 w-4 text-muted-foreground" innerHTML={WalletIcon()} />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">24</div>
        <p class="text-xs text-muted-foreground">+5 this year</p>
      </CardContent>
    </Card>
  </div>
  
  {/* Upcoming Trips */}
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    <Card class="col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Trips</CardTitle>
        <CardDescription>Your upcoming adventures around the world.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each upcomingTrips as trip}
            <div class="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <div class="h-16 w-16 overflow-hidden rounded-md">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="flex-1">
                <h3 class="font-medium">{trip.destination}</h3>
                <div class="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span class="h-3.5 w-3.5" innerHTML={Calendar()} />
                  <span>{formatDate(trip.date)}</span>
                  <span>•</span>
                  <span class="h-3.5 w-3.5" innerHTML={Clock()} />
                  <span>{trip.duration}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
    
    {/* Recent Activity */}
    <Card class="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest travel updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each [
            { id: 1, type: 'trip', action: 'added', title: 'Bali, Indonesia', time: '2 hours ago' },
            { id: 2, type: 'photo', action: 'uploaded', title: 'Kyoto, Japan', time: '1 day ago' },
            { id: 3, type: 'accommodation', action: 'booked', title: 'Luxury Villa in Ubud', time: '3 days ago' },
            { id: 4, type: 'flight', action: 'booked', title: 'SFO to DPS', time: '1 week ago' },
          ] as item}
            <div class="flex items-start space-x-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                {#if item.type === 'trip'}
                  <Plane class="h-4 w-4 text-primary" />
                {:else if item.type === 'photo'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                {:else}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-primary"
                  >
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                  </svg>
                {/if}
              </div>
              <div class="flex-1">
                <p class="text-sm">
                  <span class="font-medium">You</span> {item.action} {item.title}
                </p>
                <p class="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
