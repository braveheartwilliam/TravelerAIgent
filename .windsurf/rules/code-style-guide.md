---
trigger: always_on
---

# Svelte 5 and SvelteKit 2 Coding Style Guide

! Always follow Svelte5 and Sveltekit 2 best practices and adhere to Svelte 5 and Sveltekit 2 standards, conventions and coding practices as defined by Svelte.

## 1. Project Structure
- **Organize files logically**:
  - Keep all Svelte code in the `src` folder.
  - Place components in `src/lib/components`, grouped by feature or page (e.g., `src/lib/components/auth/LoginForm.svelte`).
  - Store static assets in `static/` or `public/`.
  - Use `src/lib` for utilities, stores, and reusable logic (e.g., `src/lib/stores/tasks.js`).
  - Follow SvelteKit’s file-based routing in `src/routes/` (e.g., `src/routes/+page.svelte` for the homepage).
- **File naming**:
  - Use PascalCase for component files (e.g., `Header.svelte`).
  - Use kebab-case for other files (e.g., `auth-form.svelte`, `tasks.js`).

## 2. Component Development
- **Structure components**:
  - Order sections as `<script>`, HTML markup, then `<style>` with a blank line between each for clarity.
  - Keep components small and focused to improve maintainability.
- **Use runes for reactivity** (Svelte 5):
  - Declare reactive state with `$state` (e.g., `let count = $state(0);`).
  - Use `$effect` for side effects that depend on reactive state (e.g., `$effect(() => console.log(count));`).
  - Use `$props` for component props (e.g., `let { value = $bindable() } = $props();` for two-way binding).
- **Avoid overusing `:global` in styles**:
  - Prefer scoped styles in `<style>` tags to prevent leakage.
  - Use CSS custom properties (e.g., `--color: #ddd;`) for themable styles instead of `:global`.

## 3. Code Style
- **Formatting**:
  - Use 2-space indentation for Svelte, HTML, and CSS.
  - Use Prettier and ESLint with the Svelte for VS Code extension for consistent formatting and linting.
- **Naming conventions**:
  - Use descriptive, lowercase variable names with hyphens for files (e.g., `user-profile.svelte`).
  - Use kebab-case for CSS classes (e.g., `button-primary`).
- **TypeScript**:
  - Prefer TypeScript or type-checked JavaScript for better IntelliSense and error catching.
  - Define prop types explicitly (e.g., `let { name: string } = $props();`).

## 4. Styling
- **Use Tailwind CSS** for a utility-first approach, importing components from `$lib/components/ui` if using libraries like Shadcn.
- **Color conventions**:
  - Use CSS variables for theming (e.g., `--primary: 222.2 47.4% 11.2%;` for HSL colors without color space functions).
  - Follow conventions like `--background`, `--foreground`, `--primary`, etc., for consistent theming.
- **Scoped styles**:
  - Leverage Svelte’s default scoped `<style>` tags to avoid style conflicts.
  - Use `class:directive` for dynamic classes (e.g., `<div class:featured={isFeatured}>`).

## 5. State Management
- **Use `$state` for simple reactive state** in components (e.g., `let counter = $state(0);`).
- **Complex state**:
  - Use classes for state machines (e.g., `class Counter { count = $state(0); increment() { this.count++; } }`).
  - Store global state in `src/lib/stores` using `$state` or Svelte’s built-in stores.
- **Auto-subscription**:
  - Use `$` prefix for reactive store values (e.g., `$toDoItems` for auto-updating UI).

## 6. Routing and Rendering
- **File-based routing**:
  - Use `src/routes/[slug]/+page.svelte` for dynamic routes.
  - Implement `+error.svelte` for error handling and `+layout.svelte` for shared layouts.
- **Optimize rendering**:
  - Use SvelteKit’s SSR and SSG capabilities for SEO and performance.
  - Enable prerendering for static pages with the `prerender` option, but disable it for pages with form actions.
- **Code splitting**:
  - Use dynamic imports for large components (e.g., `import('$lib/components/HeavyComponent.svelte')`).

## 7. Performance and Accessibility
- **Performance**:
  - Leverage Svelte’s compile-time optimizations and SvelteKit’s code splitting.
  - Use `{#key}` blocks for efficient re-rendering when data changes.
- **Accessibility**:
  - Use semantic HTML and ARIA attributes where needed.
  - Ensure keyboard navigation with `bind:this` for programmatic focus.
  - Set `lang` attributes in `app.html` for screen reader compatibility (e.g., `<html lang="en">`).

## 8. Testing
- **Write tests early**:
  - Use Playwright for server-rendered page testing and snapshot tests for UI changes.
  - Test components and stores individually.
- **Tools**:
  - Integrate ESLint and Prettier for linting and formatting.
  - Use the Svelte for VS Code extension for better syntax highlighting and IntelliSense.

## 9. Internationalization (i18n)
- Use **Paraglide.js** for i18n:
  - Install with `npm install @inlang/paraglide-js`.
  - Store language files in a `languages` directory and use the `t` function (e.g., `<h1>{t('welcome_message')}</h1>`).
- Support RTL layouts and text scaling for accessibility.

## 10. Best Practices
- **Keep it simple**:
  - Embrace Svelte’s philosophy of simplicity and avoid over-engineering.
  - Write declarative, functional code and avoid unnecessary classes except for state machines.
- **Use official resources**:
  - Refer to the Svelte 5 documentation and migration guide for runes and new syntax.
  - Use the Svelte REPL for prototyping and sharing code snippets.
- **Community and AI tools**:
  - Use the Svelte Discord for community support and the official `llms.txt` for AI-assisted coding with Svelte 5.
  - Share projects and tutorials to contribute to the Svelte community.

## 7. Implementation in Svelte

When implementing these UI design principles in Svelte:

- Use Svelte's scoped styles for component-specific styling
- Leverage CSS custom properties for theming and consistent styling
- Implement responsive design using Tailwind CSS utility classes or custom media queries
- Ensure all interactive elements are keyboard-navigable
- Use Svelte's built-in transitions for smooth, performant animations
- Follow the project's established patterns for component structure and organization