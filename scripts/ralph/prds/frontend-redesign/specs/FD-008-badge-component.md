# FD-008: Badge/Pill Component

## Overview
Create a Badge component for status indicators, tags, and labels.

## File
`src/components/ui/Badge.tsx` (new)

## Requirements

### Props
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  children: React.ReactNode
}
```

### Variant Styles
- **default**: `bg-white/10 text-white/70 border-white/10`
- **success**: `bg-green-500/10 text-green-400 border-green-500/20`
- **warning**: `bg-amber-500/10 text-amber-400 border-amber-500/20`
- **error**: `bg-red-500/10 text-red-400 border-red-500/20`
- **info**: `bg-cyan-500/10 text-cyan-400 border-cyan-500/20`
- **accent**: `bg-violet-500/10 text-violet-400 border-violet-500/20`

### Sizes
- **sm**: `text-xs px-2 py-0.5`
- **md**: `text-sm px-2.5 py-1`

### Base Styles
- `inline-flex items-center gap-1 rounded-full border font-medium`

## Acceptance Criteria
- [ ] All 6 variants render correctly
- [ ] Both sizes work
- [ ] Optional icon renders before text
- [ ] `npm run typecheck` passes
