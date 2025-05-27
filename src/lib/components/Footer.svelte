<script lang="ts">
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];
</script>

<footer class="bg-gray-50 border-t border-gray-200">
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex justify-center md:justify-start space-x-6">
        {#each footerLinks as link}
          <a href={link.href} class="text-gray-500 hover:text-gray-700 text-sm">
            {link.name}
          </a>
        {/each}
      </div>
      <div class="mt-4 md:mt-0 text-center md:text-right">
        <p class="text-sm text-gray-500">
          &copy; {currentYear} TravelSphere. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>
