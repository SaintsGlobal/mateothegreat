# FD-022: Hover Micro-interactions

## Overview
Add consistent hover micro-interactions as utility classes and component defaults.

## File
Update `src/app/globals.css` with utility classes

## Dependencies
- FD-001 (Design Tokens)

## Requirements

### Button Interactions
- Hover: `scale(1.02)` with 200ms ease-out
- Active/press: `scale(0.98)` with 100ms
- Already handled in FD-004 Button component

### Card Interactions
- Hover: `translateY(-4px)` + increased shadow
- Shadow: `shadow-lg shadow-black/20`
- Already handled in FD-007 Card component

### Link Interactions
- Underline slide: scale-x from 0 to 1 on pseudo-element
- Define as `.link-hover-slide` utility class

### CSS Utility Classes (add to globals.css)
```css
.hover-lift {
  @apply transition-transform duration-200;
}
.hover-lift:hover {
  @apply -translate-y-1;
}

.hover-scale {
  @apply transition-transform duration-200;
}
.hover-scale:hover {
  @apply scale-[1.02];
}

.hover-glow-violet {
  @apply transition-shadow duration-300;
}
.hover-glow-violet:hover {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

.link-hover-slide {
  @apply relative;
}
.link-hover-slide::after {
  content: '';
  @apply absolute bottom-0 left-0 h-[2px] w-full bg-violet-500 origin-left scale-x-0 transition-transform duration-300;
}
.link-hover-slide:hover::after {
  @apply scale-x-100;
}
```

## Acceptance Criteria
- [ ] Utility classes defined in globals.css
- [ ] hover-lift, hover-scale, hover-glow-violet, link-hover-slide all work
- [ ] Can be applied to any element
- [ ] `npm run typecheck` passes
