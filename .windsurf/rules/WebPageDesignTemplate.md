---
trigger: always_on
---

# Web Page Design Template

This document outlines the standards and guidelines for designing and implementing web pages in our application. Use this template to communicate design intent, structure, and behavior for any page or component.

## 1. Visual References

### Required Assets
- [ ] Mockups (PNG/JPG)
- [ ] Figma/XD links (if available)
- [ ] Design system documentation
- [ ] Color palette
- [ ] Typography scale

### Layout Structure
```
[Header]
- Logo (left)
- Navigation (center)
- User menu (right)

[Hero Section]
- Headline
- Subtitle
- CTA buttons
- Background/Image

[Content Sections]
- Grid layout (specify columns)
- Card components
- Spacing between sections

[Footer]
- Links
- Copyright
- Additional navigation
```

## 2. Component Specifications

### Buttons
```markdown
## Primary Button
- **States**: Default, Hover, Active, Disabled, Loading
- **Colors**: 
  - Background: `bg-blue-600` (hover: `bg-blue-700`)
  - Text: White
- **Padding**: `py-2 px-4`
- **Border Radius**: `rounded-md`
- **Transition**: `transition-colors duration-200`

## Secondary Button
- [Similar structure as above]
```

### Forms
- Input fields
- Validation states
- Error messages
- Success states
- Loading indicators

## 3. Responsive Behavior

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

### Responsive Patterns
- Navigation collapse to hamburger on mobile
- Stacked cards on mobile → Grid on desktop
- Adjusted font sizes
- Responsive images

## 4. Interactions & Animations

### Micro-interactions
- Button hover/click effects
- Form field focus states
- Loading spinners
- Toast notifications

### Page Transitions
- Fade in/out: 300ms ease-in-out
- Page load animations
- Scroll-based animations

## 5. Accessibility Requirements

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Visible focus states
- [ ] Skip to main content link

### ARIA
- [ ] Proper roles and labels
- [ ] Live regions for dynamic content
- [ ] Error message associations

## 6. Performance Guidelines

### Asset Optimization
- [ ] Images in WebP format with fallbacks
- [ ] Lazy loading for below-the-fold content
- [ ] Proper image dimensions
- [ ] Font loading strategy

### Code Optimization
- [ ] Code splitting implemented
- [ ] Lazy loading for non-critical components
- [ ] Tree-shaking in place

## 7. Testing Requirements

### Devices
- [ ] Mobile (iPhone/Android)
- [ ] Tablet (iPad/Android)
- [ ] Desktop (Chrome, Firefox, Safari, Edge)

### Test Cases
- [ ] Form validation
- [ ] Error states
- [ ] Loading states
- [ ] Empty states
- [ ] Offline behavior

## 8. Implementation Notes

### Component Structure (Svelte)
```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  
  // 2. Props
  export let initialValue = '';
  
  // 3. State
  let value = $state(initialValue);
  
  // 4. Methods
  function handleSubmit() {
    // Handle submission
  }
</script>

<!-- 5. Template -->
<div class="component">
  <!-- Content -->
</div>

<!-- 6. Styles -->
<style>
  .component {
    /* Styles */
  }
</style>
```

### File Organization
```
src/
  components/
    common/         # Reusable components
    features/       # Feature-specific components
  lib/
    utils/         # Utility functions
    constants/     # Constants and enums
  routes/
    [route]/      # Route-specific components
      +page.svelte
      +page.server.ts
  app.html
  app.d.ts
```

## 9. Do's and Don'ts

### Do
- ✅ Use semantic HTML elements
- ✅ Implement proper error boundaries
- ✅ Add loading states for async operations
- ✅ Follow WCAG accessibility guidelines
- ✅ Optimize for performance

### Don't
- ❌ Use inline styles
- ❌ Nest components too deeply
- ❌ Include large dependencies unnecessarily
- ❌ Ignore browser compatibility

## 10. Review Checklist

### Design Review
- [ ] Matches mockups
- [ ] Responsive behavior correct
- [ ] Animations smooth and performant
- [ ] Accessibility requirements met

### Code Review
- [ ] Follows project structure
- [ ] Type-safe (TypeScript)
- [ ] Proper error handling
- [ ] Performance optimizations in place

---

*Last Updated: 2025-05-25*
