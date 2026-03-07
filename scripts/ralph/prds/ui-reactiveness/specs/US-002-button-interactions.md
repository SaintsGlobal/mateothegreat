# US-002: Button Micro-interactions

## Description

As a user, I want buttons to respond immediately when I hover or click them.

## Acceptance Criteria

- [ ] Hover state appears within 50ms
- [ ] Click/active state shows instant scale feedback
- [ ] Focus ring appears immediately on keyboard navigation
- [ ] Add subtle brightness shift on hover
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/button.tsx`:

- Change `duration-200` to `duration-100` or `duration-75`
- Add `hover:brightness-110` for subtle feedback
- Ensure `active:scale-[0.98]` triggers immediately
- Focus ring should use `duration-75`
