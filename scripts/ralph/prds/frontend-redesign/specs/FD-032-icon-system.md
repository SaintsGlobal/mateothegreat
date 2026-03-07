# FD-032: Icon System Setup

## Overview
Set up lucide-react icon library with a standardized Icon wrapper component.

## Files
- `src/components/ui/Icon.tsx` (new)

## Requirements

### Installation
```bash
npm install lucide-react
```

### Icon Wrapper Props
```typescript
interface IconProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}
```

### Size Mapping
- sm: 16px
- md: 20px (default)
- lg: 24px
- xl: 32px

### Implementation
- Re-export commonly used icons from lucide-react
- Provide Icon wrapper that maps size prop to pixel values
- Default color: `currentColor`
- Common icons to export: ChevronDown, ChevronRight, X, Check, Plus, Minus, Search, Menu, Settings, User, Mail, Lock, Eye, EyeOff, AlertCircle, Info, ArrowLeft, ArrowRight, ExternalLink, Copy, Trash2, Edit2, Star, Heart, Bell, LogOut

## Acceptance Criteria
- [ ] lucide-react installed
- [ ] Icon wrapper component works with size prop
- [ ] Common icons are re-exported
- [ ] `npm run typecheck` passes
