# Implementation Plan

## Current State Assessment

### What Exists
- **Tailwind CSS v4.2.1** with @theme inline in globals.css (no tailwind.config.ts needed)
- **Inter font** already configured via next/font/google
- **Dark theme default** with light theme via `.light` class toggle
- **Basic UI components**: Button (coral), Card (no glassmorphism), Input, Accordion, ThemeToggle
- **Layout components**: Header (with backdrop-blur), Footer
- **Color tokens** in CSS custom properties (brand colors, semantic colors)

### What's Missing
- **Violet accent color** (#8b5cf6) - primary brand color for Leonardo.ai style
- **Framer Motion** - not installed
- **@tsparticles/react** - not installed
- **lucide-react** - not installed
- **Animation utilities** (animations.ts, tokens.ts)
- **Custom hooks** (useScrollReveal, useReducedMotion)
- **10+ UI components** (Select, Badge, Toggle, Modal, Tabs, Tooltip, Sidebar, Skeleton, Toast, Icon)
- **Animation components** (ScrollReveal, Parallax, ParticleBackground, GradientMesh)
- **Glassmorphism** on cards/modals

---

## Priority Implementation Order

### Phase 1: Foundation (FD-001 to FD-003)

- [ ] **FD-001: Design Tokens Configuration**
  - Create `src/styles/tokens.ts` with TypeScript exports
  - Add violet (#8b5cf6), cyan (#06b6d4) accent colors
  - Add border tokens (subtle 0.06, default 0.1, strong 0.15)
  - Add glow effect values
  - Create `src/styles/animations.ts` with duration/easing presets
  - Update globals.css @theme block with new tokens
  - *Dependency: None*

- [ ] **FD-002: Global Dark Theme Styles**
  - Remove `:root.light` CSS block from globals.css
  - Remove theme detection script from layout.tsx
  - Delete `src/components/ui/theme-toggle.tsx`
  - Remove ThemeToggle from header.tsx
  - Verify html/body bg is #0a0a0a
  - *Dependency: FD-001*

- [ ] **FD-003: Animation Utilities**
  - Run: `npm install framer-motion`
  - Create `src/lib/animations.ts` with variants (fadeIn, fadeUp, slideInLeft, slideInRight, scaleIn, staggerContainer)
  - Create `src/hooks/useScrollReveal.ts` (Intersection Observer)
  - Create `src/hooks/useReducedMotion.ts` (prefers-reduced-motion)
  - *Dependency: None*

### Phase 2: Core UI Components (FD-004 to FD-012)

- [ ] **FD-004: Button Component Redesign**
  - Replace coral (#FF7593) with violet gradient (#8b5cf6 to #6366f1)
  - Add glow effect on hover (box-shadow)
  - Add scale(0.98) on active/click
  - Keep loading spinner, add disabled state
  - *Dependency: FD-001*
  - *File: src/components/ui/button.tsx (exists)*

- [ ] **FD-005: Input Component Redesign**
  - Add leftIcon/rightIcon props
  - Focus state: violet border with glow
  - Error state: red border (#ef4444)
  - Muted placeholder color
  - *Dependency: FD-001*
  - *File: src/components/ui/input.tsx (exists)*

- [ ] **FD-006: Select/Dropdown Component**
  - Create `src/components/ui/Select.tsx`
  - Dark bg #1a1a1a, subtle border
  - Hover bg #222222
  - Scale + fade animation on open/close
  - *Dependency: FD-001, FD-003*

- [ ] **FD-007: Card Component with Glassmorphism**
  - Update to: `rgba(17,17,17,0.8)` + `backdrop-blur-md`
  - Border: `rgba(255,255,255,0.1)`
  - Hover: translateY(-2px), increased shadow
  - Add header/body/footer slots
  - *Dependency: FD-001*
  - *File: src/components/ui/card.tsx (exists)*

- [ ] **FD-008: Badge/Pill Component**
  - Create `src/components/ui/Badge.tsx`
  - Variants: default, success, warning, error, info, accent
  - Sizes: sm, md
  - Optional icon prop
  - *Dependency: FD-001*

- [ ] **FD-009: Toggle/Switch Component**
  - Create `src/components/ui/Toggle.tsx`
  - Off: bg #333, On: bg violet-500
  - Smooth knob transition
  - Accessible: role=switch, aria-checked
  - *Dependency: FD-001*

- [ ] **FD-010: Modal/Dialog Component**
  - Create `src/components/ui/Modal.tsx`
  - Overlay: bg-black/60 + backdrop-blur-sm
  - Glassmorphism body
  - Scale + fade animation
  - Focus trap, escape key close
  - *Dependency: FD-001, FD-003, FD-007*

- [ ] **FD-011: Tabs Component**
  - Create `src/components/ui/Tabs.tsx`
  - Tab bar: bg #111, rounded-lg
  - Active indicator animation
  - Support icon + label
  - *Dependency: FD-001, FD-003*

- [ ] **FD-012: Tooltip Component**
  - Create `src/components/ui/Tooltip.tsx`
  - Bg #222, border rgba(255,255,255,0.1)
  - Positions: top, bottom, left, right
  - Fade in + translateY animation
  - *Dependency: FD-003*

### Phase 3: Layout Components (FD-013 to FD-016)

- [ ] **FD-013: Navigation Header Redesign**
  - Update to glassmorphism: rgba(10,10,10,0.8) + backdrop-blur-md
  - Nav link hover: underline slide animation
  - Mobile hamburger menu
  - *Dependency: FD-001, FD-003*
  - *File: src/components/layout/header.tsx (exists)*

- [ ] **FD-014: Footer Redesign**
  - Top border gradient (violet)
  - Social icons with hover scale/glow
  - Links: muted -> white transition
  - *Dependency: FD-001*
  - *File: src/components/layout/footer.tsx (exists)*

- [ ] **FD-015: Sidebar Component**
  - Create `src/components/ui/Sidebar.tsx`
  - Collapsible: 240px -> 64px
  - Active item: violet accent
  - Section dividers
  - *Dependency: FD-001, FD-003*

- [ ] **FD-016: Page Layout Wrapper**
  - Create `src/components/layout/PageLayout.tsx`
  - Props: withGradientBg, maxWidth
  - Gradient mesh background option
  - Scroll-to-top button
  - *Dependency: FD-020*

### Phase 4: Animation Components (FD-017 to FD-022)

- [ ] **FD-017: Scroll Reveal Animations**
  - Create `src/components/animation/ScrollReveal.tsx`
  - Uses Framer Motion + useScrollReveal hook
  - Variants: fadeUp, fadeIn, slideLeft, slideRight
  - Respects prefers-reduced-motion
  - *Dependency: FD-003*

- [ ] **FD-018: Parallax Effect Component**
  - Create `src/components/animation/Parallax.tsx`
  - Speed prop (0.5 = slower, 1.5 = faster)
  - Uses Framer Motion useScroll
  - Respects prefers-reduced-motion
  - *Dependency: FD-003*

- [ ] **FD-019: Particle Background Effect**
  - Run: `npm install @tsparticles/react tsparticles`
  - Create `src/components/animation/ParticleBackground.tsx`
  - Props: particleCount, color, speed, connectLines
  - Colors: violet/cyan
  - Respects prefers-reduced-motion
  - *Dependency: FD-003*

- [ ] **FD-020: Gradient Mesh Background**
  - Create `src/components/animation/GradientMesh.tsx`
  - Multiple blobs: violet, cyan, amber
  - CSS animation for drift/morph
  - Blur filter
  - *Dependency: None (CSS only)*

- [ ] **FD-021: Page Transition Animations**
  - Create page transition wrapper with AnimatePresence
  - Fade transition between routes
  - Works with Next.js App Router
  - *Dependency: FD-003*

- [ ] **FD-022: Hover Micro-interactions**
  - Buttons: scale(1.02) hover, scale(0.98) press
  - Cards: translateY(-4px) + shadow
  - Links: underline slide
  - Add as utility classes or component defaults
  - *Dependency: FD-001*

### Phase 5: Page Redesigns (FD-023 to FD-029)

- [ ] **FD-023: Landing Page Redesign**
  - Hero with GradientMesh + ParticleBackground
  - Gradient text headline (cyan to violet)
  - Feature cards with ScrollReveal stagger
  - *Dependency: FD-017, FD-019, FD-020*
  - *File: src/app/page.tsx (exists)*

- [ ] **FD-024: About Page Redesign**
  - Team section with Cards + hover effects
  - ScrollReveal on sections
  - Parallax on hero image
  - *Dependency: FD-007, FD-017, FD-018*
  - *File: src/app/about/page.tsx (exists)*

- [ ] **FD-025: Contact Page Redesign**
  - Form with new Input, Select, Button
  - Loading state on submit
  - ScrollReveal on form
  - *Dependency: FD-004, FD-005, FD-006, FD-017*
  - *File: src/app/contact/page.tsx (exists)*

- [ ] **FD-026: FAQ Page Redesign**
  - Dark styled accordion
  - ScrollReveal stagger on items
  - Category groupings
  - *Dependency: FD-017*
  - *File: src/app/faq/page.tsx (exists)*

- [ ] **FD-027: 404 Page Redesign**
  - Gradient/glitch 404 text
  - Subtle particle or gradient mesh bg
  - CTA to return home
  - *Dependency: FD-004, FD-019 or FD-020*
  - *File: src/app/not-found.tsx (exists)*

- [ ] **FD-028: Auth Pages Redesign**
  - Centered Card with glassmorphism
  - Form inputs using new components
  - Gradient accent
  - *Dependency: FD-004, FD-005, FD-007*
  - *Files: src/app/signin/page.tsx, src/app/signup/page.tsx, src/app/forgot-password/page.tsx (exist)*

- [ ] **FD-029: Dashboard/Profile Pages Redesign**
  - Sidebar layout
  - Stat cards with animations
  - Tables with dark styling
  - *Dependency: FD-007, FD-015*
  - *Files: src/app/profile/page.tsx, src/app/account/page.tsx (exist)*

### Phase 6: Utility Components (FD-030 to FD-032)

- [ ] **FD-030: Skeleton Loading Component**
  - Create `src/components/ui/Skeleton.tsx`
  - Shimmer animation (gradient left to right)
  - Variants: text, card, avatar, button
  - *Dependency: None (CSS only)*

- [ ] **FD-031: Toast Notification System**
  - Create `src/components/ui/Toast.tsx` + useToast hook
  - Variants: success, error, warning, info
  - Slide in animation, auto-dismiss
  - Stack multiple toasts
  - *Dependency: FD-003*

- [ ] **FD-032: Icon System Setup**
  - Run: `npm install lucide-react`
  - Create `src/components/ui/Icon.tsx` wrapper
  - Sizes: sm (16), md (20), lg (24), xl (32)
  - Export commonly used icons
  - *Dependency: None*

### Phase 7: Accessibility & Polish (FD-033 to FD-036)

- [ ] **FD-033: Reduced Motion Support**
  - Ensure useReducedMotion hook works
  - Update all animation components to check hook
  - Disable/static fallbacks for particles, parallax
  - *Dependency: FD-003, all animation components*

- [ ] **FD-034: Component Documentation**
  - Create `docs/design-system.md`
  - Document all components with props
  - Include usage examples
  - Document design tokens
  - *Dependency: All components complete*

- [ ] **FD-035: Performance Optimization**
  - Audit animations (transform/opacity only)
  - Add will-change hints
  - Lazy load heavy animation components
  - Reduce particles on mobile
  - Lighthouse score > 90
  - *Dependency: All components complete*

- [ ] **FD-036: Final Visual QA Pass**
  - Review all pages for consistency
  - Verify spacing/colors match tokens
  - Test all animations
  - Responsive: 375px, 768px, 1280px+
  - Cross-browser: Chrome, Firefox, Safari
  - *Dependency: All pages complete*

---

## Dependencies to Install

```bash
npm install framer-motion lucide-react @tsparticles/react tsparticles
```

---

## Files to Create

```
src/
├── styles/
│   ├── tokens.ts          # FD-001
│   └── animations.ts      # FD-001
├── hooks/
│   ├── useScrollReveal.ts # FD-003
│   └── useReducedMotion.ts # FD-003
├── components/
│   ├── ui/
│   │   ├── Select.tsx     # FD-006
│   │   ├── Badge.tsx      # FD-008
│   │   ├── Toggle.tsx     # FD-009
│   │   ├── Modal.tsx      # FD-010
│   │   ├── Tabs.tsx       # FD-011
│   │   ├── Tooltip.tsx    # FD-012
│   │   ├── Sidebar.tsx    # FD-015
│   │   ├── Skeleton.tsx   # FD-030
│   │   ├── Toast.tsx      # FD-031
│   │   └── Icon.tsx       # FD-032
│   ├── animation/
│   │   ├── ScrollReveal.tsx      # FD-017
│   │   ├── Parallax.tsx          # FD-018
│   │   ├── ParticleBackground.tsx # FD-019
│   │   └── GradientMesh.tsx      # FD-020
│   └── layout/
│       └── PageLayout.tsx # FD-016
└── lib/
    └── animations.ts      # FD-003 (alternative location)
```

---

## Files to Modify

- `src/app/globals.css` - Add violet tokens, remove light theme (FD-001, FD-002)
- `src/app/layout.tsx` - Remove theme script (FD-002)
- `src/components/ui/button.tsx` - Violet gradient, glow, scale (FD-004)
- `src/components/ui/input.tsx` - Icons, violet focus (FD-005)
- `src/components/ui/card.tsx` - Glassmorphism (FD-007)
- `src/components/ui/index.ts` - Export new components
- `src/components/layout/header.tsx` - Remove ThemeToggle, enhance styling (FD-002, FD-013)
- `src/components/layout/footer.tsx` - Gradient border, glow effects (FD-014)
- All page files for redesign phase

---

## Files to Delete

- `src/components/ui/theme-toggle.tsx` - Remove for dark-only (FD-002)

---

## Critical Path

```
FD-001 (Tokens) ─┬─► FD-002 (Dark Theme) ─► FD-013 (Header)
                 │
                 ├─► FD-004 (Button) ─┬─► FD-023 (Landing)
                 │                    │
                 ├─► FD-005 (Input) ──┤
                 │                    │
                 ├─► FD-007 (Card) ───┤
                 │                    │
FD-003 (Animations) ─┬─► FD-017 (ScrollReveal) ─┤
                     │                          │
                     ├─► FD-019 (Particles) ────┤
                     │                          │
                     └─► FD-020 (GradientMesh) ─┘
```

---

## Estimated Effort

| Phase | Stories | Complexity |
|-------|---------|------------|
| Phase 1: Foundation | 3 | Low |
| Phase 2: Core UI | 9 | Medium |
| Phase 3: Layout | 4 | Medium |
| Phase 4: Animation | 6 | High |
| Phase 5: Pages | 7 | Medium |
| Phase 6: Utility | 3 | Low |
| Phase 7: Polish | 4 | Medium |
| **Total** | **36** | |

---

## Notes

- Tailwind v4 uses @theme inline in CSS - no tailwind.config.ts needed
- Dark theme is already default; just need to remove light mode toggle
- Button currently uses coral (#FF7593) - switch to violet (#8b5cf6)
- Existing Card has basic glow but no glassmorphism
- Inter font already configured - no changes needed
- Accordion exists and works - may need style updates only
