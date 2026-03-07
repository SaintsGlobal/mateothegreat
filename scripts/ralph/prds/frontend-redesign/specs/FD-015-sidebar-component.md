# FD-015: Sidebar Component

## Overview
Create a collapsible sidebar for dashboard/profile layouts.

## File
`src/components/ui/Sidebar.tsx` (new)

## Dependencies
- FD-001 (Design Tokens)
- FD-003 (Animation Utilities)

## Requirements

### Props
```typescript
interface SidebarProps {
  items: {
    id: string
    label: string
    icon: React.ReactNode
    href?: string
    onClick?: () => void
  }[]
  activeItem?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}
```

### Styling
- Expanded width: 240px
- Collapsed width: 64px
- Background: `bg-[#111111]`
- Border right: `border-r border-white/[0.06]`
- Height: full viewport minus header

### Items
- Active: `bg-violet-500/10 text-violet-400 border-l-2 border-violet-500`
- Default: `text-white/60 hover:text-white hover:bg-white/5`
- Padding: `px-4 py-3`
- Icon + label layout with gap-3
- Label hidden when collapsed

### Section Dividers
- `border-t border-white/[0.06] my-2`

### Collapse Animation
- Width transition: `transition-all duration-300`
- Labels fade out on collapse
- Toggle button at bottom or top of sidebar

## Acceptance Criteria
- [ ] Renders with items and active state
- [ ] Collapses to icon-only mode
- [ ] Smooth width transition
- [ ] Active item has violet accent
- [ ] `npm run typecheck` passes
