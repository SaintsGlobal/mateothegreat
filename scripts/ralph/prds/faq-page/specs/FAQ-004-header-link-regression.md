# FAQ-004: Restore FAQ Link in Header Navigation

## Overview
The FAQ link was removed from the header during the FD-013 header redesign. It must be restored.

## File
`src/components/layout/header.tsx` (update existing)

## Current State
The `navLinks` array only contains: Home, About, Exclusive, Contact.
FAQ link was previously added by FAQ-003 but was overwritten.

## Requirements
- Add `{ href: "/faq", label: "FAQ" }` to the `navLinks` array
- Position between Exclusive and Contact (content links before auth)
- Both desktop and mobile navigation use `navLinks`, so only one change is needed

## Acceptance Criteria
- [ ] FAQ link appears in header navigation (desktop and mobile)
- [ ] Link navigates to /faq
- [ ] `npm run typecheck` passes
