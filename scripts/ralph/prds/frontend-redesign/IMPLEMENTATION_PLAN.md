# Implementation Plan

## Audit Summary (2026-03-07)

**Status: 11/36 stories complete.**

### Confirmed Existing State
- **Tailwind CSS v4.2.1** with @theme inline in globals.css (no tailwind.config.ts)
- **Next.js v16.1.6** with React 19, TypeScript 5.9
- **Inter font** configured via next/font/google, Geist Mono for monospace
- **Dark theme default** with light theme via `.light` class toggle (needs removal)
- **UI components**: Button (coral #FF7593), Card (cyan glow, no glassmorphism), Input (cyan focus), Accordion (coral hover), ThemeToggle
- **Layout**: Header (backdrop-blur-sm, includes ThemeToggle), Footer (platform-specific hover colors)
- **Color tokens**: brand-green, brand-cyan, brand-coral, brand-orange, brand-yellow-light, brand-gold, brand-gray, dark, dark-alt
- **Pages**: Landing, About, Contact, FAQ, 404, SignIn, SignUp, ForgotPassword, ResetPassword, Profile (1965-line profile-layout.tsx), Account, Newsletters, Exclusive
- **Auth**: bcryptjs hashing, cookie sessions, tier gating (Free/Premium)
- **Profile**: Comprehensive dashboard with avatar upload, billing, invoices, payment methods, subscription management

### Confirmed Missing (verified by code search)
- **Directories**: `src/styles/`, `src/hooks/`, `src/components/animation/` - DO NOT EXIST
- **Files**: `src/lib/animations.ts` - DOES NOT EXIST
- **Dependencies**: framer-motion, lucide-react, @tsparticles/react, tsparticles - NOT INSTALLED
- **UI Components**: Select, Badge, Toggle, Modal, Tabs, Tooltip, Sidebar, Skeleton, Toast, Icon - NONE EXIST
- **Violet accent** (#8b5cf6) - NOT in token system
- **Cyan accent** uses #4CC2D5 (brand-cyan) but spec wants #06b6d4

### Issues Discovered
1. **Newsletter pages use generic Tailwind colors** (`gray-800`, `gray-900`, `cyan-100`) instead of brand tokens - inconsistent with rest of app. Files: `src/app/newsletters/page.tsx`, `src/app/newsletters/[slug]/page.tsx`
2. **Inline SVG icons** throughout profile-layout.tsx (SectionIcon, CardBrandIcon) - should use lucide-react after FD-032
3. **Card glow uses brand-cyan** (`rgba(76,194,213,0.15)`) - needs to switch to violet
4. **Button uses coral** (#FF7593) as primary - needs to switch to violet gradient
5. **Input focus uses brand-cyan** - needs to switch to violet
6. **Accordion hover uses brand-coral** - needs to switch to violet
7. **Footer hover colors are platform-specific** (coral for YouTube/Instagram, cyan for Twitter) - should unify to violet
8. **Light theme CSS block** and theme detection script still present in globals.css and layout.tsx
9. **ThemeToggle** still imported in header.tsx
10. **profile-layout.tsx** has inline modals, custom toggles, and tab navigation that should eventually use the new UI components (Modal, Toggle, Tabs)
11. **`next lint` command is broken in Next.js v16.1.6** - use `npx eslint src/` directly instead
12. **React 19 lint rules disallow setState in useEffect body** - use useSyncExternalStore pattern for media queries

---

## Priority Implementation Order

### Phase 1: Foundation (FD-001, FD-002, FD-003, FD-032)

- [x] **FD-001: Design Tokens Configuration** [NO DEPENDENCIES]
  - Create `src/styles/tokens.ts` with color palette, border opacity tokens, glow values
  - Create `src/styles/animations.ts` with duration/easing presets
  - Add violet (#8b5cf6), cyan (#06b6d4) accent tokens to globals.css @theme block
  - Add border tokens (subtle 0.06, default 0.1, strong 0.15)
  - `npm run typecheck` must pass
  - *Spec: specs/FD-001-design-tokens.md*

- [x] **FD-002: Global Dark Theme Styles** [DEPENDS: FD-001]
  - Remove `:root.light` CSS block from globals.css
  - Remove theme detection script from layout.tsx `<head>`
  - Delete `src/components/ui/theme-toggle.tsx`
  - Remove ThemeToggle import from header.tsx
  - Verify html/body bg is #0a0a0a, text white
  - `npm run typecheck` must pass
  - *Spec: specs/FD-002-dark-theme.md*

- [x] **FD-003: Animation Utilities** [NO DEPENDENCIES]
  - Run: `npm install framer-motion`
  - Create `src/lib/animations.ts` with variants (fadeIn, fadeUp, slideInLeft, slideInRight, scaleIn, staggerContainer)
  - Create `src/hooks/useScrollReveal.ts` (Intersection Observer, returns ref + isVisible)
  - Create `src/hooks/useReducedMotion.ts` (prefers-reduced-motion media query)
  - `npm run typecheck` must pass
  - *Spec: specs/FD-003-animation-utilities.md*

- [x] **FD-032: Icon System Setup** [NO DEPENDENCIES]
  - Run: `npm install lucide-react`
  - Create `src/components/ui/Icon.tsx` wrapper with size prop (sm=16, md=20, lg=24, xl=32)
  - Re-export commonly used icons
  - `npm run typecheck` must pass
  - *Spec: specs/FD-032-icon-system.md*

### Phase 2: Core UI Components (FD-004, FD-005, FD-007, FD-008, FD-009, FD-022, FD-030)

- [x] **FD-004: Button Component Redesign** [DEPENDS: FD-001]
  - Replace coral with violet gradient (#8b5cf6 to #6366f1) for primary variant
  - Add glow on hover: `box-shadow: 0 0 20px rgba(139,92,246,0.4)`
  - Add scale(0.98) on active/click
  - Keep loading spinner, add proper disabled state
  - Transition: 200ms ease-out
  - *File: src/components/ui/button.tsx (exists, currently uses coral)*
  - *Spec: specs/FD-004-button-component.md*

- [x] **FD-005: Input Component Redesign** [DEPENDS: FD-001]
  - Add leftIcon/rightIcon props with absolute positioning
  - Focus: violet border (#8b5cf6) with ring-2 ring-violet-500/20
  - Error: red border (#ef4444) with ring glow
  - Placeholder: text-white/40
  - *File: src/components/ui/input.tsx (exists, currently uses cyan focus)*
  - *Spec: specs/FD-005-input-component.md*

- [x] **FD-007: Card Component with Glassmorphism** [DEPENDS: FD-001]
  - Background: `rgba(17,17,17,0.8)` + `backdrop-blur-md` (currently solid #1a1a1a)
  - Border: `rgba(255,255,255,0.1)` (currently brand-gray/20)
  - Hover: translateY(-2px), increased shadow, optional violet glow
  - Add header/body/footer slots
  - *File: src/components/ui/card.tsx (exists, has cyan glow)*
  - *Spec: specs/FD-007-card-glassmorphism.md*

- [x] **FD-008: Badge/Pill Component** [DEPENDS: FD-001]
  - Create `src/components/ui/Badge.tsx`
  - 6 variants: default, success, warning, error, info, accent
  - 2 sizes: sm, md
  - Optional icon prop
  - *Spec: specs/FD-008-badge-component.md*

- [x] **FD-009: Toggle/Switch Component** [DEPENDS: FD-001]
  - Create `src/components/ui/Toggle.tsx`
  - Off: bg #333, On: bg violet-500
  - Accessible: role=switch, aria-checked, keyboard support
  - *Spec: specs/FD-009-toggle-component.md*

- [x] **FD-022: Hover Micro-interactions** [DEPENDS: FD-001]
  - Add CSS utility classes to globals.css: hover-lift, hover-scale, hover-glow-violet, link-hover-slide
  - These are used by multiple components and pages later
  - *Spec: specs/FD-022-hover-microinteractions.md*

- [x] **FD-030: Skeleton Loading Component** [NO DEPENDENCIES, CSS only]
  - Create `src/components/ui/Skeleton.tsx`
  - Shimmer animation with gradient sweep
  - Variants: text, card, avatar, button
  - *Spec: specs/FD-030-skeleton-component.md*

### Phase 3: Advanced UI Components (FD-006, FD-010, FD-011, FD-012, FD-031)

- [ ] **FD-006: Select/Dropdown Component** [DEPENDS: FD-001, FD-003]
  - Create `src/components/ui/Select.tsx`
  - Dark bg #1a1a1a, hover #222222
  - Scale + fade animation, keyboard navigation
  - *Spec: specs/FD-006-select-component.md*

- [ ] **FD-010: Modal/Dialog Component** [DEPENDS: FD-001, FD-003, FD-007]
  - Create `src/components/ui/Modal.tsx`
  - Overlay: bg-black/60 + backdrop-blur-sm
  - Glassmorphism body, scale+fade animation
  - Focus trap, escape key close, scroll lock
  - *Spec: specs/FD-010-modal-component.md*

- [ ] **FD-011: Tabs Component** [DEPENDS: FD-001, FD-003]
  - Create `src/components/ui/Tabs.tsx`
  - Tab bar bg #111, animated active indicator
  - Support icon + label
  - *Spec: specs/FD-011-tabs-component.md*

- [ ] **FD-012: Tooltip Component** [DEPENDS: FD-003]
  - Create `src/components/ui/Tooltip.tsx`
  - 4 positions, fade+translate animation
  - Arrow pointing to trigger, delay support
  - *Spec: specs/FD-012-tooltip-component.md*

- [ ] **FD-031: Toast Notification System** [DEPENDS: FD-003]
  - Create `src/components/ui/Toast.tsx` + `src/hooks/useToast.ts`
  - 4 variants with left border color coding
  - Slide in/out, auto-dismiss with hover pause
  - Stack up to 5 toasts
  - *Spec: specs/FD-031-toast-component.md*

### Phase 4: Layout Components (FD-013, FD-014, FD-015, FD-016)

- [ ] **FD-013: Navigation Header Redesign** [DEPENDS: FD-001, FD-002, FD-003]
  - Upgrade backdrop-blur-sm to backdrop-blur-md
  - Subtler border: border-white/[0.06]
  - Nav link underline slide animation (violet)
  - Add mobile hamburger menu
  - *File: src/components/layout/header.tsx (exists)*
  - *Spec: specs/FD-013-header-redesign.md*

- [ ] **FD-014: Footer Redesign** [DEPENDS: FD-001]
  - Replace solid border with gradient: from-transparent via-violet-500/50 to-transparent
  - Unify social icon hover to violet glow (replace platform-specific colors)
  - Links: text-white/40 -> text-white on hover
  - *File: src/components/layout/footer.tsx (exists)*
  - *Spec: specs/FD-014-footer-redesign.md*

- [ ] **FD-015: Sidebar Component** [DEPENDS: FD-001, FD-003]
  - Create `src/components/ui/Sidebar.tsx`
  - Collapsible: 240px -> 64px with smooth transition
  - Active item: violet accent with left border
  - Section dividers
  - *Spec: specs/FD-015-sidebar-component.md*

- [ ] **FD-016: Page Layout Wrapper** [DEPENDS: FD-020]
  - Create `src/components/layout/PageLayout.tsx`
  - Optional GradientMesh background
  - Configurable maxWidth
  - Scroll-to-top button (violet styling)
  - *Spec: specs/FD-016-page-layout.md*

### Phase 5: Animation Components (FD-017, FD-018, FD-019, FD-020, FD-021)

- [ ] **FD-020: Gradient Mesh Background** [NO DEPENDENCIES, CSS only]
  - Create `src/components/animation/GradientMesh.tsx`
  - Multiple blobs: violet, cyan, subtle amber
  - CSS keyframe animation for drift/morph (20s infinite)
  - Blur filter (100px), opacity 0.4
  - *Spec: specs/FD-020-gradient-mesh.md*

- [ ] **FD-017: Scroll Reveal Animations** [DEPENDS: FD-003]
  - Create `src/components/animation/ScrollReveal.tsx`
  - Variants: fadeUp, fadeIn, slideLeft, slideRight
  - Uses Framer Motion whileInView
  - ScrollRevealContainer for stagger
  - Respects prefers-reduced-motion
  - *Spec: specs/FD-017-scroll-reveal.md*

- [ ] **FD-018: Parallax Effect Component** [DEPENDS: FD-003]
  - Create `src/components/animation/Parallax.tsx`
  - Speed prop (0-2 range), uses Framer Motion useScroll
  - GPU-accelerated via transform only
  - Respects prefers-reduced-motion
  - *Spec: specs/FD-018-parallax-component.md*

- [ ] **FD-019: Particle Background Effect** [DEPENDS: FD-003]
  - Run: `npm install @tsparticles/react tsparticles`
  - Create `src/components/animation/ParticleBackground.tsx`
  - Constellation effect with violet/cyan particles
  - Props: particleCount, color, speed, connectLines
  - Respects prefers-reduced-motion
  - *Spec: specs/FD-019-particle-background.md*

- [ ] **FD-021: Page Transition Animations** [DEPENDS: FD-003]
  - Create `src/components/animation/PageTransition.tsx`
  - Wrap in layout.tsx with AnimatePresence
  - Fade + subtle translateY transition
  - Key on pathname via usePathname
  - *Spec: specs/FD-021-page-transitions.md*

### Phase 6: Page Redesigns (FD-023 to FD-029)

- [ ] **FD-023: Landing Page Redesign** [DEPENDS: FD-004, FD-017, FD-019, FD-020]
  - Hero with GradientMesh + ParticleBackground
  - Gradient text: from-cyan-400 to-violet-500 (replace coral-to-cyan)
  - Feature cards with ScrollReveal stagger
  - CTA buttons with violet styling
  - *File: src/app/page.tsx (exists, uses coral-to-cyan gradients)*
  - *Spec: specs/FD-023-landing-page.md*

- [ ] **FD-024: About Page Redesign** [DEPENDS: FD-007, FD-017, FD-018]
  - Parallax hero heading
  - Core Values cards with glassmorphism + ScrollReveal stagger
  - Replace coral references with violet
  - *File: src/app/about/page.tsx (exists, basic card layout)*
  - *Spec: specs/FD-024-about-page.md*

- [ ] **FD-025: Contact Page Redesign** [DEPENDS: FD-004, FD-005, FD-006, FD-017]
  - Form uses redesigned Input, Select, Button
  - ScrollReveal on form section
  - Card wrapper with glassmorphism
  - *File: src/app/contact/page.tsx (exists)*
  - *Spec: specs/FD-025-contact-page.md*

- [ ] **FD-026: FAQ Page Redesign** [DEPENDS: FD-017]
  - Accordion items with ScrollReveal stagger
  - Dark styling: bg-[#111111], border-white/[0.06]
  - Replace accordion hover coral with violet
  - Category groupings with section headings
  - *File: src/app/faq/page.tsx (exists)*
  - *Spec: specs/FD-026-faq-page.md*

- [ ] **FD-027: 404 Page Redesign** [DEPENDS: FD-004, FD-020]
  - Large "404" with violet-to-cyan gradient text
  - GradientMesh background
  - Violet CTA button
  - *File: src/app/not-found.tsx (exists)*
  - *Spec: specs/FD-027-404-page.md*

- [ ] **FD-028: Auth Pages Redesign** [DEPENDS: FD-004, FD-005, FD-007]
  - All 3 auth pages: glassmorphism Card, violet Input focus, violet Button
  - Subtle GradientMesh background
  - Replace brand-coral error with red-500, brand-cyan focus with violet
  - *Files: signin/page.tsx, signup/page.tsx, forgot-password/page.tsx*
  - *Spec: specs/FD-028-auth-pages.md*

- [ ] **FD-029: Dashboard/Profile Pages Redesign** [DEPENDS: FD-007, FD-015]
  - Use Sidebar component for navigation
  - Replace brand-cyan active states with violet throughout profile-layout.tsx
  - Tables with dark styling
  - Glassmorphism cards
  - *Files: profile/page.tsx, profile/profile-layout.tsx, account/page.tsx, account/account-forms.tsx*
  - *Spec: specs/FD-029-dashboard-pages.md*
  - *NOTE: profile-layout.tsx is 1965 lines with inline modals, toggles, tabs - large refactor*

### Phase 7: Accessibility & Polish (FD-033, FD-034, FD-035, FD-036)

- [ ] **FD-033: Reduced Motion Support** [DEPENDS: FD-003, all animation components]
  - Verify useReducedMotion hook
  - Audit all animation components for reduced-motion fallbacks
  - Static/hidden fallbacks for particles, parallax, gradient mesh
  - *Spec: specs/FD-033-reduced-motion.md*

- [ ] **FD-034: Component Documentation** [DEPENDS: all components]
  - Create `docs/design-system.md`
  - Document all components with props, usage examples
  - Document design tokens
  - *Spec: specs/FD-034-component-docs.md*

- [ ] **FD-035: Performance Optimization** [DEPENDS: all components]
  - Ensure animations use transform/opacity only
  - Lazy load ParticleBackground and GradientMesh with next/dynamic
  - Reduce particle count on mobile (< 768px)
  - Lighthouse Performance > 90
  - *Spec: specs/FD-035-performance.md*

- [ ] **FD-036: Final Visual QA Pass** [DEPENDS: all pages]
  - Review all pages for consistent token usage
  - **Fix newsletter pages** (newsletters/page.tsx, newsletters/[slug]/page.tsx) to use brand color system
  - Responsive testing: 375px, 768px, 1280px+
  - Cross-browser: Chrome, Firefox, Safari
  - Verify backdrop-blur fallbacks
  - *Spec: specs/FD-036-visual-qa.md*

---

## Dependencies to Install

```bash
# Phase 1 (install together at start):
npm install framer-motion lucide-react

# Phase 5 (install when needed for FD-019):
npm install @tsparticles/react tsparticles
```

---

## Files to Create

```
src/
├── styles/
│   ├── tokens.ts              # FD-001
│   └── animations.ts          # FD-001
├── hooks/
│   ├── useScrollReveal.ts     # FD-003
│   ├── useReducedMotion.ts    # FD-003
│   └── useToast.ts            # FD-031
├── components/
│   ├── ui/
│   │   ├── Select.tsx         # FD-006
│   │   ├── Badge.tsx          # FD-008
│   │   ├── Toggle.tsx         # FD-009
│   │   ├── Modal.tsx          # FD-010
│   │   ├── Tabs.tsx           # FD-011
│   │   ├── Tooltip.tsx        # FD-012
│   │   ├── Sidebar.tsx        # FD-015
│   │   ├── Skeleton.tsx       # FD-030
│   │   ├── Toast.tsx          # FD-031
│   │   └── Icon.tsx           # FD-032
│   ├── animation/
│   │   ├── ScrollReveal.tsx      # FD-017
│   │   ├── Parallax.tsx          # FD-018
│   │   ├── ParticleBackground.tsx # FD-019
│   │   ├── GradientMesh.tsx      # FD-020
│   │   └── PageTransition.tsx    # FD-021
│   └── layout/
│       └── PageLayout.tsx     # FD-016
└── lib/
    └── animations.ts          # FD-003
```

---

## Files to Modify

- `src/app/globals.css` - Add violet/cyan tokens, remove light theme, add hover utilities (FD-001, FD-002, FD-022)
- `src/app/layout.tsx` - Remove theme script, add PageTransition wrapper (FD-002, FD-021)
- `src/components/ui/button.tsx` - Violet gradient, glow, scale (FD-004)
- `src/components/ui/input.tsx` - Icons, violet focus (FD-005)
- `src/components/ui/card.tsx` - Glassmorphism, violet glow (FD-007)
- `src/components/ui/accordion.tsx` - Violet hover (FD-026)
- `src/components/ui/index.ts` - Export all new components
- `src/components/layout/header.tsx` - Remove ThemeToggle, glassmorphism upgrade, mobile menu (FD-002, FD-013)
- `src/components/layout/footer.tsx` - Gradient border, violet glow (FD-014)
- `src/app/page.tsx` - Landing redesign (FD-023)
- `src/app/about/page.tsx` - About redesign (FD-024)
- `src/app/contact/page.tsx` + `src/components/contact-form.tsx` - Contact redesign (FD-025)
- `src/app/faq/page.tsx` - FAQ redesign (FD-026)
- `src/app/not-found.tsx` - 404 redesign (FD-027)
- `src/app/signin/page.tsx`, `signup/page.tsx`, `forgot-password/page.tsx` - Auth redesign (FD-028)
- `src/app/profile/profile-layout.tsx`, `profile/page.tsx`, `account/page.tsx`, `account/account-forms.tsx` - Dashboard redesign (FD-029)
- `src/app/newsletters/page.tsx`, `newsletters/[slug]/page.tsx` - Fix color inconsistency (FD-036)

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
                 ├─► FD-005 (Input) ──┼─► FD-025 (Contact)
                 │                    │
                 ├─► FD-007 (Card) ───┼─► FD-028 (Auth Pages)
                 │                    │
                 ├─► FD-022 (Hover)   │
                 │                    │
FD-003 (Anim) ──┬─► FD-017 (Scroll) ─┤
                 │                    │
                 ├─► FD-020 (Mesh) ───┤
                 │                    │
                 ├─► FD-019 (Particles)─┘
                 │
                 └─► FD-021 (PageTransition)

FD-032 (Icons) ─► Used by FD-004, FD-005, FD-006, FD-031 (loading spinner, chevrons, etc.)
FD-030 (Skeleton) ─► No deps (CSS only), can be done anytime
```

### Parallelization Opportunities
- **FD-001 + FD-003 + FD-032 + FD-030** can all start in parallel (no dependencies)
- **FD-004 + FD-005 + FD-007 + FD-008 + FD-009 + FD-022** can all start after FD-001
- **FD-017 + FD-018 + FD-019 + FD-020 + FD-021** can start after FD-003
- **FD-020** (GradientMesh) has no dependencies and can start immediately

---

## Specs Coverage

All 36 stories now have specs in `specs/`:
- overview.md, FD-001 through FD-036 (28 specs created in this planning session)

---

## Known Risks

1. **profile-layout.tsx is 1965 lines** - FD-029 is the largest single story. Consider breaking into sub-tasks during implementation.
2. **Next.js App Router + AnimatePresence** - FD-021 may have limitations with exit animations in App Router. May need pathname-keyed approach.
3. **tsparticles bundle size** - FD-019 adds a heavy dependency. Must lazy-load with next/dynamic.
4. **Newsletter pages inconsistency** - Tracked under FD-036 but could be addressed earlier if desired.
