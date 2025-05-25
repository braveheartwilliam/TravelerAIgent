<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  
  function goBack(event: MouseEvent) {
    event.preventDefault();
    window.history.back();
  }
  
  // Type definitions for HTML elements
  type HTMLButtonElementWithClick = HTMLButtonElement & {
    click: () => void;
  };
  
  type HTMLAnchorElementWithHref = HTMLAnchorElement & {
    href: string;
  };
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <Button on:click={goBack} variant="ghost" class="mb-8">
    <span>← Back</span>
  </Button>
  
  <div class="prose max-w-none">
    <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p class="text-gray-600 mb-8">Last updated: May 20, 2025</p>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
      <p class="text-gray-700 mb-4">
        Welcome to TravelerAIgent. We respect your privacy and are committed to protecting your personal data. 
        This privacy policy will inform you about how we look after your personal data when you visit our 
        website and tell you about your privacy rights and how the law protects you.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. Information We Collect</h2>
      <p class="text-gray-700 mb-4">
        We may collect, use, store, and transfer different kinds of personal data about you which we have 
        grouped together as follows:
      </p>
      <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
        <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
        <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
        <li><strong>Travel Preferences</strong> includes your travel interests, destinations, and other preferences you share with us.</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
      <p class="text-gray-700 mb-4">
        We will only use your personal data when the law allows us to. Most commonly, we will use your 
        personal data in the following circumstances:
      </p>
      <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>To provide and maintain our service</li>
        <li>To notify you about changes to our service</li>
        <li>To allow you to participate in interactive features of our service</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our service</li>
        <li>To monitor the usage of our service</li>
        <li>To detect, prevent and address technical issues</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. Data Security</h2>
      <p class="text-gray-700 mb-4">
        We have implemented appropriate security measures to prevent your personal data from being 
        accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, 
        we limit access to your personal data to those employees, agents, contractors, and other third 
        parties who have a business need to know.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Your Legal Rights</h2>
      <p class="text-gray-700 mb-4">
        Under certain circumstances, you have rights under data protection laws in relation to your 
        personal data, including the right to:
      </p>
      <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>Request access to your personal data</li>
        <li>Request correction of your personal data</li>
        <li>Request erasure of your personal data</li>
        <li>Object to processing of your personal data</li>
        <li>Request restriction of processing your personal data</li>
        <li>Request transfer of your personal data</li>
        <li>Right to withdraw consent</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Contact Us</h2>
      <p class="text-gray-700 mb-4">
        If you have any questions about this Privacy Policy, please contact us at:
      </p>
      <p class="text-gray-700">
        Email: privacy@traveleraigent.com
      </p>
    </section>
  </div>
</div>
