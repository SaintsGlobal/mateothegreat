# US-011: Tab Switching

## Description

As a user, I want tab switching to feel instantaneous.

## Acceptance Criteria

- [ ] Active indicator moves with spring physics
- [ ] Content swap has no perceptible delay
- [ ] Hover state on tabs is instant
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Tabs.tsx`:

- Indicator movement: spring easing, `duration-200`
- Tab hover: `duration-50`
- Content: no transition (instant swap)
