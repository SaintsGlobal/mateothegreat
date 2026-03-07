# US-006: Select/Dropdown Transitions

## Description

As a user, I want dropdowns to open and close smoothly but quickly.

## Acceptance Criteria

- [ ] Dropdown opens within 100ms
- [ ] Options highlight instantly on hover
- [ ] Close animation doesn't feel slow
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Select.tsx`:

- Open animation: `duration-100` with slight scale
- Option hover: `duration-50`
- Close: same as open or slightly faster
