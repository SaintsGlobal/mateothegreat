# FD-014: Footer Redesign

## Overview
Update footer with gradient top border, social icon hover effects, and refined link styling.

## File
`src/components/layout/footer.tsx` (update existing)

## Current State
- bg-dark-alt background
- border-white/10 top border
- Social links with hover:scale-110
- hover colors vary by social platform (coral for YouTube/Instagram, cyan for Twitter)

## Requirements

### Top Border
- Replace solid border with gradient: `bg-gradient-to-r from-transparent via-violet-500/50 to-transparent`
- Height: 1px
- Full width

### Social Icons
- Hover: `scale-110` (keep) + violet glow `shadow-[0_0_12px_rgba(139,92,246,0.3)]`
- Transition: `transition-all duration-300`
- Unify hover color to violet instead of platform-specific colors

### Links
- Default: `text-white/40`
- Hover: `text-white transition-colors duration-200`

### Layout
- Keep existing flex layout
- Copyright text: `text-white/30 text-sm`

## Acceptance Criteria
- [ ] Gradient top border renders
- [ ] Social icons have violet glow on hover
- [ ] Links transition from muted to white
- [ ] `npm run typecheck` passes
