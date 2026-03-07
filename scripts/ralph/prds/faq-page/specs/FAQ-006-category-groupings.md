# FAQ-006: FAQ Category Groupings with Section Headings

## Overview
Per FD-026 spec, FAQs should be organized into category groupings with section headings.

## File
`src/app/faq/page.tsx` (update existing)

## Requirements
- Organize the 6 existing FAQ items into 2-3 logical categories
- Suggested categories:
  - "About Mateo" (Who is Mateo, What kind of content)
  - "Getting Started" (How to stay updated, Is content beginner-friendly)
  - "Community" (How to support, Can I suggest topics)
- Each category gets a section heading styled consistently with the dark theme
- Section heading: `text-lg font-semibold text-white/80` with `mt-8 mb-4` spacing
- Each category should have its own Accordion wrapper with dark styling

## Acceptance Criteria
- [ ] FAQs organized into at least 2 categories
- [ ] Each category has a visible section heading
- [ ] Dark styling consistent across all category accordions
- [ ] `npm run typecheck` passes
