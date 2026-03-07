# Design System Documentation

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `accent-violet` | `#8b5cf6` | Primary accent, buttons, links |
| `accent-violet-light` | `#a78bfa` | Hover states |
| `accent-violet-dark` | `#6d28d9` | Gradient endpoints |
| `accent-cyan` | `#06b6d4` | Secondary accent, gradients |
| `accent-cyan-light` | `#22d3ee` | Highlights |
| `dark` | `#0a0a0a` | Page background |
| `dark-alt` | `#1a1a1a` | Card/surface background |
| `surface-secondary` | `#111111` | Sidebar, tab bar background |

### Border Opacity Tokens (from `src/styles/tokens.ts`)
- **subtle**: `rgba(255,255,255,0.06)` — dividers, subtle separators
- **default**: `rgba(255,255,255,0.1)` — card borders, standard separators
- **strong**: `rgba(255,255,255,0.15)` — emphasized borders

### Glow Effects
- **Violet glow**: `0 0 20px rgba(139,92,246,0.4)` — button hover, card accent
- **Cyan glow**: `0 0 20px rgba(6,182,212,0.4)` — secondary emphasis

### Typography
- **Font**: Inter (sans), Geist Mono (monospace)
- **Text hierarchy**: `text-white` (primary), `text-white/70` (secondary), `text-white/60` (tertiary), `text-white/40` (muted/placeholder)

### Animation Timing (from `src/styles/animations.ts`)
- **Fast**: 200ms ease-out
- **Normal**: 300ms ease-out
- **Slow**: 500ms ease-out

---

## UI Components

All components are exported from `src/components/ui/index.ts`.

### Button
**File**: `src/components/ui/button.tsx`

```tsx
<Button variant="primary" size="md" loading={false}>Click me</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary \| secondary \| outline \| danger` | `primary` | Visual style |
| `size` | `sm \| md \| lg` | `md` | Size variant |
| `loading` | `boolean` | `false` | Shows spinner, disables button |

### Input
**File**: `src/components/ui/input.tsx`

```tsx
<Input label="Email" placeholder="you@example.com" leftIcon={<Mail size={16} />} error="Required" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text above input |
| `error` | `string` | — | Error message below input |
| `leftIcon` | `ReactNode` | — | Icon inside input (left) |
| `rightIcon` | `ReactNode` | — | Icon inside input (right) |

### Card
**File**: `src/components/ui/card.tsx`

```tsx
<Card glow>Content here</Card>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `glow` | `boolean` | `false` | Violet glow on hover |

Glassmorphism: `bg-[rgba(17,17,17,0.8)] backdrop-blur-md border border-white/10`

### Badge
**File**: `src/components/ui/Badge.tsx`

```tsx
<Badge variant="success" size="sm" icon={<Check size={12} />}>Active</Badge>
```

Variants: `default`, `success`, `warning`, `error`, `info`, `accent`

### Toggle
**File**: `src/components/ui/Toggle.tsx`

```tsx
<Toggle checked={value} onChange={setValue} label="Enable" size="md" />
```

Accessible: `role="switch"`, `aria-checked`, keyboard support.

### Select
**File**: `src/components/ui/Select.tsx`

```tsx
<Select options={[{value: 'a', label: 'Option A'}]} value={val} onChange={setVal} label="Choose" />
```

Keyboard: Arrow keys, Enter, Escape.

### Modal
**File**: `src/components/ui/Modal.tsx`

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm" size="md">Content</Modal>
```

Focus trap, escape key, scroll lock, glassmorphism.

### Tabs
**File**: `src/components/ui/Tabs.tsx`

```tsx
<Tabs tabs={[{id: 'a', label: 'Tab A'}]} activeTab="a" onChange={setTab}>{content}</Tabs>
```

### Tooltip
**File**: `src/components/ui/Tooltip.tsx`

```tsx
<Tooltip content="Help text" position="top"><button>Hover me</button></Tooltip>
```

Positions: `top`, `bottom`, `left`, `right`. Configurable delay.

### Toast / useToast
**Files**: `src/components/ui/Toast.tsx`, `src/hooks/useToast.ts`

```tsx
const { toasts, addToast, removeToast } = useToast();
addToast({ variant: 'success', message: 'Saved!' });
<ToastContainer toasts={toasts} removeToast={removeToast} />
```

### Skeleton
**File**: `src/components/ui/Skeleton.tsx`

```tsx
<Skeleton variant="card" />
```

Variants: `text`, `card`, `avatar`, `button`

### Icon
**File**: `src/components/ui/Icon.tsx`

```tsx
import { Icon, Search } from "@/components/ui/Icon";
<Icon icon={Search} size="md" />
```

Sizes: `sm` (16), `md` (20), `lg` (24), `xl` (32)

### Sidebar
**File**: `src/components/ui/Sidebar.tsx`

```tsx
<Sidebar items={[...]} activeItem="profile" collapsed={false} onToggleCollapse={toggle} />
```

---

## Animation Components

### ScrollReveal / ScrollRevealContainer
**File**: `src/components/animation/ScrollReveal.tsx`

```tsx
<ScrollReveal variant="fadeUp" delay={0.1}><Card>...</Card></ScrollReveal>
<ScrollRevealContainer staggerDelay={0.1}>{children}</ScrollRevealContainer>
```

Variants: `fadeUp`, `fadeIn`, `slideLeft`, `slideRight`. Respects reduced motion.

### Parallax
**File**: `src/components/animation/Parallax.tsx`

```tsx
<Parallax speed={0.5}><h1>Title</h1></Parallax>
```

### GradientMesh
**File**: `src/components/animation/GradientMesh.tsx`

```tsx
<GradientMesh /> // Absolute positioned, use in relative container
```

CSS-only. Three animated blobs (violet, cyan, amber).

### ParticleBackground
**File**: `src/components/animation/ParticleBackground.tsx`

```tsx
<ParticleBackground particleCount={50} connectLines />
```

Uses tsparticles. Automatically reduces particles on mobile.

### PageTransition
**File**: `src/components/animation/PageTransition.tsx`

```tsx
<PageTransition>{children}</PageTransition> // Wrap page content
```

---

## Layout Components

### PageLayout
**File**: `src/components/layout/PageLayout.tsx`

```tsx
<PageLayout withGradientBg maxWidth="6xl">Page content</PageLayout>
```

Includes scroll-to-top button.

---

## CSS Utility Classes

| Class | Effect |
|-------|--------|
| `.hover-lift` | `translateY(-4px)` on hover |
| `.hover-scale` | `scale(1.02)` on hover |
| `.hover-glow-violet` | Violet box-shadow on hover |
| `.link-hover-slide` | Underline slides in from left on hover |

---

## Accessibility

All animation components respect `prefers-reduced-motion`. The `useReducedMotion` hook (`src/hooks/useReducedMotion.ts`) uses `useSyncExternalStore` for the media query check. CSS fallback in `globals.css` disables animations and transforms globally when reduced motion is preferred.
