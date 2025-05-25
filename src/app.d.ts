// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// Svelte 5 runes
declare const $state: <T>(initialValue: T) => T;
declare const $derived: <T>(expression: T) => T;
declare const $effect: (fn: () => void | (() => void)) => void;
declare const $props: <T = Record<string, any>>() => T;

// Global type declarations
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      getSession: () => Promise<{
        user?: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          role?: string;
        } | null;
      } | null>;
    }
    
    interface PageData {
      session?: {
        user?: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          role?: string;
        } | null;
      } | null;
    }
    
    // interface PageState {}
    // interface Platform {}
  }


  // Svelte 5 JSX types
  namespace svelte.JSX {
    interface HTMLAttributes<T> {
      [key: string]: any;
      class?: string;
      style?: string | Record<string, string | number | undefined>;
      onclick?: (event: MouseEvent & { currentTarget: EventTarget & T }) => void;
      onkeydown?: (event: KeyboardEvent & { currentTarget: EventTarget & T }) => void;
    }
  }

  // Legacy svelteHTML namespace for compatibility
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      [key: string]: any;
      class?: string;
      style?: string | Record<string, string | number | undefined>;
      onclick?: (event: MouseEvent) => void;
      onkeydown?: (event: KeyboardEvent) => void;
    }
  }

  // Extend the User type from @auth/core/types
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }

  // Svelte 5 component types
  interface ComponentType {
    $$prop_def: Record<string, any>;
    $$slot_def: Record<string, any>;
    $$events_def: Record<string, any>;
  }
}

export {};
