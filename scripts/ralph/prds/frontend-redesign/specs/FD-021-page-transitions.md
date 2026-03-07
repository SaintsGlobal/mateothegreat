# FD-021: Page Transition Animations

## Overview
Add smooth fade transitions between page navigations using Framer Motion.

## File
`src/components/animation/PageTransition.tsx` (new)
Update `src/app/layout.tsx` to wrap children

## Dependencies
- FD-003 (Animation Utilities)

## Requirements

### Implementation
- Wrap page content in Framer Motion `AnimatePresence` + `motion.div`
- Transition: fade in/out with subtle translateY
- Enter: opacity 0 -> 1, translateY 8px -> 0, duration 300ms
- Exit: opacity 1 -> 0, translateY 0 -> -8px, duration 200ms
- Must work with Next.js App Router

### Considerations
- Next.js App Router does not natively support AnimatePresence exit animations
- Use a client-side wrapper component that keys on pathname
- Import `usePathname` from `next/navigation`
- Respect prefers-reduced-motion

## Acceptance Criteria
- [ ] Pages fade in on navigation
- [ ] Smooth transition between routes
- [ ] Works with Next.js App Router
- [ ] Respects prefers-reduced-motion
- [ ] `npm run typecheck` passes
