# FD-010: Modal/Dialog Component

## Overview
Create a modal/dialog component with glassmorphism styling and animations.

## File
`src/components/ui/Modal.tsx` (new)

## Dependencies
- FD-001 (Design Tokens)
- FD-003 (Animation Utilities)
- FD-007 (Card/Glassmorphism for body styling)

## Requirements

### Props
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}
```

### Overlay
- Background: `bg-black/60`
- Backdrop filter: `backdrop-blur-sm`
- Click to close
- Fade in/out animation

### Modal Body
- Background: `rgba(17, 17, 17, 0.9)` with `backdrop-blur-md`
- Border: `border border-white/10`
- Border radius: `rounded-xl`
- Sizes: sm (max-w-sm), md (max-w-md), lg (max-w-lg)
- Centered vertically and horizontally

### Animation
- Enter: scale(0.95) + opacity(0) -> scale(1) + opacity(1), 200ms ease-out
- Exit: scale(1) + opacity(1) -> scale(0.95) + opacity(0), 150ms ease-in

### Header
- Title with `text-lg font-semibold text-white`
- Close button (X) top-right with `text-white/40 hover:text-white`
- Bottom border: `border-b border-white/10`

### Accessibility
- Focus trap (tab cycling within modal)
- Escape key closes
- `role="dialog"` + `aria-modal="true"`
- `aria-labelledby` for title
- Scroll lock on body when open

## Acceptance Criteria
- [ ] Opens and closes with animation
- [ ] Overlay click closes
- [ ] Escape key closes
- [ ] Focus trap works
- [ ] Body scroll locked when open
- [ ] All three sizes work
- [ ] `npm run typecheck` passes
