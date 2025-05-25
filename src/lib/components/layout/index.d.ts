declare module '$lib/components/layout' {
  import type { SvelteComponent } from 'svelte';
  
  const Footer: new () => SvelteComponent;
  
  export { Footer };
  export default Footer;
}
