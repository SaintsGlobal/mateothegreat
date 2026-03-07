# FD-009: Toggle/Switch Component

## Overview
Create an accessible toggle/switch component.

## File
`src/components/ui/Toggle.tsx` (new)

## Requirements

### Props
```typescript
interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}
```

### Styling
- Track off: `bg-[#333333]`
- Track on: `bg-violet-500` (#8b5cf6)
- Knob: white circle
- Sizes:
  - sm: track 36x20px, knob 16px
  - md: track 44x24px, knob 20px
- Transition: `transition-all duration-200`
- Knob slides with `translate-x`

### Accessibility
- `role="switch"`
- `aria-checked={checked}`
- `aria-label` from label prop
- Keyboard: Space/Enter to toggle
- Focus ring: `focus-visible:ring-2 focus-visible:ring-violet-500/50`

## Acceptance Criteria
- [ ] Toggles on click
- [ ] Visual state matches checked prop
- [ ] Smooth knob animation
- [ ] Keyboard accessible
- [ ] Disabled state works
- [ ] `npm run typecheck` passes
