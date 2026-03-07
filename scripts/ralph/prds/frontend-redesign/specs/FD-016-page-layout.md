# FD-016: Page Layout Wrapper

## Overview
Create a reusable page layout wrapper with optional gradient background and scroll-to-top.

## File
`src/components/layout/PageLayout.tsx` (new)

## Dependencies
- FD-020 (GradientMesh - optional background)

## Requirements

### Props
```typescript
interface PageLayoutProps {
  children: React.ReactNode
  withGradientBg?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl' | '7xl'
  className?: string
}
```

### Layout
- Content container: `mx-auto px-4 py-12`
- Max width maps: sm=max-w-sm, md=max-w-md, lg=max-w-lg, xl=max-w-xl, 2xl=max-w-2xl, 6xl=max-w-6xl, 7xl=max-w-7xl
- Default maxWidth: '6xl'
- Min height: `min-h-screen`

### Gradient Background
- When `withGradientBg` is true, render GradientMesh component behind content
- Position: absolute, full width/height, z-0
- Content at z-10

### Scroll-to-Top Button
- Fixed position: `fixed bottom-6 right-6`
- Shows when scrolled past 400px
- Styling: `bg-violet-500/20 hover:bg-violet-500/30 text-white rounded-full p-3`
- Fade in/out animation
- Smooth scroll behavior on click

## Acceptance Criteria
- [ ] Renders children within max-width container
- [ ] Gradient background toggleable
- [ ] Scroll-to-top appears on scroll
- [ ] Smooth scroll to top works
- [ ] `npm run typecheck` passes
