<!--
  Form select component with label and error message
  Follows the UI design rules and code style guide
-->
<script lang="ts">
  // Props using Svelte 5 runes syntax
  const props = $props<{
    name: string;
    label: string;
    value?: string;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
    class?: string;
  }>();
  
  // Extract props with defaults
  const name = props.name;
  const label = props.label;
  const options = props.options ?? [];
  const placeholder = props.placeholder ?? 'Select an option';
  const required = props.required ?? false;
  const disabled = props.disabled ?? false;
  const error = props.error ?? '';
  const id = props.id ?? '';
  const className = props.class ?? '';
  
  // Bindable value
  let value = $state(props.value ?? '');

  // Generate a unique ID if one is not provided
  const inputId = id || `select-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
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
  
  <select
    {id}
    {name}
    {disabled}
    bind:value
    class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 
      {hasError 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
      }"
    aria-invalid={hasError}
    aria-describedby={hasError ? `${inputId}-error` : undefined}
  >
    <option value="" disabled>{placeholder}</option>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
  
  {#if hasError}
    <p id="{inputId}-error" class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
</div>
