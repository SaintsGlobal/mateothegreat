# FAQ-005: Add ScrollReveal Stagger Animations to FAQ Page

## Overview
Per FD-026 spec, accordion items should animate in with ScrollReveal stagger. Currently no scroll animations are used.

## File
`src/app/faq/page.tsx` (update existing)

## Dependencies
- ScrollReveal component exists at `src/components/animation/ScrollReveal.tsx`
- ScrollRevealContainer for stagger support exists in the same file

## Requirements
- Wrap the FAQ accordion section in `ScrollRevealContainer` with stagger
- Each `AccordionItem` should be wrapped in `ScrollReveal` with `variant="fadeUp"`
- Page heading should also use ScrollReveal for entrance animation
- Respect `prefers-reduced-motion` (handled automatically by ScrollReveal)

## Acceptance Criteria
- [ ] Accordion items animate in with staggered fadeUp
- [ ] Page heading animates in on scroll/load
- [ ] Animations respect reduced motion preferences
- [ ] `npm run typecheck` passes
