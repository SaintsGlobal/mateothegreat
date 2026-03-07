# FD-006: Select/Dropdown Component

## Overview
Create a custom Select/Dropdown component with dark styling and smooth animations.

## File
`src/components/ui/Select.tsx` (new)

## Dependencies
- FD-001 (Design Tokens)
- FD-003 (Animation Utilities) - for open/close animation

## Requirements

### Props
```typescript
interface SelectProps {
  options: { value: string; label: string; disabled?: boolean }[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}
```

### Styling
- Trigger: Same styling as Input (bg #1a1a1a, border white/10, rounded-lg)
- Dropdown panel: `bg-[#1a1a1a]` with `border border-white/10 rounded-lg shadow-xl`
- Option hover: `bg-[#222222]`
- Option selected: `bg-violet-500/10 text-violet-400`
- Chevron icon rotates on open
- Max height with scroll: `max-h-60 overflow-y-auto`

### Animation
- Scale + fade on open: `scale-95 opacity-0` -> `scale-100 opacity-100`
- Duration: 150ms ease-out
- Use Framer Motion AnimatePresence if available, CSS fallback otherwise

### Accessibility
- `role="listbox"` on dropdown
- `role="option"` on items
- `aria-expanded` on trigger
- Keyboard: Arrow keys to navigate, Enter to select, Escape to close

## Acceptance Criteria
- [ ] Renders with placeholder when no value
- [ ] Opens dropdown on click
- [ ] Selects option and closes on click
- [ ] Hover state on options
- [ ] Keyboard navigation works
- [ ] Error state displays
- [ ] `npm run typecheck` passes
