# FD-029: Dashboard/Profile Pages Redesign

## Overview
Redesign profile and account pages with sidebar layout and animated stat cards.

## Files
- `src/app/profile/page.tsx` (update)
- `src/app/profile/profile-layout.tsx` (update)
- `src/app/account/page.tsx` (update)
- `src/app/account/account-forms.tsx` (update)

## Dependencies
- FD-007 (Card), FD-015 (Sidebar)

## Requirements
- Use Sidebar component for navigation (Profile, Preferences, Billing, Invoices)
- Stat cards with subtle animations (count up, fade in)
- Replace brand-cyan active states with violet
- Tables with dark styling: bg-[#111111], border-white/[0.06]
- Card components with glassmorphism
- Consistent violet accent across all interactive elements

## Acceptance Criteria
- [ ] Sidebar navigation works
- [ ] Cards use glassmorphism
- [ ] Violet accent on active/interactive elements
- [ ] Tables have dark styling
- [ ] `npm run typecheck` passes
