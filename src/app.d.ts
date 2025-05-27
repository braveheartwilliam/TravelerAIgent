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
      user: {
        id: string;
        email: string;
        name: string | null;
        userName: string;
        role: 'user' | 'admin';
        is_active: boolean;
        createdAt: string;
        updatedAt: string;
      } | null;
      session?: any; // Session data
      getSession: () => Promise<{
        user?: {
          id: string;
          name?: string | null;
          email?: string | null;
          userName: string;
          role: 'user' | 'admin';
          is_active: boolean;
          image?: string | null;
          createdAt?: string;
          updatedAt?: string;
        } | null;
      } | null>;
    }
    
    interface PageData {
      user?: {
        id: string;
        email: string;
        name: string | null;
        userName: string;
        role: 'user' | 'admin';
        is_active: boolean;
        createdAt: string;
        updatedAt: string;
      } | null;
      session?: {
        user?: {
          id: string;
          email: string;
          name?: string | null;
          userName: string;
          role: 'user' | 'admin';
          is_active: boolean;
          createdAt?: string;
          updatedAt?: string;
          image?: string | null;
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
    id: string | number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    fullName?: string | null;
    userName?: string;
    is_active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    expires?: string;
  }

  // Svelte 5 component types
  interface ComponentType {
    $$prop_def: Record<string, any>;
    $$slot_def: Record<string, any>;
    $$events_def: Record<string, any>;
  }
}

export {};
