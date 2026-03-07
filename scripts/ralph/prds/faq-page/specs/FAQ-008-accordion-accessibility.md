# FAQ-008: Accordion Accessibility Improvements

## Overview
The Accordion component is missing several ARIA attributes and keyboard interaction patterns for proper accessibility.

## File
`src/components/ui/accordion.tsx` (update existing)

## Requirements
- Add unique `id` attributes to each accordion button and content panel
- Add `aria-controls` on buttons pointing to their content panel id
- Add `id` on content panels matching the `aria-controls` value
- Add `role="region"` on content panels with `aria-labelledby` pointing to button id
- Ensure Enter and Space keys toggle accordion items (button element handles this natively)

## Implementation Notes
- Use `useId()` from React to generate unique ids
- Button elements already handle Enter/Space natively, so no extra keyboard code needed
- The `aria-expanded` attribute is already present

## Acceptance Criteria
- [ ] Buttons have `aria-controls` pointing to content panel
- [ ] Content panels have `id` and `role="region"` with `aria-labelledby`
- [ ] Keyboard navigation works (Enter/Space to toggle)
- [ ] `npm run typecheck` passes
