# FD-031: Toast Notification System

## Overview
Create a toast notification system with slide-in animation and auto-dismiss.

## Files
- `src/components/ui/Toast.tsx` (new)
- `src/hooks/useToast.ts` (new)

## Dependencies
- FD-003 (Animation Utilities)

## Requirements

### Toast Component Props
```typescript
interface ToastProps {
  id: string
  variant: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number // default 5000ms
  onDismiss: (id: string) => void
}
```

### useToast Hook
```typescript
function useToast(): {
  toasts: ToastProps[]
  addToast: (opts: Omit<ToastProps, 'id' | 'onDismiss'>) => void
  removeToast: (id: string) => void
}
```

### Variant Styles
- **success**: left border green-500, icon checkmark
- **error**: left border red-500, icon X
- **warning**: left border amber-500, icon warning triangle
- **info**: left border violet-500, icon info circle

### Styling
- Background: `bg-[#1a1a1a]` with `border border-white/10`
- Left border: 3px solid variant color
- Position: fixed bottom-right (`bottom-4 right-4`)
- Stack: newest on bottom, gap-2 between toasts
- Max visible: 5

### Animation
- Slide in from right: translateX(100%) -> 0
- Slide out on dismiss: translateX(0) -> translateX(100%)
- Duration: 200ms

### Auto-dismiss
- Progress bar at bottom showing remaining time
- Pause timer on hover
- Resume on mouse leave

## Acceptance Criteria
- [ ] All 4 variants render correctly
- [ ] Auto-dismiss after duration
- [ ] Slide in/out animation
- [ ] Multiple toasts stack
- [ ] Hover pauses auto-dismiss
- [ ] `npm run typecheck` passes
