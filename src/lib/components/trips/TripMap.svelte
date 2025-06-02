<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { Destination } from '$lib/types/trip';
  import { safeFormatDateRange } from '$lib/utils/date';
  
  // Props
  export let destinations: Destination[] = [];
  export let height: string = '500px';
  export let autoFit: boolean = true;
  export let showRoutes: boolean = true;
  
  // Map state
  let map: any = $state(null);
  let mapElement: HTMLDivElement;
  let markers: any[] = $state([]);
  let routeLines: any[] = $state([]);
  let routeArrows: any[] = $state([]);
  let mapInitialized = $state(false);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let destinationCoordinates: any[] = $state([]);
  let L: any;
  
  // Lifecycle
  onMount(async () => {
    if (browser) {
      await initializeMap();
    }
  });
  
  onDestroy(() => {
    if (map) {
      // Clean up map resources
      markers.forEach(marker => marker.remove());
      routeLines.forEach(line => line.remove());
      routeArrows.forEach(arrow => arrow.remove());
      map.remove();
      map = null;
    }
  });
  
  // Watch for changes in destinations
  $effect(() => {
    if (map && destinations.length > 0) {
      updateMapMarkers();
    }
  });
  
  // Initialize map
  async function initializeMap() {
    if (!browser || mapInitialized) return;
    
    try {
      isLoading = true;
      error = null;
      
      // Dynamically import Leaflet to reduce initial bundle size
      const leaflet = await import('leaflet');
      L = leaflet;
      
      // Create map with error handling
      try {
        map = L.map(mapElement).setView([0, 0], 2);
      } catch (e) {
        console.error('Error creating map:', e);
        error = 'Failed to create map. Please refresh the page.';
        isLoading = false;
        return;
      }
      
      // Add tile layer with error handling
      try {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          // Add tile loading error handling
          errorTileUrl: 'https://via.placeholder.com/256x256?text=Map+Tile+Error'
        }).addTo(map);
      } catch (e) {
        console.error('Error adding tile layer:', e);
        error = 'Failed to load map tiles. Please check your internet connection.';
        isLoading = false;
        return;
      }
      
      // Initialize arrays
      markers = [];
      routeLines = [];
      routeArrows = [];
      destinationCoordinates = [];
      
      // Update map markers
      await updateMapMarkers();
      
      // Set map as initialized
      mapInitialized = true;
    } catch (e) {
      console.error('Error initializing map:', e);
      error = 'Failed to initialize map. Please refresh the page.';
    } finally {
      isLoading = false;
    }
  }
  
  // Update map markers with destinations
  async function updateMapMarkers() {
    if (!map || !browser || !L) return;
    
    try {
      isLoading = true;
      error = null;
      
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      markers = [];
      
      // Clear existing route lines
      routeLines.forEach(line => line.remove());
      routeLines = [];
      
      // Clear existing route arrows
      routeArrows.forEach(arrow => arrow.remove());
      routeArrows = [];
      
      // Clear destination coordinates
      destinationCoordinates = [];
      
      // Geocode destinations
      await geocodeDestinations();
      
      // Draw route lines if enabled
      if (showRoutes) {
        drawRouteLines();
      }
      
      // Fit map to bounds if markers exist and autoFit is enabled
      if (markers.length > 0 && autoFit) {
        const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (e) {
      console.error("Error updating map markers:", e);
      error = 'Failed to update map markers. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  // Geocode destinations
  async function geocodeDestinations() {
    try {
      // Process each destination
      for (const dest of destinations) {
        if (dest['latitude'] && dest['longitude']) {
          // Create marker with proper error handling
          try {
            const marker = L.marker([dest['latitude'], dest['longitude']], {
              title: dest['name'],
              alt: dest['name']
            }).addTo(map);
            
            // Add popup with sanitized content
            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${L.Util.escapeHtml(dest['name'] || '')}</h3>
                <p>${L.Util.escapeHtml(dest['address'] || '')}</p>
                <p class="text-sm">${safeFormatDateRange(dest['startDate'], dest['endDate'])}</p>
              </div>
            `);
            
            // Store marker
            markers.push(marker);
            
            // Store coordinates for route drawing
            destinationCoordinates.push({
              ['id']: dest['id'],
              ['name']: dest['name'],
              ['latlng']: [dest['latitude'], dest['longitude']],
              ['startDate']: dest['startDate'] instanceof Date ? dest['startDate'] : new Date(String(dest['startDate'] || new Date()))
            });
          } catch (e) {
            console.error(`Error creating marker for destination ${dest['name']}:`, e);
            // Continue with other destinations
          }
        } else if (dest['address']) {
          // Mock geocoding (in a real app, use a geocoding service)
          // In production, you would use a real geocoding service here
          const randomLat = 40 + Math.random() * 10 - 5;
          const randomLng = -95 + Math.random() * 10 - 5;
          
          try {
            // Create marker
            const marker = L.marker([randomLat, randomLng], {
              title: dest['name'],
              alt: dest['name']
            }).addTo(map);
            
            // Add popup
            marker.bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${L.Util.escapeHtml(dest['name'] || '')}</h3>
                <p>${L.Util.escapeHtml(dest['address'] || '')}</p>
                <p class="text-sm">${safeFormatDateRange(dest['startDate'], dest['endDate'])}</p>
                <p class="text-xs text-muted-foreground">(Geocoding mocked for demo)</p>
              </div>
            `);
            
            // Store marker
            markers.push(marker);
            
            // Store coordinates for route drawing
            destinationCoordinates.push({
              ['id']: dest['id'],
              ['name']: dest['name'],
              ['latlng']: [randomLat, randomLng],
              ['startDate']: dest['startDate'] instanceof Date ? dest['startDate'] : new Date(String(dest['startDate'] || new Date()))
            });
          } catch (e) {
            console.error(`Error creating mock marker for destination ${dest['name']}:`, e);
            // Continue with other destinations
          }
        }
      }
    } catch (e) {
      console.error('Error in geocodeDestinations:', e);
      throw e; // Re-throw to be caught by the caller
    }
  }
  
  // Draw route lines between destinations
  function drawRouteLines() {
    if (!map || !L || destinationCoordinates.length < 2) return;
    
    try {
      // Sort destinations by start date
      const sortedDestinations = [...destinationCoordinates].sort((a, b) => {
        return new Date(a['startDate']).getTime() - new Date(b['startDate']).getTime();
      });
      
      // Draw lines between consecutive destinations
      for (let i = 0; i < sortedDestinations.length - 1; i++) {
        const from = sortedDestinations[i]['latlng'];
        const to = sortedDestinations[i + 1]['latlng'];
        
        if (!from || !to) continue;
        
        try {
          // Create polyline
          const line = L.polyline([from, to], {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1
          }).addTo(map);
          
          // Store line
          routeLines.push(line);
          
          // Add arrow decoration
          try {
            const arrow = L.polylineDecorator(line, {
              patterns: [
                {
                  offset: '50%',
                  repeat: 0,
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 15,
                    polygon: false,
                    pathOptions: {
                      color: '#3b82f6',
                      weight: 3,
                      opacity: 0.7
                    }
                  })
                }
              ]
            }).addTo(map);
            
            // Store arrow
            routeArrows.push(arrow);
          } catch (e) {
            console.error('Error adding arrow decoration:', e);
            // Continue without arrow decoration
          }
        } catch (e) {
          console.error(`Error creating route line from ${sortedDestinations[i]['name']} to ${sortedDestinations[i+1]['name']}:`, e);
          // Continue with other routes
        }
      }
    } catch (e) {
      console.error('Error in drawRouteLines:', e);
      // Don't throw, just log the error
    }
  }
  
  // Public methods that can be called from parent
  export function refreshMap() {
    if (map && browser) {
      updateMapMarkers();
    }
  }
  
  export function fitBounds() {
    if (map && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  
  export function centerOnDestination(destinationId: string) {
    if (!map) return;
    
    const destination = destinationCoordinates.find(d => d['id'] === destinationId);
    if (destination && destination['latlng']) {
      map.setView(destination['latlng'], 13);
    }
  }
</script>

<div class="relative w-full" style:height={height}>
  {#if error}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
      <div class="text-center p-4">
        <p class="text-red-500 mb-2">{error}</p>
        <button 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
          on:click={() => initializeMap()}
        >
          Retry
        </button>
      </div>
    </div>
  {/if}
  
  {#if isLoading && !mapInitialized}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading map...</p>
      </div>
    </div>
  {/if}
  
  <div bind:this={mapElement} class="w-full h-full rounded-md"></div>
</div>
