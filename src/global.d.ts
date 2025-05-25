// Global type declarations for the application

// Svelte 5 runes
declare const $state: <T>(initialValue: T) => T;
declare const $derived: <T>(expression: T) => T;
declare const $effect: (fn: () => void | (() => void)) => void;
declare const $props: <T = Record<string, any>>() => T;

// Svelte 5 types
declare namespace svelteHTML {
  type HTMLAttributes<T = HTMLElement> = {
    [key: string]: any;
    class?: string;
    style?: string | Record<string, string | number | undefined>;
    onclick?: (event: MouseEvent & { currentTarget: EventTarget & T }) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: EventTarget & T }) => void;
  };
  
  interface IntrinsicElements {
    [elemName: string]: HTMLAttributes<HTMLElement>;
  }
}

// Svelte 5 JSX namespace
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    [key: string]: any;
    class?: string;
    style?: string | Record<string, string | number | undefined>;
    onclick?: (event: MouseEvent & { currentTarget: EventTarget & T }) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: EventTarget & T }) => void;
  }
}

// SvelteKit types
declare module '$app/stores' {
  export const page: {
    subscribe: (run: (value: any) => void, invalidate?: any) => () => void;
  } & { data: PageData };
  
  export interface PageData {
    session?: {
      user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    };
  }
}

declare module '$app/navigation' {
  export const goto: (url: string, opts?: { 
    replaceState?: boolean; 
    noscroll?: boolean; 
    keepFocus?: boolean; 
    state?: any;
  }) => Promise<void>;
}

// Svelte component types
declare module '*.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class extends SvelteComponentTyped<Record<string, any>, any, any> {}
}

// Augment the existing svelte.JSX namespace
declare namespace svelte.JSX {
  interface HTMLProps<T> {
    [key: string]: any;
  }
  
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Auth.js types
declare module '@auth/sveltekit/client' {
  export const signOut: (options?: { 
    callbackUrl?: string; 
    redirect?: boolean 
  }) => Promise<void>;
  
  export interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: string;
  }
}

// Global types
type Nullable<T> = T | null | undefined;

// Add global type for FormData
type FormDataEntryValue = File | string;

interface FormData {
  entries(): IterableIterator<[string, FormDataEntryValue]>;
  forEach(
    callback: (value: FormDataEntryValue, key: string, parent: FormData) => void,
    thisArg?: any
  ): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string): void;
  set(name: string, value: Blob, filename?: string): void;
  delete(name: string): void;
  [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
}
