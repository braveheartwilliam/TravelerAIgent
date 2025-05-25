<script>
  import { goto } from '$app/navigation';
  
  function handleClick(path) {
    goto(path);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">Welcome to TravelerAIgent</h1>
      <p class="text-xl text-gray-600 mb-10">Your personal travel planning assistant</p>
      
      <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <a 
          href="/app"
          class="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors text-center"
        >
          Go to App
        </a>
        <a 
          href="/about"
          class="block bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 border border-gray-300 rounded-lg shadow-sm transition-colors text-center"
        >
          Learn More
        </a>
      </div>
      
      <div class="mt-16 bg-white p-8 rounded-xl shadow-md text-left">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
        <p class="text-gray-600 mb-6">
          Welcome to your new SvelteKit application. This is a simple landing page that you can customize.
          The app requires authentication to access the main features.
        </p>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 text-blue-500">✓</div>
            <p class="ml-3 text-gray-700">Built with Svelte 5 and SvelteKit</p>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0 h-6 w-6 text-blue-500">✓</div>
            <p class="ml-3 text-gray-700">Responsive design that works on all devices</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
