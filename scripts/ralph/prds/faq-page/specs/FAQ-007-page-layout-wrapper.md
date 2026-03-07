# FAQ-007: Use PageLayout Wrapper on FAQ Page

## Overview
The FAQ page uses raw divs for layout. It should use the reusable `PageLayout` component (FD-016) for consistency with other redesigned pages.

## File
`src/app/faq/page.tsx` (update existing)

## Dependencies
- PageLayout component exists at `src/components/layout/PageLayout.tsx`
- Provides: gradient background toggle, max-width container, scroll-to-top button

## Requirements
- Replace the outer `<div>` wrapper with `<PageLayout withGradientBg maxWidth="3xl">`
  - Note: PageLayout may not support "3xl". If not, use closest available (e.g., "2xl" or custom).
  - If "3xl" is needed, either use className override or add the size to PageLayout
- Remove the inline `GradientMesh` import since PageLayout handles it
- Remove manual z-10 positioning since PageLayout handles content z-indexing

## Acceptance Criteria
- [ ] FAQ page uses PageLayout wrapper
- [ ] GradientMesh background renders (via PageLayout prop)
- [ ] Scroll-to-top button appears when scrolling
- [ ] Layout is visually consistent with current design
- [ ] `npm run typecheck` passes
