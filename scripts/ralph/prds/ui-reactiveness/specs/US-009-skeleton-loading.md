# US-009: Skeleton Loading States

## Description

As a user, I want skeleton loaders to feel alive, not frozen.

## Acceptance Criteria

- [ ] Pulse animation is smooth 60fps
- [ ] Transition to real content is seamless
- [ ] No jarring flash when content loads
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Skeleton.tsx`:

- Pulse: use CSS animation, 1.5s cycle
- Content transition: fade-in `duration-200`
- Consider shimmer effect for premium feel
