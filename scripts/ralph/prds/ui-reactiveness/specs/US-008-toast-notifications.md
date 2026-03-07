# US-008: Toast Notifications

## Description

As a user, I want toast notifications to slide in smoothly.

## Acceptance Criteria

- [ ] Toast enters with quick slide + fade
- [ ] Auto-dismiss has smooth exit
- [ ] Manual dismiss is instant
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Toast.tsx`:

- Entry: slide from right + fade, `duration-150`
- Auto-dismiss exit: `duration-200`
- Manual dismiss: `duration-75`
