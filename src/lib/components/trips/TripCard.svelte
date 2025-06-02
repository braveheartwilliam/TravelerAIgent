<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Image } from '$lib/components/ui/image';
  import { CalendarDays, MapPin, Users, Wallet, Clock, Tag, Globe, Lock, Plane, Bed, Activity, Heart, Edit, Trash } from 'lucide-svelte';
  import { Tooltip } from '$lib/components/ui/tooltip';
  import type { TripSummary } from '$lib/types/trip';
  
  // Define props
  const { trip } = $props<{ trip: TripSummary }>();
  
  // Format the date for display
  function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  // Check if a trip is upcoming
  function isUpcoming(date: Date | string): boolean {
    return new Date(date) > new Date();
  }
  
  // Check if a trip is past
  function isPast(date: Date | string): boolean {
    return new Date(date) < new Date();
  }
  
  // Check if a trip is in progress
  function isInProgress(startDate: Date | string, endDate: Date | string): boolean {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  }
  
  // Format the date range
  const dateRange = $derived(`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`);
  
  // Get status badge variant
  function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'draft': return 'secondary';
      case 'in-progress': return 'default';
      case 'completed': return 'secondary'; // Using secondary instead of success which isn't in the type
      case 'cancelled': return 'destructive';
      case 'on-hold': return 'secondary'; // Using secondary instead of warning which isn't in the type
      case 'deleted': return 'outline';
      default: return 'secondary';
    }
  }
  const statusVariant = $derived(getStatusVariant(trip.status));
  
  // Get status display name
  const statusDisplay = $derived(() => {
    switch (trip.status) {
      case 'draft': return 'Draft';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'on-hold': return 'On Hold';
      case 'deleted': return 'Deleted';
      default: return 'Unknown';
    }
  });
  
  // Get trip type display name
  const tripTypeDisplay = $derived(() => {
    switch (trip.type) {
      case 'land-cruise': return 'Land Cruise';
      case 'ship-cruise': return 'Ship Cruise';
      case 'guided-trip': return 'Guided Trip';
      case 'user-planned': return 'Self-Planned';
      default: return 'Trip';
    }
  });
  
  // Calculate trip duration in days
  const tripDuration = $derived(() => {
    if (trip.durationDays) return trip.durationDays;
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });
  
  // Determine trip timing status
  let tripTimingValue = $state<'in-progress' | 'upcoming' | 'past' | 'unknown'>('unknown');
  $effect(() => {
    if (isInProgress(trip.startDate, trip.endDate)) tripTimingValue = 'in-progress';
    else if (isUpcoming(trip.startDate)) tripTimingValue = 'upcoming';
    else if (isPast(trip.endDate)) tripTimingValue = 'past';
    else tripTimingValue = 'unknown';
  });
  
  // Get trip timing display text
  const tripTimingDisplay = $derived((): string => {
    switch (tripTimingValue) {
      case 'in-progress': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      case 'past': return 'Past';
      default: return '';
    }
  });
  
  // Get trip timing badge variant
  let tripTimingVariant = $state<'default' | 'secondary' | 'destructive' | 'outline'>('outline');
  $effect(() => {
    switch (tripTimingValue) {
      case 'in-progress': tripTimingVariant = 'default'; break;
      case 'upcoming': tripTimingVariant = 'secondary'; break;
      case 'past': tripTimingVariant = 'outline'; break;
      default: tripTimingVariant = 'outline';
    }
  });
  
  // Format budget if available
  const budgetDisplay = $derived(() => {
    if (trip.budget) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trip.budget);
    }
    return 'Not specified';
  });
  
  // Get visibility text
  const visibilityText = $derived(trip.visibility === 'public' ? 'Public' : 'Private');
</script>

<Card 
  class="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col relative group"
  data-trip-id={trip?.id ?? ''}
  data-trip-status={trip?.status ?? ''}
  data-trip-type={trip?.type ?? ''}
  data-trip-timing={tripTimingValue}
  tabindex="0"
  aria-label={`${trip?.title ?? ''}: ${tripTypeDisplay} trip, ${statusDisplay}, ${tripDuration} days, from ${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}`}
>
  <div class="relative h-48 w-full">
    {#if trip?.coverImage}
      <Image 
        src={trip.coverImage} 
        alt={`Cover image for ${trip?.title ?? ''}`}
        class="w-full h-full"
        objectFit="cover"
        loading="lazy"
        priority={false}
        fallback={`https://ui-avatars.com/api/?name=${encodeURIComponent(trip.title)}&background=4F46E5&color=fff&size=128`}
      />
    {:else}
      <div class="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
        <span class="text-white text-xl font-bold">{trip.title.substring(0, 2).toUpperCase()}</span>
      </div>
    {/if}
    
    <!-- Status badges -->
    <div class="absolute top-2 right-2 z-10 flex flex-col gap-2">
      <Badge variant={statusVariant}>{statusDisplay}</Badge>
      {#if tripTimingDisplay}
        <Badge variant={tripTimingVariant}>{tripTimingDisplay}</Badge>
      {/if}
    </div>
    
    <!-- Visibility badge -->
    <div class="absolute top-2 left-2 z-10">
      <Badge variant="outline" class="bg-white/80 backdrop-blur-sm">
        {#if trip.visibility === 'public'}
          <Globe class="h-3 w-3 mr-1" />
        {:else}
          <Lock class="h-3 w-3 mr-1" />
        {/if}
        {visibilityText}
      </Badge>
    </div>
    
    <!-- Quick action buttons (visible on hover) -->
    <div class="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
      <Tooltip text="Edit trip">
        <Button variant="secondary" size="icon" class="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white">
          <Edit class="h-4 w-4" />
        </Button>
      </Tooltip>
      <Tooltip text="Delete trip">
        <Button variant="destructive" size="icon" class="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-destructive">
          <Trash class="h-4 w-4" />
        </Button>
      </Tooltip>
    </div>
  </div>
  
  <CardHeader class="pb-2">
    <div class="flex justify-between items-start">
      <div>
        <CardTitle class="text-xl">{trip?.title ?? ''}</CardTitle>
        <CardDescription class="line-clamp-2">{trip?.description ?? 'No description provided'}</CardDescription>
      </div>
    </div>
  </CardHeader>
  
  <CardContent class="flex-grow">
    <div class="space-y-4">
      <!-- Trip type and duration badges -->
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="outline" class="py-1.5 transition-colors hover:bg-secondary/20">
          <Tag class="h-3 w-3 mr-1" />
          {tripTypeDisplay}
        </Badge>
        <Badge variant="outline" class="py-1.5 transition-colors hover:bg-secondary/20">
          <Clock class="h-3 w-3 mr-1" />
          {tripDuration} {Number(tripDuration) === 1 ? 'day' : 'days'}
        </Badge>
      </div>
      
      <!-- Trip details grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 text-sm">
        <!-- Date range -->
        <div class="flex items-center gap-1.5">
          <CalendarDays class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">{dateRange}</span>
        </div>
        
        <!-- Travelers -->
        <div class="flex items-center gap-1.5">
          <Users class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">
            {trip?.travelerCount || 1} {(trip?.travelerCount || 1) === 1 ? 'traveler' : 'travelers'}
          </span>
        </div>
        
        <!-- Destinations -->
        <div class="flex items-center gap-1.5">
          <MapPin class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground truncate" title={trip.mainDestination || `${trip.destinationCount || 0} destinations`}>
            {trip?.mainDestination ?? `${trip?.destinationCount || 0} ${(trip?.destinationCount || 0) === 1 ? 'destination' : 'destinations'}`}
          </span>
        </div>
        
        <!-- Budget -->
        <div class="flex items-center gap-1.5">
          <Wallet class="h-4 w-4 text-muted-foreground" />
          <span class="text-muted-foreground">{budgetDisplay}</span>
        </div>
      </div>
      
      <!-- Trip components summary -->
      <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1 border-t">
        <!-- Transportation -->
        <div class="flex items-center gap-1" title="Transportation">
          <Plane class="h-3.5 w-3.5" />
          <span>{trip?.transportationCount || 0}</span>
        </div>
        
        <!-- Lodging -->
        <div class="flex items-center gap-1" title="Lodging">
          <Bed class="h-3.5 w-3.5" />
          <span>{trip?.lodgingCount || 0}</span>
        </div>
        
        <!-- Activities -->
        <div class="flex items-center gap-1" title="Activities">
          <Activity class="h-3.5 w-3.5" />
          <span>{trip?.activityCount || 0}</span>
        </div>
        
        <!-- Completion percentage if in progress -->
        {#if trip.status === 'in-progress' && trip.completionPercentage !== undefined}
          <div class="ml-auto flex items-center gap-1" title="Completion percentage">
            <Heart class="h-3.5 w-3.5" />
            <span>{trip?.completionPercentage ?? 0}%</span>
          </div>
        {/if}
      </div>
    </div>
  </CardContent>
  
  <CardFooter class="pt-2">
    <Button 
      variant="default" 
      size="sm" 
      class="w-full transition-all hover:shadow-md"
      aria-label={`View details for ${trip?.title ?? ''}`}
    >
      View Details
    </Button>
  </CardFooter>
</Card>
