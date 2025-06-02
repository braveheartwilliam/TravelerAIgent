<!--
  Form checkbox component with label and error message
  Follows the UI design rules and code style guide
-->
<script lang="ts">
  // Props using Svelte 5 runes syntax with bindable checked value
  let { 
    name, 
    label, 
    checked = $bindable(false),
    required = false,
    disabled = false,
    error = '',
    id = '',
    class: className = ''
  } = $props();

  // Generate a unique ID if one is not provided
  const inputId = id || `checkbox-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Determine if the field has an error
  const hasError = $derived(!!error);
</script>

<div class="form-field mb-4 {className}">
  <div class="flex items-center">
    <input
      {id}
      {name}
      type="checkbox"
      {disabled}
      bind:checked
      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      aria-invalid={hasError}
      aria-describedby={hasError ? `${inputId}-error` : undefined}
    />
    
    {#if label}
      <label 
        for={inputId}
        class="ml-2 block text-sm {hasError ? 'text-red-600' : 'text-gray-700'}"
      >
        {label}
        {#if required}
          <span class="text-red-500">*</span>
        {/if}
      </label>
    {/if}
  </div>
  
  {#if hasError}
    <p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
