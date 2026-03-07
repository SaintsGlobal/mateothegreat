# FD-011: Tabs Component

## Overview
Create a Tabs component with animated active indicator.

## File
`src/components/ui/Tabs.tsx` (new)

## Dependencies
- FD-001 (Design Tokens)
- FD-003 (Animation Utilities)

## Requirements

### Props
```typescript
interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[]
  activeTab: string
  onChange: (id: string) => void
  children: React.ReactNode
}
```

### Styling
- Tab bar background: `bg-[#111111]` with `rounded-lg p-1`
- Tab button: `px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors`
- Active tab: `text-white bg-white/10 rounded-md`
- Active indicator: animated underline or background slide using CSS transition
- Icon + label layout: `flex items-center gap-2`

### Animation
- Active tab indicator slides between tabs (transform translateX)
- Duration: 200ms ease-out

## Acceptance Criteria
- [ ] Renders tab bar with labels
- [ ] Active tab visually distinct
- [ ] Clicking tab triggers onChange
- [ ] Icon support works
- [ ] Smooth indicator animation
- [ ] `npm run typecheck` passes
