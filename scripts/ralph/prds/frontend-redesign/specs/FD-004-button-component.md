# FD-004: Button Component Redesign

## Description

As a user, I want buttons with gradient backgrounds, glow effects, and smooth hover animations.

## Acceptance Criteria

- [ ] Create/update src/components/ui/Button.tsx
- [ ] Variants: primary (violet gradient #8b5cf6 to #6366f1), secondary (ghost), outline, danger
- [ ] Primary button has box-shadow glow on hover (0 0 20px rgba(139,92,246,0.4))
- [ ] Add scale(0.98) transform on click/active state
- [ ] Add loading prop with spinner icon
- [ ] Add disabled state with reduced opacity
- [ ] Smooth transitions (200ms ease-out)
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

## Existing State

- src/components/ui/button.tsx exists with primary/secondary variants
- Currently uses coral (#FF7593) - replace with violet (#8b5cf6)
