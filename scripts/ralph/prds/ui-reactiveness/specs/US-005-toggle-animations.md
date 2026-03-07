# US-005: Toggle/Switch Animations

## Description

As a user, I want toggles to feel responsive and satisfying.

## Acceptance Criteria

- [ ] Toggle thumb moves with spring physics
- [ ] State change feels immediate
- [ ] Color transition is smooth but quick
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Toggle.tsx`:

- Use spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Thumb movement: `duration-150`
- Background color: `duration-100`
