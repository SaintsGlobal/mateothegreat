# FD-018: Parallax Effect Component

## Overview
Create a Parallax wrapper that creates depth through differential scroll speeds.

## File
`src/components/animation/Parallax.tsx` (new)

## Dependencies
- FD-003 (Animation Utilities - useReducedMotion)

## Requirements

### Props
```typescript
interface ParallaxProps {
  children: React.ReactNode
  speed?: number // default 0.5, range 0-2
  className?: string
}
```

### Implementation
- Uses Framer Motion `useScroll` and `useTransform`
- `speed` controls parallax intensity:
  - 0 = no movement
  - 0.5 = moves at half scroll speed (default)
  - 1 = moves at scroll speed
  - 1.5 = moves faster than scroll
- Transform: `translateY` based on scroll progress * speed factor
- Uses `useReducedMotion` - if reduced motion, render static (no parallax)

### Performance
- Uses `will-change: transform` on the animated element
- GPU-accelerated via transform only (no layout triggers)

## Acceptance Criteria
- [ ] Content moves at different speed than scroll
- [ ] Speed prop adjusts parallax intensity
- [ ] Respects prefers-reduced-motion
- [ ] Smooth performance (no jank)
- [ ] `npm run typecheck` passes
