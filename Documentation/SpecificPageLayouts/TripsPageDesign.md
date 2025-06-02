# Trips Page Design

This document outlines the design specifications for the Trips page in the TravelerAIgent application, following our established design system and UI standards. This is a living document that will evolve as the Trips functionality is further defined and refined.

## 1. Visual References

### Required Assets
- [ ] Trip card background images (destination photos)
- [ ] Trip status icons (draft, in progress, completed, cancelled, on hold)
- [ ] Trip type icons (land cruise, ship cruise, guided trip, user planned trip)
- [ ] Add new trip button icon (+)
- [ ] Filter/sort icons

### Layout Structure
```
[Header]
- Logo (left)
- "My Trips" title (center)
- User menu (right)

[Filter/Sort Bar]
- Search input (left)
- Filter dropdown (center)
- Sort dropdown (right)
- View toggle (grid/list) (far right)

[Trips Grid/List]
- Trip cards in 3-column grid (desktop)
- Trip cards in 2-column grid (tablet)
- Trip cards in 1-column list (mobile)

[Add New Trip]
- Floating action button (bottom right)

[Footer]
- Standard application footer
```

### Color Scheme
- Primary: `hsl(222.2 47.4% 11.2%)` - Deep blue for headers and primary actions
- Secondary: `hsl(210 40% 96.1%)` - Light blue for backgrounds and secondary elements
- Accent: `hsl(24.6 95% 53.1%)` - Orange for highlights and call-to-action elements
- Background: `hsl(0 0% 100%)` - White for main content areas
- Card Background: `hsl(0 0% 98%)` - Off-white for card backgrounds
- Text Primary: `hsl(222.2 47.4% 11.2%)` - Deep blue for primary text
- Text Secondary: `hsl(215.4 16.3% 46.9%)` - Medium gray for secondary text
- Border: `hsl(214.3 31.8% 91.4%)` - Light gray for borders

> **Note**: All color combinations maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text to meet WCAG AA standards. The primary/accent colors are used consistently for interactive elements to enhance discoverability.

## 2. Component Specifications

### Trip Card
```markdown
## Trip Card
- **States**: Default, Hover, Selected
- **Colors**: 
  - Background: `hsl(0 0% 98%)` (hover: `hsl(210 40% 98%)`)
  - Border: `hsl(214.3 31.8% 91.4%)`
  - Status Badge: Dynamic based on status
    - Draft: `hsl(220 14% 96%)` with `hsl(215 20% 65%)` text
    - In Progress: `hsl(142 76% 96%)` with `hsl(142 72% 29%)` text
    - Completed: `hsl(187 100% 94%)` with `hsl(187 72% 29%)` text
    - Cancelled: `hsl(0 84% 96%)` with `hsl(0 72% 51%)` text
    - On Hold: `hsl(48 96% 89%)` with `hsl(32 94% 44%)` text
- **Dimensions**: 
  - Height: Auto (based on content)
  - Width: 100% of container
  - Aspect ratio: 3:2 for image
- **Border Radius**: `rounded-lg` (0.5rem)
- **Shadow**: `shadow-sm` normal, `shadow-md` on hover
- **Transition**: `transition-all duration-200`
- **Typography**:
  - Trip Name: 18px/1.125rem, Semi-bold, Primary text color
  - Date Range: 14px/0.875rem, Regular, Secondary text color
  - Trip Type: 14px/0.875rem, Medium, Primary text color
  - Description: 14px/0.875rem, Regular, Secondary text color (truncated after 2 lines)

## Trip Card Layout
- Image (top, 3:2 aspect ratio)
- Status Badge (top-right corner, overlaid on image)
- Trip Name (below image, left-aligned)
- Date Range (below trip name, left-aligned)
- Trip Type (below date range, left-aligned)
- Description (below trip type, left-aligned, truncated)
- Budget (bottom-right, bold)
- Destination Count (optional, displayed as small icon with number)
- Traveler Count (optional, displayed as small icon with number)

> **Note**: The Trip Card will adapt to display the most relevant information based on the final data model. Additional fields may be added or removed as the requirements evolve.
```

### Filter/Sort Bar
```markdown
## Filter Bar
- **States**: Default, Active Filter
- **Colors**: 
  - Background: `hsl(210 40% 98%)` 
  - Border: `hsl(214.3 31.8% 91.4%)`
  - Active Filter: `hsl(222.2 47.4% 11.2%)` with white text
- **Padding**: `py-2 px-4`
- **Border Radius**: `rounded-md`
- **Shadow**: `shadow-sm`
- **Components**:
  - Search Input: Full-width on mobile, 40% width on desktop
  - Filter Dropdown: Shows options for filtering by status and type
  - Sort Dropdown: Shows options for sorting by date, name, budget
  - View Toggle: Icon buttons for grid/list view
```

### Add Trip Button
```markdown
## Add Trip Button (Floating Action Button)
- **States**: Default, Hover, Active
- **Colors**: 
  - Background: `hsl(24.6 95% 53.1%)` (hover: `hsl(24.6 95% 48%)`)
  - Icon: White
- **Dimensions**: 56px × 56px (circular)
- **Border Radius**: `rounded-full`
- **Shadow**: `shadow-md` normal, `shadow-lg` on hover
- **Transition**: `transition-all duration-200`
- **Position**: Fixed, bottom-right corner (24px from edges)
- **Icon**: Plus symbol, 24px
```

### Empty State
```markdown
## Empty State
- **Colors**: 
  - Background: `hsl(0 0% 98%)`
  - Text: `hsl(215.4 16.3% 46.9%)`
  - Button: Same as Add Trip Button
- **Dimensions**: 
  - Width: 100% of container
  - Height: 50vh minimum
- **Layout**: Centered content with illustration, text, and CTA button
- **Typography**:
  - Heading: 24px/1.5rem, Semi-bold, Primary text color
  - Subtext: 16px/1rem, Regular, Secondary text color
- **Illustration**: Placeholder travel illustration, 200px × 200px
```

## 3. Responsive Behavior

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

### Responsive Patterns
- **Trip Cards Grid**:
  - Desktop: 3 columns (33.33% width)
  - Tablet: 2 columns (50% width)
  - Mobile: 1 column (100% width)

- **Filter/Sort Bar**:
  - Desktop: All elements visible in a single row
  - Tablet: Condensed layout with smaller input fields
  - Mobile: Stacked layout (search on top, filters below)

- **Typography**:
  - Desktop: Base size (as specified in component specs)
  - Tablet: Base size
  - Mobile: Slightly reduced (-1px for body text)

- **Add Trip Button**:
  - Desktop & Tablet: Fixed position, bottom-right
  - Mobile: Fixed position, centered at bottom

## 4. Interactions & Animations

### Micro-interactions
- **Trip Card**:
  - Hover: Slight elevation increase (shadow-sm → shadow-md)
  - Click: Navigate to trip detail page
  - Long press (mobile): Show quick actions menu

- **Filter/Sort Controls**:
  - Dropdown animations: 150ms ease-out
  - Filter selection: Pill appears showing active filters
  - Clear filters: "×" button appears when filters are active

- **Add Trip Button**:
  - Hover: Scale to 1.05× size
  - Click: Ripple effect + navigate to new trip form
  - Mobile: Slight bounce animation on page load

### Page Transitions
- Page entry animation: Fade in (200ms)
- Trip cards stagger animation: Cards appear sequentially (50ms delay between each)
- Loading state: Skeleton screens for trip cards while data loads

## 5. Accessibility Requirements

### Keyboard Navigation
- [ ] Tab order: Search → Filters → Sort → Trip cards → Add button
- [ ] Enter key on trip card navigates to detail page
- [ ] Escape key closes any open dropdowns
- [ ] Arrow keys navigate between trip cards when focused

### ARIA
- [ ] Search input has proper label and role
- [ ] Filter/sort dropdowns have aria-expanded and aria-controls
- [ ] Trip cards have appropriate roles (article)
- [ ] Status badges have aria-label describing the status
- [ ] Add button has descriptive aria-label ("Add new trip")

### Focus Management
- [ ] Visible focus indicators on all interactive elements
- [ ] Focus trap in modal dialogs (filter panel on mobile)
- [ ] Return focus to trigger element when closing dialogs

## 6. Performance Guidelines

### Asset Optimization
- [ ] Trip card images: WebP format, 400×267px (3:2 ratio)
- [ ] Lazy loading for trip card images
- [ ] Responsive images with srcset for different screen sizes
- [ ] Icon system using SVG sprites

### Code Optimization
- [ ] Virtualized list for large trip collections
- [ ] Pagination or infinite scroll for more than 20 trips
- [ ] Memoize trip card components to prevent unnecessary re-renders
- [ ] Prefetch trip detail data on hover (desktop only)

## 7. Testing Requirements

### Devices
- [ ] Mobile (iPhone 12/13/14, Samsung Galaxy)
- [ ] Tablet (iPad, Samsung Tab)
- [ ] Desktop (1080p, 1440p, 4K)

### Test Cases
- [ ] Empty state when no trips exist
- [ ] Loading state while fetching trips
- [ ] Error state if trip fetch fails
- [ ] Filter functionality for all status types
- [ ] Sort functionality for all sort options
- [ ] Search functionality with partial matches
- [ ] Responsive layout at all breakpoints
- [ ] Keyboard navigation through all elements
- [ ] Screen reader compatibility

## 8. Implementation Notes

### Component Structure (Svelte)
```svelte
<!-- src/routes/trips/+page.svelte -->
<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import TripCard from '$lib/components/trips/TripCard.svelte';
  import FilterBar from '$lib/components/trips/FilterBar.svelte';
  import EmptyState from '$lib/components/common/EmptyState.svelte';
  import AddTripButton from '$lib/components/trips/AddTripButton.svelte';
  import { tripsStore } from '$lib/stores/trips';
  import type { Trip, TripStatus, TripType } from '$lib/types/trip';
  
  // State using Svelte 5 runes
  let trips = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let filters = $state<{ status: TripStatus | null; type: TripType | null }>({ 
    status: null, 
    type: null 
  });
  let sortBy = $state<'startDate' | 'name' | 'budget'>('startDate');
  let searchQuery = $state('');
  let viewMode = $state<'grid' | 'list'>('grid');
  
  // Computed values with $derived rune
  $derived filteredTrips = filterAndSortTrips(trips, filters, sortBy, searchQuery);
  
  // Methods
  function filterAndSortTrips(trips: Trip[], filters: typeof filters, sortBy: string, searchQuery: string) {
    // Filter by status and type if set
    let result = [...trips];
    
    if (filters.status) {
      result = result.filter(trip => trip.status === filters.status);
    }
    
    if (filters.type) {
      result = result.filter(trip => trip.type === filters.type);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(trip => 
        trip.name.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query)
      );
    }
    
    // Sort results
    return result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'budget') {
        return a.budget - b.budget;
      } else { // startDate
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
    });
  }
  
  function handleFilterChange(event) {
    filters = event.detail;
  }
  
  function handleSortChange(event) {
    sortBy = event.detail;
  }
  
  function handleSearchChange(event) {
    searchQuery = event.target.value;
  }
  
  function handleViewModeChange(mode) {
    viewMode = mode;
  }
  
  // Lifecycle
  onMount(async () => {
    try {
      // Subscribe to trips store or fetch from API
      const unsubscribe = tripsStore.subscribe(data => {
        trips = data;
        isLoading = false;
      });
      
      // Clean up subscription
      return unsubscribe;
    } catch (err) {
      error = err;
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>My Trips | TravelerAIgent</title>
  <meta name="description" content="Manage and view all your travel plans in one place" />
</svelte:head>

<div class="trips-page">
  <h1>My Trips</h1>
  
  <FilterBar 
    {filters} 
    {sortBy} 
    {searchQuery}
    {viewMode}
    on:filterChange={handleFilterChange}
    on:sortChange={handleSortChange}
    on:searchChange={handleSearchChange}
    on:viewModeChange={handleViewModeChange}
  />
  
  {#if isLoading}
    <!-- Skeleton loading state -->
    <div class="trips-grid skeleton" aria-busy="true" aria-label="Loading trips">
      {#each Array(6) as _, i}
        <div class="trip-card-skeleton" aria-hidden="true"></div>
      {/each}
    </div>
  {:else if error}
    <!-- Error state -->
    <div class="error-state" role="alert">
      <p>Failed to load trips: {error.message}</p>
      <button on:click={retryFetch} class="btn btn-primary">Retry</button>
    </div>
  {:else if filteredTrips.length === 0}
    <!-- Empty state -->
    <EmptyState 
      title="No trips found"
      description="Create your first trip to get started planning your adventures!"
      buttonText="Create Trip"
      buttonHref="/trips/new"
      illustration="travel"
    />
  {:else}
    <!-- Trip grid/list -->
    <div 
      class="trips-{viewMode}" 
      role="region" 
      aria-label="Your trips"
    >
      {#each filteredTrips as trip (trip.id)}
        <TripCard {trip} />
      {/each}
    </div>
  {/if}
  
  <AddTripButton />
</div>

<style>
  .trips-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: hsl(222.2 47.4% 11.2%);
  }
  
  .trips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .trips-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 640px) {
    .trips-page {
      padding: 1rem;
    }
    
    .trips-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (min-width: 641px) and (max-width: 1023px) {
    .trips-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* Skeleton loading styles */
  .trip-card-skeleton {
    height: 300px;
    background: linear-gradient(
      90deg,
      hsl(0 0% 96%) 0%,
      hsl(0 0% 98%) 50%,
      hsl(0 0% 96%) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.5rem;
  }
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
```

### File Organization
```
src/
  lib/
    components/
      trips/
        TripCard.svelte
        FilterBar.svelte
        AddTripButton.svelte
        TripStatusBadge.svelte
      common/
        EmptyState.svelte
        SearchInput.svelte
        Dropdown.svelte
    utils/
      trip-filters.ts       # Filter/sort logic
      date-formatting.ts    # Date formatting utilities
  routes/
    trips/
      +page.svelte          # Main trips listing page
      +page.server.ts       # Server-side data loading
      new/
        +page.svelte        # New trip form
      [id]/
        +page.svelte        # Trip detail page
```

## 9. Do's and Don'ts

### Do
- ✅ Use semantic HTML elements (article for trip cards, nav for filters)
- ✅ Implement proper loading states and error boundaries
- ✅ Optimize images for performance with WebP format and responsive srcset
- ✅ Ensure all interactive elements have appropriate hover/focus states
- ✅ Use consistent spacing throughout (multiples of 8px)
- ✅ Implement keyboard navigation for all interactive elements
- ✅ Use Svelte's scoped styles for component-specific styling
- ✅ Follow WCAG AA standards for color contrast (4.5:1 for normal text)
- ✅ Use Svelte 5 runes for reactive state management

### Don't
- ❌ Use fixed heights for trip cards (allow content to determine height)
- ❌ Rely solely on color to convey trip status (use icons and text)
- ❌ Overload trip cards with too much information
- ❌ Use small touch targets on mobile (minimum 44×44px)
- ❌ Implement complex animations that might affect performance
- ❌ Fetch all trip data at once for large collections
- ❌ Use inline styles instead of Svelte's scoped styles
- ❌ Nest components too deeply in the component hierarchy
- ❌ Ignore browser compatibility issues

## 10. Visual Mockup Reference

```
+----------------------------------------------+
|  Logo         My Trips             User Menu |
+----------------------------------------------+
|                                              |
| [Search]    [Filter ▼]   [Sort ▼]   [⊞][≡]  |
|                                              |
| +------------+  +------------+  +------------+
| |            |  |            |  |            |
| |   IMAGE    |  |   IMAGE    |  |   IMAGE    |
| |            |  |            |  |            |
| | [STATUS]   |  | [STATUS]   |  | [STATUS]   |
| +------------+  +------------+  +------------+
| | Trip Name   |  | Trip Name   |  | Trip Name   |
| | Date Range  |  | Date Range  |  | Date Range  |
| | Trip Type   |  | Trip Type   |  | Trip Type   |
| | Description...|  | Description...|  | Description...|
| |        $XXX |  |        $XXX |  |        $XXX |
| +------------+  +------------+  +------------+
|                                              |
| +------------+  +------------+  +------------+
| |            |  |            |  |            |
| |   IMAGE    |  |   IMAGE    |  |   IMAGE    |
| |            |  |            |  |            |
| | [STATUS]   |  | [STATUS]   |  | [STATUS]   |
| +------------+  +------------+  +------------+
| | Trip Name   |  | Trip Name   |  | Trip Name   |
| | Date Range  |  | Date Range  |  | Date Range  |
| | Trip Type   |  | Trip Type   |  | Trip Type   |
| | Description...|  | Description...|  | Description...|
| |        $XXX |  |        $XXX |  |        $XXX |
| +------------+  +------------+  +------------+
|                                              |
|                    [+]                       |
+----------------------------------------------+
```

## 11. Review Checklist

### Design Review
- [ ] Matches brand guidelines and design system
- [ ] Responsive behavior correct at all breakpoints
- [ ] Animations are subtle and enhance UX
- [ ] Accessibility requirements met
- [ ] Empty, loading, and error states designed

### Code Review
- [ ] Follows project structure and naming conventions
- [ ] Type-safe with proper TypeScript interfaces
- [ ] Proper error handling for API requests
- [ ] Performance optimizations implemented
- [ ] Consistent with Svelte 5 runes and best practices

---

*Last Updated: 2025-05-30*

## 12. Additional Considerations

### Data Model Integration
This design is based on the current understanding of the Trips data model as defined in the Trips.md document. As that document evolves, this design may need to be updated to reflect changes in:

- Trip properties and metadata
- Relationships between trips, destinations, and travelers
- Status and type enumerations
- Budget and date handling

### Future Enhancements
Potential future enhancements to consider:

- Map view of trip destinations
- Timeline view of trip itinerary
- Sharing and collaboration features
- Trip templates and duplication
- Integration with external travel services
- Trip statistics and analytics

### Accessibility Compliance
This design aims to meet WCAG 2.1 AA standards, including:

- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigability for all interactive elements
- Proper ARIA attributes and roles
- Screen reader compatibility
- Focus management

All implementations should be tested with screen readers and keyboard navigation to ensure accessibility compliance.
