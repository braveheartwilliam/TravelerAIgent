/// <reference types="@sveltejs/kit" />

// Svelte 5 runes
declare const $state: <T>(initialValue: T) => T;
declare const $derived: <T>(expression: T) => T;
declare const $effect: (fn: () => void | (() => void)) => void;
declare const $props: <T = Record<string, any>>() => T;

// Svelte 5 JSX types
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    [key: string]: any;
    class?: string;
    style?: string | Record<string, string | number | undefined>;
    onclick?: (event: MouseEvent & { currentTarget: EventTarget & T }) => void;
    onkeydown?: (event: KeyboardEvent & { currentTarget: EventTarget & T }) => void;
  }
}

// Svelte 5 component types
declare module '*.svelte' {
  import type { Snippet } from 'svelte';
  const component: any;
  export default component;
  
  export const children: Snippet;
  export const props: Record<string, any>;
  export const restProps: Record<string, any>;
  export const slots: Record<string, any>;
}
