# FD-013: Navigation Header Redesign

## Overview
Update the existing header with enhanced glassmorphism, nav link animations, and mobile hamburger menu.

## File
`src/components/layout/header.tsx` (update existing)

## Dependencies
- FD-001 (Design Tokens)
- FD-002 (Dark Theme - ThemeToggle removed)
- FD-003 (Animation Utilities)

## Current State
- Fixed position with `bg-dark/80 backdrop-blur-sm`
- ThemeToggle component included
- No mobile menu
- Basic hover color transitions on nav links

## Requirements

### Glassmorphism Enhancement
- Background: `rgba(10, 10, 10, 0.8)` with `backdrop-blur-md` (upgrade from blur-sm)
- Border bottom: `border-b border-white/[0.06]` (subtler)
- Shadow: `shadow-lg shadow-black/20`

### Nav Link Animation
- Underline slide effect on hover: pseudo-element `::after` that scales from 0 to 1
- `after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-violet-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`
- Text: `text-white/60 hover:text-white transition-colors`

### Mobile Menu
- Hamburger icon button visible at `md:hidden`
- Slide-in menu from right or dropdown
- Background matches header glassmorphism
- Links stack vertically with spacing
- Close on link click or outside click

### Changes from Current
- Remove ThemeToggle import and usage (done in FD-002)
- Upgrade backdrop-blur-sm to backdrop-blur-md
- Add nav link underline animation
- Add mobile hamburger menu

## Acceptance Criteria
- [ ] Glassmorphism upgraded (blur-md, subtler border)
- [ ] Nav links have underline slide animation
- [ ] Mobile hamburger menu works
- [ ] ThemeToggle removed
- [ ] `npm run typecheck` passes
