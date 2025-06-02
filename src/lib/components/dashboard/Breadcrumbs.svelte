<script lang="ts">
  // Props for the breadcrumbs component
  const { crumbs = [], centered = false } = $props<{
    crumbs: Array<{name: string, href: string}>;
    centered?: boolean;
  }>();
</script>

<nav class="px-4 sm:px-6 lg:px-8 py-4" aria-label="Breadcrumb">
  <ol class="flex items-center {centered ? 'justify-center' : ''} space-x-2">
    {#each crumbs as crumb, i}
      <li>
        <div class="flex items-center">
          {#if i > 0}
            <svg class="h-4 w-4 text-blue-300/60 dark:text-blue-400/60" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          {/if}
          <a 
            href={crumb.href} 
            class="text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-900 rounded px-2 py-1"
            aria-current={i === crumbs.length - 1 ? 'page' : undefined}
          >
            {crumb.name}
          </a>
        </div>
      </li>
    {/each}
  </ol>
</nav>
