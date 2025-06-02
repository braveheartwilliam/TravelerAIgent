/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'c8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['**/__tests__/**', '**/*.spec.ts']
    },
    include: ['src/lib/components/ui/command/**/*.svelte', 'src/lib/components/ui/command/**/*.ts'],
    passWithNoTests: false,
    watch: false
  },
};
