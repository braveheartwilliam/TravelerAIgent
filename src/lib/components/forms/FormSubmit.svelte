<!--
  Form submit button component
  Follows the UI design rules and code style guide
-->
<script lang="ts">
  import { Loader2 } from 'lucide-svelte';

  // Props using Svelte 5 runes syntax
  const props = $props<{
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    type?: 'submit' | 'button' | 'reset';
    class?: string;
  }>();
  
  // Extract props with defaults
  const label = props.label ?? 'Submit';
  const loading = props.loading ?? false;
  const disabled = props.disabled ?? false;
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const type = props.type ?? 'submit';
  const className = props.class ?? '';

  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Compute button classes
  function getButtonClasses() {
    const variantClass = variantClasses[variant as keyof typeof variantClasses];
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses];
    
    return `
      ${variantClass} 
      ${sizeClass} 
      rounded-md font-medium transition-colors 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `;
  }
  
  // Derived classes
  const buttonClasses = $derived(getButtonClasses());
</script>

<button 
  {type} 
  disabled={disabled || loading}
  class={buttonClasses}
>
  {#if loading}
    <Loader2 class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" />
    <span>Loading...</span>
  {:else}
    {label}
  {/if}
</button>
