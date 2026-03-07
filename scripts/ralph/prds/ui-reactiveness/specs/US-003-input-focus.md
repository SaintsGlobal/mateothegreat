# US-003: Input Focus States

## Description

As a user, I want form inputs to clearly indicate when they're focused.

## Acceptance Criteria

- [ ] Focus state transitions in under 100ms
- [ ] Border glow appears smoothly on focus
- [ ] Placeholder text fades appropriately
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/input.tsx`:

- Use `duration-100` for focus transitions
- Add glow effect using tokens from `glows.violetSubtle`
- Placeholder should fade with `placeholder:transition-opacity`
