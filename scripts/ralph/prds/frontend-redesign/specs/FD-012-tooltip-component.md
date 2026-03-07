# FD-012: Tooltip Component

## Overview
Create a lightweight tooltip component with positioning and animation.

## File
`src/components/ui/Tooltip.tsx` (new)

## Dependencies
- FD-003 (Animation Utilities)

## Requirements

### Props
```typescript
interface TooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  delay?: number
}
```

### Styling
- Background: `bg-[#222222]`
- Border: `border border-white/10`
- Text: `text-sm text-white`
- Padding: `px-3 py-1.5`
- Border radius: `rounded-md`
- Arrow/caret pointing to trigger element
- Max width: `max-w-xs`
- Z-index: 50

### Animation
- Fade in + translateY(4px -> 0) for top/bottom
- Fade in + translateX(4px -> 0) for left/right
- Duration: 150ms
- Default delay: 200ms before showing

### Behavior
- Show on hover/focus
- Hide on mouse leave/blur
- Dismiss on Escape key

## Acceptance Criteria
- [ ] Shows on hover after delay
- [ ] All 4 positions work correctly
- [ ] Arrow points to trigger
- [ ] Smooth animation
- [ ] Accessible via keyboard focus
- [ ] `npm run typecheck` passes
