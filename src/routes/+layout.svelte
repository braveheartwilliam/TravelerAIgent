<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
</script>

<div class="relative min-h-screen bg-background font-sans antialiased">
  <Header />
  <main class="container flex-1 py-6">
    <slot />
  </main>
  <Footer />
</div>
