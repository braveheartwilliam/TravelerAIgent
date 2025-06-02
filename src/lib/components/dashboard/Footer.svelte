<script lang="ts">
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Hover states for links
  let hoveredLink = $state<string | null>(null);
</script>

<footer class="bg-blue-950/50 dark:bg-gray-900/70 backdrop-blur-sm mt-auto py-6 border-t border-blue-900/50 dark:border-gray-800/50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <p class="text-sm text-blue-200 dark:text-gray-300">&copy; {currentYear} TravelerAIgent. All rights reserved.</p>
      </div>
      <div class="flex space-x-6">
        <a 
          href="/terms" 
          class="text-sm text-blue-300 dark:text-blue-200 hover:text-white dark:hover:text-white transition-colors duration-200 
                 {hoveredLink === 'terms' ? 'underline' : ''}"
          onmouseenter={() => hoveredLink = 'terms'}
          onmouseleave={() => hoveredLink = null}
        >
          Terms
        </a>
        <a 
          href="/privacy" 
          class="text-sm text-blue-300 dark:text-blue-200 hover:text-white dark:hover:text-white transition-colors duration-200
                 {hoveredLink === 'privacy' ? 'underline' : ''}"
          onmouseenter={() => hoveredLink = 'privacy'}
          onmouseleave={() => hoveredLink = null}
        >
          Privacy
        </a>
        <a 
          href="/contact" 
          class="text-sm text-blue-300 dark:text-blue-200 hover:text-white dark:hover:text-white transition-colors duration-200
                 {hoveredLink === 'contact' ? 'underline' : ''}"
          onmouseenter={() => hoveredLink = 'contact'}
          onmouseleave={() => hoveredLink = null}
        >
          Contact
        </a>
      </div>
    </div>
  </div>
</footer>
