<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  
  function goBack(event: CustomEvent<any>) {
    // Prevent default if available
    if (event.detail?.nativeEvent) {
      event.detail.nativeEvent.preventDefault();
    }
    window.history.back();
  }
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <Button on:click={goBack} variant="ghost" class="mb-8">
    <span>← Back</span>
  </Button>
  
  <div class="prose max-w-none">
    <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
    <p class="text-gray-600 mb-8">Last updated: May 20, 2025</p>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p class="text-gray-700 mb-4">
        By accessing or using the TravelerAIgent service ("Service"), you agree to be bound by these 
        Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. Description of Service</h2>
      <p class="text-gray-700 mb-4">
        TravelerAIgent provides an AI-powered travel planning platform that helps users discover destinations, 
        plan trips, and book travel services. The Service includes, but is not limited to, travel recommendations, 
        itinerary planning, and booking services provided by third parties.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. User Accounts</h2>
      <p class="text-gray-700 mb-4">
        To access certain features of the Service, you may be required to create an account. You agree to provide 
        accurate, current, and complete information during the registration process and to update such information 
        to keep it accurate, current, and complete.
      </p>
      <p class="text-gray-700 mb-4">
        You are responsible for safeguarding your password and for all activities that occur under your account. 
        You agree to notify us immediately of any unauthorized use of your account.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. User Content</h2>
      <p class="text-gray-700 mb-4">
        The Service allows you to post, link, store, share, and otherwise make available certain information, 
        text, graphics, or other material ("Content"). You are responsible for the Content that you post on or 
        through the Service, including its legality, reliability, and appropriateness.
      </p>
      <p class="text-gray-700 mb-4">
        By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours 
        (you own it) and/or you have the right to use it and the right to grant us the rights and license as 
        provided in these Terms, and (ii) that the posting of your Content on or through the Service does not 
        violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any 
        person or entity.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
      <p class="text-gray-700 mb-4">
        You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to 
        use the Service:
      </p>
      <ul class="list-disc pl-6 mb-4 text-gray-700 space-y-2">
        <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
        <li>To exploit, harm, or attempt to exploit or harm minors in any way.</li>
        <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
        <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
      </ul>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
      <p class="text-gray-700 mb-4">
        The Service and its original content, features, and functionality are and will remain the exclusive 
        property of TravelerAIgent and its licensors. The Service is protected by copyright, trademark, and 
        other laws of both the United States and foreign countries. Our trademarks and trade dress may not be 
        used in connection with any product or service without the prior written consent of TravelerAIgent.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
      <p class="text-gray-700 mb-4">
        In no event shall TravelerAIgent, nor its directors, employees, partners, agents, suppliers, or 
        affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
        including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
        resulting from (i) your access to or use of or inability to access or use the Service; (ii) any 
        conduct or content of any third party on the Service; (iii) any content obtained from the Service; 
        and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on 
        warranty, contract, tort (including negligence), or any other legal theory, whether or not we have 
        been informed of the possibility of such damage.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
      <p class="text-gray-700 mb-4">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
        revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. 
        What constitutes a material change will be determined at our sole discretion.
      </p>
    </section>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">9. Contact Us</h2>
      <p class="text-gray-700">
        If you have any questions about these Terms, please contact us at:
      </p>
      <p class="text-gray-700">
        Email: legal@traveleraigent.com
      </p>
    </section>
  </div>
</div>
