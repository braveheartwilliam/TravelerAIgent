<script lang="ts">
  // No props needed
</script>

<div class="animate-pulse space-y-8">
  <!-- Main Heading Skeleton -->
  <div class="space-y-3 max-w-3xl mx-auto">
  </div>
  
  <!-- Feature Cards Skeleton -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each Array(3) as _, i}
      <div class="h-48 bg-gray-300/20 dark:bg-gray-700/30 rounded-lg shadow-sm" aria-hidden="true">
        <div class="h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded w-3/4 mx-4 mt-4 mb-2"></div>
        <div class="space-y-2 mx-4">
          <div class="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded w-full"></div>
          <div class="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded w-5/6"></div>
          <div class="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded w-4/6"></div>
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Action Buttons Skeleton -->
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <div class="h-12 bg-gray-300/20 dark:bg-gray-700/30 rounded-md w-full sm:w-48"></div>
    <div class="h-12 bg-gray-300/20 dark:bg-gray-700/30 rounded-md w-full sm:w-48"></div>
  </div>
  
  <!-- Guided Creation Skeleton -->
  <div class="h-64 bg-gray-300/20 dark:bg-gray-700/30 rounded-lg shadow-sm">
    <div class="h-6 bg-gray-300/30 dark:bg-gray-600/30 rounded w-1/3 mx-6 mt-6 mb-3"></div>
    <div class="space-y-2 mx-6">
      <div class="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded w-full"></div>
      <div class="h-4 bg-gray-300/30 dark:bg-gray-600/30 rounded w-5/6"></div>
    </div>
    <div class="h-10 bg-gray-300/30 dark:bg-gray-600/30 rounded-md w-1/3 mx-6 mt-6"></div>
  </div>
  
  <span class="sr-only">Loading dashboard content...</span>
</div>
