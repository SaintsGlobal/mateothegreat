# FD-028: Auth Pages Redesign

## Overview
Redesign sign-in, sign-up, and forgot-password pages with glassmorphism cards and violet accents.

## Files
- `src/app/signin/page.tsx` (update)
- `src/app/signup/page.tsx` (update)
- `src/app/forgot-password/page.tsx` (update)

## Dependencies
- FD-004 (Button), FD-005 (Input), FD-007 (Card)

## Requirements
- Centered Card with glassmorphism styling
- Input fields use violet focus states
- Button uses violet gradient
- GradientMesh background behind card (subtle)
- Replace brand-coral error colors with red-500
- Replace brand-cyan focus with violet-500
- Link styling: violet-400 hover

## Acceptance Criteria
- [ ] All 3 auth pages use glassmorphism Card
- [ ] Inputs have violet focus glow
- [ ] Buttons use violet gradient
- [ ] `npm run typecheck` passes
