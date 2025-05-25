/// <reference types="@sveltejs/kit" />

// Svelte 5 JSX types
declare namespace svelte.JSX {
  // Base attributes available on all elements
  interface HTMLAttributes<T> {
    [key: string]: any;
    class?: string;
    style?: string | Record<string, string | number | undefined>;
    onclick?: (event: MouseEvent & { currentTarget: EventTarget & T }) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: EventTarget & T }) => void;
    onsubmit?: (event: Event & { currentTarget: EventTarget & T }) => void;
    oninput?: (event: Event & { currentTarget: EventTarget & T }) => void;
    onchange?: (event: Event & { currentTarget: EventTarget & T }) => void;
  }
}

// Global type declarations
declare global {
  // Svelte 5 runes
declare const $state: <T>(initialValue: T) => T;
declare const $derived: <T>(expression: T) => T;
declare const $effect: (fn: () => void | (() => void)) => void;
declare const $props: <T = Record<string, any>>() => T;

  // Svelte 5 component types
  interface ComponentType {
    $$prop_def: Record<string, any>;
    $$slot_def: Record<string, any>;
    $$events_def: Record<string, any>;
  }

  // Window extensions
  interface Window {
    // Add any global browser APIs or extensions here
  }
}

// Make this file a module
export {};
