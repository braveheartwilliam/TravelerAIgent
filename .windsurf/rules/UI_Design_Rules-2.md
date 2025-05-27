---
trigger: always_on
---

## 1. Foreground and Background Color Design Standards

Color choices impact usability, accessibility, and brand perception. Follow these standards:

- **Color Palette**:
  - Create a cohesive palette with 1-2 primary brand colors and complementary neutral tones (e.g., white, black, gray).
  - Use monochromatic variations (adjusting saturation and brightness) for consistency and simplicity.
  - Tools like Coolors or Canva can help generate accessible color combinations.
- **Contrast Ratios**:
  - Ensure a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (18px or 14px bold) to meet WCAG AA standards.
  - Use tools like WebAIM Contrast Checker or Stark Plugin to verify contrast ratios.
  - Avoid low-contrast combinations (e.g., light gray on white) to ensure readability for users with low vision.
- **Foreground and Background**:
  - Use dark text on light backgrounds or light text on dark backgrounds for optimal readability. Avoid complex backgrounds (e.g., gradients) under text unless blurred to reduce visual noise.
  - For dark mode, invert text colors (e.g., white text on dark backgrounds) and simplify color schemes to maintain contrast.
- **Color Usage**:
  - Use brand colors for interactive elements (e.g., buttons, links) to enhance discoverability.
  - Avoid relying solely on color to convey information (e.g., use icons or text for error states).
  - Use traffic light metaphors (red for errors, green for success) to reinforce status messages.
- **Branding**:
  - Align colors with brand identity to build recognition. For example, use a single brand color for primary actions (e.g., Spotify's green buttons).
  - Ensure colors evoke the desired mood (e.g., blue for trust, red for urgency).


## 2. UI Design Rules

These rules ensure interfaces are intuitive, accessible, and efficient:

- **Component Consistency**:
  - Standardize UI components (e.g., buttons, forms, icons) across the interface. For example, buttons should have consistent size, shape, and hover effects.
  - Use a style guide to document components, including typography, colors, and spacing.
- **Interactive Elements**:
  - Ensure buttons are easily recognizable (e.g., wider than tall, with 30px vertical padding and 60px horizontal padding).
  - Provide hover, focus, and active states for interactive elements to give feedback.
  - Underline links or use distinct colors (e.g., blue) to differentiate them from regular text.
- **Accessibility**:
  - Support keyboard navigation for all interactive elements.
  - Provide text alternatives for images, icons, and videos (e.g., alt text, captions).
  - Ensure form fields have clear labels and error messages are descriptive.
- **Performance**:
  - Optimize images (JPEG for photos, PNG for simple graphics, SVG for logos) and enable lazy loading to reduce page load times.
  - Minimize animations to avoid performance issues, especially on mobile devices.
- **Testing and Iteration**:
  - Conduct usability testing to ensure the interface meets user needs. Iterate based on feedback to address pain points.
  - Use tools like Lighthouse to check accessibility and performance.


## 3. Implementation in Svelte

When implementing these UI design principles in Svelte:

- Use Svelte's scoped styles for component-specific styling
- Leverage CSS custom properties for theming and consistent styling
- Implement responsive design using Tailwind CSS utility classes or custom media queries
- Ensure all interactive elements are keyboard-navigable
- Use Svelte's built-in transitions for smooth, performant animations
- Follow the project's established patterns for component structure and organization