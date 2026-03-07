# FD-030: Skeleton Loading Component

## Overview
Create skeleton placeholder components with shimmer animation.

## File
`src/components/ui/Skeleton.tsx` (new)

## Requirements

### Props
```typescript
interface SkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button'
  width?: string
  height?: string
  className?: string
}
```

### Styling
- Base: `bg-white/[0.06] rounded`
- Shimmer: animated gradient sweep left-to-right
- Shimmer gradient: `from-transparent via-white/[0.08] to-transparent`
- Animation: `@keyframes shimmer` translateX(-100% -> 100%), 1.5s infinite

### Variants
- **text**: height 16px, full width, rounded
- **card**: height 200px, full width, rounded-xl
- **avatar**: 48x48px circle
- **button**: height 40px, width 120px, rounded-lg

## Acceptance Criteria
- [ ] All 4 variants render correctly
- [ ] Shimmer animation is smooth
- [ ] Custom width/height overrides work
- [ ] CSS-only (no JS animation library needed)
- [ ] `npm run typecheck` passes
