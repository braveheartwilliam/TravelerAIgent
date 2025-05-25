/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production' | 'test';
      VITE_AUTH_URL: string;
      VITE_GITHUB_ID: string;
      // Add other environment variables here as needed
    }
  }
}

export {};
