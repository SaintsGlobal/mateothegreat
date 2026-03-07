# US-012: Sidebar Transitions

## Description

As a user, I want sidebar expand/collapse to be smooth.

## Acceptance Criteria

- [ ] Expand/collapse under 200ms
- [ ] Icons and text animate together
- [ ] No content jump during transition
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/Sidebar.tsx`:

- Width transition: `duration-200` with ease-out
- Icons: no transition (stay in place)
- Text: fade in/out `duration-100`
