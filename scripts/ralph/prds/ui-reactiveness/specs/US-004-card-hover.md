# US-004: Card Hover Effects

## Description

As a user, I want cards to subtly respond when I hover over them.

## Acceptance Criteria

- [ ] Subtle lift/shadow on hover under 100ms
- [ ] Border highlight appears instantly
- [ ] No layout shift during hover
- [ ] Typecheck passes

## Implementation Notes

Update `src/components/ui/card.tsx`:

- Add `hover:-translate-y-0.5` for subtle lift
- Use `transition-all duration-100`
- Border: `hover:border-white/20`
- Use `transform` to avoid layout shift
