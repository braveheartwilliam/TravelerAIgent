<script>
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  
  function goBack() {
    window.history.back();
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <Button on:click={goBack} class="mb-6" variant="ghost">
    <span>← Back</span>
  </Button>
  
  <div class="prose max-w-none">
    <h1 class="text-3xl font-bold mb-6">About TravelerAIgent</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
      <p class="text-lg text-gray-700 mb-4">
        At TravelerAIgent, we believe that travel should be accessible, enjoyable, and personalized. 
        Our mission is to leverage the power of AI to create seamless travel experiences tailored to 
        your unique preferences and needs.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">How It Works</h2>
      <div class="grid md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-xl">1</span>
          </div>
          <h3 class="font-semibold text-lg mb-2">Tell Us Your Preferences</h3>
          <p class="text-gray-600">Share your travel style, interests, and budget with our AI assistant.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-xl">2</span>
          </div>
          <h3 class="font-semibold text-lg mb-2">Get Personalized Itineraries</h3>
          <p class="text-gray-600">Receive customized travel plans tailored just for you.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold text-xl">3</span>
          </div>
          <h3 class="font-semibold text-lg mb-2">Book & Travel</h3>
          <p class="text-gray-600">Book your trip and enjoy a stress-free travel experience.</p>
        </div>
      </div>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Our Team</h2>
      <p class="text-gray-700 mb-6">
        We're a passionate team of travel enthusiasts and AI experts dedicated to revolutionizing 
        the way people plan and experience travel. Our diverse backgrounds in technology, hospitality, 
        and customer service come together to create the ultimate travel planning platform.
      </p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
      <p class="text-gray-700 mb-4">
        Have questions or feedback? We'd love to hear from you!
      </p>
      <a 
        href="mailto:hello@traveleraigent.com" 
        class="text-blue-600 hover:text-blue-800 hover:underline"
      >
        hello@traveleraigent.com
      </a>
    </section>
  </div>
</div>
