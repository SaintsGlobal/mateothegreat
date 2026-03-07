# FD-033: Reduced Motion Support

## Overview
Ensure all animation components respect prefers-reduced-motion media query.

## Files
- `src/hooks/useReducedMotion.ts` (verify/update)
- All animation components (ScrollReveal, Parallax, ParticleBackground, GradientMesh, PageTransition)

## Dependencies
- FD-003 (useReducedMotion hook)
- All animation components (FD-017 to FD-022)

## Requirements
- useReducedMotion hook returns boolean
- All animation components check the hook
- When reduced motion preferred:
  - ScrollReveal: render children immediately (no animation)
  - Parallax: render children without parallax effect
  - ParticleBackground: render static or hidden
  - GradientMesh: render static (no blob drift animation)
  - PageTransition: instant page changes
  - Hover effects: keep subtle transitions but remove transforms

## Acceptance Criteria
- [ ] useReducedMotion hook works correctly
- [ ] All animation components have reduced-motion fallback
- [ ] No forced animations when user prefers reduced motion
- [ ] `npm run typecheck` passes
