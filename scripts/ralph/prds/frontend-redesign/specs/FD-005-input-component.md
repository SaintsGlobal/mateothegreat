# FD-005: Input Component Redesign

## Overview
Update the existing Input component with icon support, violet focus states, and enhanced error handling.

## File
`src/components/ui/input.tsx` (update existing)

## Requirements

### Props
- All existing props preserved
- `leftIcon?: React.ReactNode` - Icon rendered inside input on the left
- `rightIcon?: React.ReactNode` - Icon rendered inside input on the right
- `error?: string` - Error message (existing)
- `label?: string` - Label text (existing)

### Styling
- Background: `bg-[#1a1a1a]`
- Border default: `border-white/10`
- Border focus: `border-violet-500` (#8b5cf6) with glow `ring-2 ring-violet-500/20`
- Border error: `border-red-500` (#ef4444) with `ring-2 ring-red-500/20`
- Placeholder: `text-white/40`
- Text: white
- Padding adjusted for icons: `pl-10` when leftIcon, `pr-10` when rightIcon
- Rounded: `rounded-lg`
- Transition: `transition-all duration-200`

### Icon Positioning
- Left icon: `absolute left-3 top-1/2 -translate-y-1/2 text-white/40`
- Right icon: `absolute right-3 top-1/2 -translate-y-1/2 text-white/40`
- Icons inherit focus color when input is focused

### States
- Default: subtle border
- Focused: violet border + glow
- Error: red border + glow + error message below
- Disabled: `opacity-50 cursor-not-allowed`

## Acceptance Criteria
- [ ] leftIcon and rightIcon props work correctly
- [ ] Focus state shows violet border with glow
- [ ] Error state shows red border with message
- [ ] Disabled state reduces opacity
- [ ] `npm run typecheck` passes
