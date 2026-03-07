# US-007: Modal Transitions

## Description

As a user, I want modals to appear and disappear without delay.

## Acceptance Criteria

- [ ] Modal fade-in under 150ms
- [ ] Backdrop appears simultaneously
- [ ] Close feels instant
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Modal.tsx`:

- Entry: fade + slight scale, `duration-150`
- Backdrop: fade `duration-100`
- Exit: `duration-100` (faster than entry)
