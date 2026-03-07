# FD-017: Scroll Reveal Animations

## Overview
Create a ScrollReveal wrapper component that animates children into view on scroll.

## File
`src/components/animation/ScrollReveal.tsx` (new)

## Dependencies
- FD-003 (Animation Utilities - useScrollReveal hook, animation variants)

## Requirements

### Props
```typescript
interface ScrollRevealProps {
  children: React.ReactNode
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight'
  delay?: number
  duration?: number
  className?: string
  once?: boolean // default true - only animate once
}
```

### Animation Variants
- **fadeUp**: opacity 0->1, translateY 30px->0
- **fadeIn**: opacity 0->1
- **slideLeft**: opacity 0->1, translateX -30px->0
- **slideRight**: opacity 0->1, translateX 30px->0

### Implementation
- Uses Framer Motion `motion.div` with `whileInView`
- `viewport={{ once: true, margin: "-100px" }}` by default
- Uses `useReducedMotion` hook - if reduced motion preferred, render without animation
- Default duration: 0.5s
- Default easing: `[0.22, 1, 0.36, 1]` (custom ease-out)

### Stagger Support
- Export `ScrollRevealContainer` for staggering children
- Props: `staggerDelay?: number` (default 0.1s)
- Children animate sequentially

## Acceptance Criteria
- [ ] Elements animate into view on scroll
- [ ] All 4 variants work
- [ ] Respects prefers-reduced-motion
- [ ] Stagger container works with multiple children
- [ ] Only animates once by default
- [ ] `npm run typecheck` passes
