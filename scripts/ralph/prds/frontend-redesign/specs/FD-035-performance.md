# FD-035: Performance Optimization

## Overview
Audit and optimize all animations and effects for smooth 60fps performance.

## Requirements

### Animation Audit
- Ensure all animations use transform/opacity only (no layout-triggering properties)
- Add `will-change: transform` hints where appropriate
- Remove will-change after animation completes

### Lazy Loading
- Lazy import ParticleBackground (heavy dependency)
- Lazy import GradientMesh when used as optional background
- Use `next/dynamic` with `{ ssr: false }` for client-only animation components

### Mobile Optimization
- Reduce particle count on mobile (< 768px): max 20 particles
- Simplify or disable gradient mesh on low-end devices
- Reduce blur radius on mobile for performance

### Targets
- Lighthouse Performance score > 90
- No layout shifts from animations (CLS = 0)
- First Contentful Paint < 1.5s

## Acceptance Criteria
- [ ] All animations use transform/opacity only
- [ ] Heavy components are lazy loaded
- [ ] Mobile has reduced particle count
- [ ] Lighthouse Performance > 90
- [ ] `npm run typecheck` passes
