import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Svelte 5 features
  compilerOptions: {
    enableSourcemap: true,
  },
  
  // Path aliases
  kit: {
    adapter: adapter(),
    alias: {
      $lib: path.resolve('./src/lib'),
      '$lib/*': path.resolve('./src/lib/*'),
      '$components/*': path.resolve('./src/lib/components/*'),
      '$utils/*': path.resolve('./src/lib/utils/*'),
      '$app/*': path.resolve('./.svelte-kit/types/src/app.d.ts'),
      '$env/*': path.resolve('./.svelte-kit/ambient.d.ts')
    }
  },
  
  // Preprocess with Vite
  preprocess: [
    vitePreprocess({
      // TypeScript configuration
      typescript: {
        tsconfig: './tsconfig.json',
      },
    })
  ]
};

export default config;
