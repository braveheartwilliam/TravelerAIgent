// Type definitions for SvelteKit environment variables
declare module '$env/dynamic/private' {
  export const env: {
    [key: string]: string | undefined;
  };
}

// Add any other ambient type declarations here
