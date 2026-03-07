# FD-026: FAQ Page Redesign

## Overview
Redesign the FAQ page with dark-styled accordion and scroll reveal animations.

## File
`src/app/faq/page.tsx` (update existing)
May update `src/components/ui/accordion.tsx`

## Dependencies
- FD-017 (ScrollReveal)

## Requirements
- Accordion items wrapped in ScrollReveal with stagger
- Accordion styling updated: bg-[#111111], border-white/[0.06]
- Accordion hover on trigger: text-violet-400 (replace coral)
- Category groupings with section headings
- Gradient text on page heading

## Acceptance Criteria
- [ ] Accordion items animate in with stagger
- [ ] Dark styling on accordion
- [ ] Violet hover color on triggers
- [ ] `npm run typecheck` passes
