<!--
  Form field component with label, input, and error message
  Follows the UI design rules and code style guide
-->
<script lang="ts">
  // Props using Svelte 5 runes syntax with bindable value
  // Use $props() with destructuring for cleaner code
  let { 
    name, 
    label, 
    type = 'text',
    value = $bindable(''),
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    id = '',
    autocomplete = '',
    class: className = ''
  } = $props();

  // Generate a unique ID if one is not provided
  const inputId = id || `field-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine if the field has an error
  const hasError = $derived(!!error);
</script>

<div class="form-field mb-4 {className}">
  {#if label}
    <label 
      for={inputId}
      class="block text-sm font-medium mb-1 {hasError ? 'text-red-600' : 'text-gray-700'}"
    >
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    id={inputId}
    {name}
    {type}
    class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all {error ? 'border-red-500' : 'border-gray-300'} {className}"
    {placeholder}
    {required}
    {disabled}
    {autocomplete}
    bind:value
    aria-invalid={hasError}
    aria-describedby={hasError ? `${inputId}-error` : undefined}
  />
  
  {#if hasError}
    <p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
