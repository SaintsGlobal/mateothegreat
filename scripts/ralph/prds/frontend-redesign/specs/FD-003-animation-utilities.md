# FD-003: Animation Utilities

## Description

As a developer, I need reusable animation utilities for consistent motion.

## Acceptance Criteria

- [ ] Install framer-motion: `npm install framer-motion`
- [ ] Create src/lib/animations.ts with Framer Motion variants
- [ ] Add variants: fadeIn, fadeUp, slideInLeft, slideInRight, scaleIn
- [ ] Add staggerContainer variant for staggered children
- [ ] Create useScrollReveal hook using Intersection Observer
- [ ] Hook returns ref and isVisible boolean
- [ ] Add useReducedMotion hook to check prefers-reduced-motion
- [ ] npm run typecheck passes

## Variant Definitions

```typescript
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
```
