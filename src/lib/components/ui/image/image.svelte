<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { cn } from '$lib/utils';
  
  // Props using Svelte 5 runes
  const { 
    class: className = '',
    src = '',
    alt = '',
    width = undefined,
    height = undefined,
    aspectRatio = undefined,
    objectFit = 'cover',
    loading = 'lazy',
    fallback = undefined,
    blurhash = undefined,
    priority = false,
    sizes = undefined,
    fetchpriority = undefined,
    decoding = 'async',
    role = 'img',
    ...attrs
  } = $props<{
    class?: string;
    src: string;
    alt: string;
    width?: number;
    height?: number;
    aspectRatio?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    loading?: 'eager' | 'lazy';
    fallback?: string;
    blurhash?: string;
    priority?: boolean;
    sizes?: string;
    fetchpriority?: 'high' | 'low' | 'auto';
    decoding?: 'sync' | 'async' | 'auto';
    role?: string;
    [key: string]: any;
  }>();
  
  // State
  let loaded = $state(false);
  let error = $state(false);
  let imgElement: HTMLImageElement | undefined = $state(undefined);
  let observer: IntersectionObserver | undefined = $state(undefined);
  let inView = $state(false);
  
  // Handle image loading
  function handleLoad() {
    loaded = true;
    // Report performance metrics
    if (window.performance && imgElement) {
      try {
        const loadTime = performance.now();
        // Could send this to analytics in a real app
        console.debug(`Image loaded in ${Math.round(loadTime)}ms:`, src);
      } catch (e) {
        // Silently fail if performance API fails
      }
    }
  }
  
  // Handle image error
  function handleError() {
    error = true;
    console.error(`Failed to load image: ${src}`);
  }
  
  // Generate styles for aspect ratio
  const aspectRatioStyle = $derived(
    aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''
  );
  
  // Determine what to display
  const showFallback = $derived(error || (!loaded && !blurhash));
  const showBlurhash = $derived(!loaded && !error && blurhash);
  const showImage = $derived(loaded && !error);
  
  // Set up intersection observer for better performance
  function setupIntersectionObserver() {
    if (!imgElement || !window.IntersectionObserver || priority) {
      // If priority is true, we don't need the observer as we load immediately
      inView = true;
      return;
    }

    observer = new IntersectionObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        if (entry) {
          inView = entry.isIntersecting;
          
          if (entry.isIntersecting) {
            // Once the image is in view, we can disconnect the observer
            observer?.disconnect();
            observer = undefined;
          }
        }
      }
    }, {
      rootMargin: '200px', // Start loading when image is 200px from viewport
      threshold: 0.1
    });
    
    observer.observe(imgElement);
  }
  
  onMount(() => {
    // If the image is already cached, it might not trigger the load event
    if (imgElement?.complete) {
      loaded = true;
    }
    
    // If priority is true, we don't need the observer
    if (priority) {
      inView = true;
    } else {
      setupIntersectionObserver();
    }
  });
  
  onDestroy(() => {
    // Clean up observer when component is destroyed
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  });
</script>

<div 
  class={cn(
    "relative overflow-hidden",
    className
  )}
  style={aspectRatioStyle}
  role="presentation"
  aria-hidden={alt === ''}
>
  {#if showFallback}
    <div class="absolute inset-0 bg-muted flex items-center justify-center" aria-hidden="true">
      {#if fallback}
        <img 
          src={fallback} 
          alt="" 
          class="w-full h-full object-cover"
          role="presentation"
          aria-hidden="true"
        />
      {:else}
        <div class="text-muted-foreground text-sm flex items-center justify-center h-full">
          <span class="bg-muted-foreground/10 px-2 py-1 rounded">
            {alt || 'Image unavailable'}
          </span>
        </div>
      {/if}
    </div>
  {/if}
  
  {#if showBlurhash}
    <div 
      class="absolute inset-0 bg-cover bg-center" 
      style={`background-image: url(${blurhash});`}
      aria-hidden="true"
    ></div>
  {/if}
  
  <img 
    bind:this={imgElement}
    src={inView || priority ? src : ''} 
    {alt}
    width={width}
    height={height}
    {decoding}
    {sizes}
    fetchpriority={fetchpriority || (priority ? 'high' : undefined)}
    {role}
    class={cn(
      "w-full h-full transition-opacity duration-300",
      objectFit === 'contain' && "object-contain",
      objectFit === 'cover' && "object-cover",
      objectFit === 'fill' && "object-fill",
      objectFit === 'none' && "object-none",
      objectFit === 'scale-down' && "object-scale-down",
      !loaded && "opacity-0",
      loaded && "opacity-100"
    )}
    loading={priority ? 'eager' : loading}
    onload={handleLoad}
    onerror={handleError}
    {...attrs}
  />
</div>
