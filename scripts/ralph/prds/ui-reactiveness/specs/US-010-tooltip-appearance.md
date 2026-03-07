# US-010: Tooltip Appearance

## Description

As a user, I want tooltips to appear quickly without delay.

## Acceptance Criteria

- [ ] Tooltip appears within 100ms of hover
- [ ] Fade-in is quick but not jarring
- [ ] Disappears instantly on mouse leave
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Tooltip.tsx`:

- Entry delay: 100ms (or configurable)
- Fade-in: `duration-75`
- Exit: `duration-50` or instant
