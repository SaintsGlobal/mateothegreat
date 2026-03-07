# PRD: Frontend Redesign - Leonardo.ai Inspired

## Introduction

Complete frontend overhaul to achieve an industry-grade, premium dark UI inspired by Leonardo.ai. This redesign transforms our application into a visually stunning, animation-rich experience consistent with top-tier AI/SaaS products like Leonardo.ai, Vercel, Linear, and Stripe.

The goal is a cohesive design system with reusable components, rich animations (parallax, particles, complex transitions), and a dark-only theme that impresses users immediately.

## Goals

- Establish a premium dark-only design system with design tokens
- Create a comprehensive component library with consistent styling
- Implement rich animations: scroll reveals, parallax, particle effects, micro-interactions
- Achieve visual consistency across all pages
- Document the design system for maintainability
- Match the polish level of Leonardo.ai, Vercel, Linear

## Design System Specifications

### Color Palette (from Leonardo.ai analysis)

```
Background:
- bg-primary: #0a0a0a (near black)
- bg-secondary: #111111 (panels)
- bg-tertiary: #1a1a1a (cards, inputs)
- bg-elevated: #222222 (hover states)

Borders:
- border-subtle: rgba(255, 255, 255, 0.06)
- border-default: rgba(255, 255, 255, 0.1)
- border-strong: rgba(255, 255, 255, 0.15)

Text:
- text-primary: #ffffff
- text-secondary: rgba(255, 255, 255, 0.7)
- text-tertiary: rgba(255, 255, 255, 0.5)
- text-muted: rgba(255, 255, 255, 0.3)

Accents:
- accent-primary: #8b5cf6 (violet-500)
- accent-secondary: #06b6d4 (cyan-500)
- accent-tertiary: #f59e0b (amber-500)
- accent-gradient: linear-gradient(135deg, #06b6d4, #8b5cf6)

Semantic:
- success: #10b981
- warning: #f59e0b
- error: #ef4444
- info: #3b82f6

Glow Effects:
- glow-primary: 0 0 20px rgba(139, 92, 246, 0.4)
- glow-cyan: 0 0 20px rgba(6, 182, 212, 0.4)
```

### Typography

```
Font Family: Inter (with system fallbacks)
- Display: 700, tracking tight
- Headings: 600
- Body: 400
- Labels: 500, uppercase, tracking wide

Sizes:
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)
- display: 4rem (64px)
```

### Spacing Scale

```
0: 0
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
```

### Border Radius

```
none: 0
sm: 0.25rem (4px)
md: 0.5rem (8px)
lg: 0.75rem (12px)
xl: 1rem (16px)
2xl: 1.5rem (24px)
full: 9999px
```

### Shadows & Effects

```
Shadows:
- shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5)
- shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5)
- shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5)
- shadow-glow: 0 0 30px rgba(139, 92, 246, 0.3)

Glassmorphism:
- glass-bg: rgba(17, 17, 17, 0.8)
- glass-blur: blur(12px)
- glass-border: 1px solid rgba(255, 255, 255, 0.1)

Gradients:
- gradient-primary: linear-gradient(135deg, #8b5cf6, #06b6d4)
- gradient-radial: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 50%)
- gradient-mesh: complex mesh gradient for hero backgrounds
```

### Animation Tokens

```
Durations:
- instant: 100ms
- fast: 200ms
- normal: 300ms
- slow: 500ms
- slower: 700ms

Easings:
- ease-out: cubic-bezier(0.16, 1, 0.3, 1)
- ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
- bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
- spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

---

## User Stories

### Phase 1: Design Tokens & Foundation

#### US-001: Create Design Tokens Configuration
**Description:** As a developer, I need centralized design tokens so all components use consistent values.

**Acceptance Criteria:**
- [ ] Create `src/styles/tokens.ts` with all color, spacing, typography tokens
- [ ] Create `src/styles/animations.ts` with animation presets
- [ ] Update `tailwind.config.ts` to extend theme with custom tokens
- [ ] Create CSS custom properties in `globals.css` for runtime theming
- [ ] Typecheck passes

---

#### US-002: Update Global Styles & Dark Theme
**Description:** As a user, I want the entire app to use the new dark theme consistently.

**Acceptance Criteria:**
- [ ] Update `globals.css` with new dark color scheme
- [ ] Set background to #0a0a0a, remove light mode styles
- [ ] Update text colors to white/gray hierarchy
- [ ] Apply Inter font family globally
- [ ] Remove theme toggle (dark-only)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-003: Create Animation Utilities
**Description:** As a developer, I need reusable animation utilities for consistent motion.

**Acceptance Criteria:**
- [ ] Create `src/lib/animations.ts` with Framer Motion variants
- [ ] Include: fadeIn, slideUp, slideIn, scaleIn, staggerContainer
- [ ] Include scroll-triggered animation hooks
- [ ] Create `useScrollReveal` hook for intersection observer animations
- [ ] Typecheck passes

---

### Phase 2: Core Components

#### US-004: Redesign Button Component
**Description:** As a user, I want buttons with gradient backgrounds, glow effects, and smooth hover animations.

**Acceptance Criteria:**
- [ ] Create variants: primary (gradient), secondary (ghost), outline, danger
- [ ] Primary: violet gradient with glow on hover
- [ ] Add scale animation on click (0.98)
- [ ] Add loading state with spinner
- [ ] Add disabled state styling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-005: Redesign Input Component
**Description:** As a user, I want dark-styled inputs with subtle borders and focus glow.

**Acceptance Criteria:**
- [ ] Dark background (#1a1a1a) with subtle border
- [ ] Focus state: violet border glow
- [ ] Error state: red border with error message
- [ ] Support for prefix/suffix icons
- [ ] Smooth transition on focus
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-006: Redesign Select/Dropdown Component
**Description:** As a user, I want dropdown menus matching the dark theme with smooth animations.

**Acceptance Criteria:**
- [ ] Dark dropdown menu with subtle border
- [ ] Hover state: bg-elevated color
- [ ] Selected state: violet accent
- [ ] Smooth open/close animation (scale + fade)
- [ ] Support for icons in options
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-007: Create Card Component
**Description:** As a user, I want content cards with glassmorphism effect and hover animations.

**Acceptance Criteria:**
- [ ] Glassmorphism background with blur
- [ ] Subtle border (rgba white)
- [ ] Hover: lift effect with shadow increase
- [ ] Hover: subtle border glow
- [ ] Support for header, body, footer sections
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-008: Create Badge/Pill Component
**Description:** As a user, I want status badges and pills for tags and labels.

**Acceptance Criteria:**
- [ ] Variants: default, success, warning, error, info, accent
- [ ] Small, medium sizes
- [ ] Dark backgrounds with colored text
- [ ] Optional icon support
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-009: Create Toggle/Switch Component
**Description:** As a user, I want toggle switches with violet accent color.

**Acceptance Criteria:**
- [ ] Violet accent when active
- [ ] Smooth transition animation
- [ ] Disabled state
- [ ] Label support (left/right)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-010: Create Modal/Dialog Component
**Description:** As a user, I want modals with dark overlay, glassmorphism, and smooth animations.

**Acceptance Criteria:**
- [ ] Dark semi-transparent overlay
- [ ] Glassmorphism modal body
- [ ] Scale + fade entrance animation
- [ ] Close button (X) with hover state
- [ ] Click outside to close
- [ ] Escape key to close
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-011: Create Tabs Component
**Description:** As a user, I want tab navigation matching Leonardo.ai's style.

**Acceptance Criteria:**
- [ ] Subtle background on tab bar
- [ ] Active tab: accent color indicator (bottom border or background)
- [ ] Smooth transition between tabs
- [ ] Support for icons with labels
- [ ] Support for "New" badge on tabs
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-012: Create Tooltip Component
**Description:** As a user, I want informative tooltips with dark styling.

**Acceptance Criteria:**
- [ ] Dark background with subtle border
- [ ] Smooth fade-in animation
- [ ] Arrow pointing to trigger
- [ ] Support for top/bottom/left/right placement
- [ ] Delay before showing
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 3: Navigation & Layout

#### US-013: Redesign Navigation Header
**Description:** As a user, I want a sleek navigation header with glassmorphism.

**Acceptance Criteria:**
- [ ] Glassmorphism background (blur + transparency)
- [ ] Sticky positioning
- [ ] Logo with hover animation
- [ ] Nav links with hover underline effect
- [ ] User menu dropdown
- [ ] Mobile hamburger menu
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-014: Redesign Footer
**Description:** As a user, I want a dark footer consistent with the design system.

**Acceptance Criteria:**
- [ ] Dark background matching overall theme
- [ ] Gradient accent line at top (optional)
- [ ] Organized link columns
- [ ] Social icons with hover effects
- [ ] Copyright text in muted color
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-015: Create Sidebar Component
**Description:** As a user, I want a collapsible sidebar for dashboard layouts.

**Acceptance Criteria:**
- [ ] Dark background with subtle border
- [ ] Collapsible with smooth animation
- [ ] Active nav item highlight
- [ ] Icon + label nav items
- [ ] Section dividers
- [ ] Collapse toggle button
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-016: Create Page Layout Wrapper
**Description:** As a developer, I need a consistent page layout component.

**Acceptance Criteria:**
- [ ] Gradient mesh background option
- [ ] Max-width container with proper padding
- [ ] Header/footer slot support
- [ ] Scroll-to-top button
- [ ] Typecheck passes

---

### Phase 4: Rich Animations

#### US-017: Add Scroll Reveal Animations
**Description:** As a user, I want content to animate in as I scroll.

**Acceptance Criteria:**
- [ ] Create `ScrollReveal` wrapper component
- [ ] Support: fadeUp, fadeIn, slideLeft, slideRight
- [ ] Configurable threshold and delay
- [ ] Stagger children option
- [ ] Only animate once (not on scroll up)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-018: Add Parallax Effects
**Description:** As a user, I want parallax scrolling effects on hero sections.

**Acceptance Criteria:**
- [ ] Create `Parallax` component
- [ ] Support different scroll speeds
- [ ] GPU-accelerated transforms
- [ ] Mobile-friendly (reduced motion support)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-019: Add Particle Background Effect
**Description:** As a user, I want subtle animated particles in hero sections.

**Acceptance Criteria:**
- [ ] Create `ParticleBackground` component
- [ ] Configurable particle count, color, speed
- [ ] Connect particles with lines (constellation effect)
- [ ] Performant (canvas-based or optimized DOM)
- [ ] Reduced motion support
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-020: Add Gradient Mesh Background
**Description:** As a user, I want animated gradient mesh backgrounds like Leonardo.ai.

**Acceptance Criteria:**
- [ ] Create `GradientMesh` component
- [ ] Animated color blobs that slowly move
- [ ] Violet/cyan/amber color scheme
- [ ] Low performance impact
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-021: Add Page Transition Animations
**Description:** As a user, I want smooth transitions between pages.

**Acceptance Criteria:**
- [ ] Fade transition between route changes
- [ ] Optional slide direction
- [ ] Loading state during navigation
- [ ] Works with Next.js App Router
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-022: Add Hover Micro-interactions
**Description:** As a user, I want delightful micro-interactions on interactive elements.

**Acceptance Criteria:**
- [ ] Buttons: subtle scale on hover/press
- [ ] Cards: lift with shadow on hover
- [ ] Links: underline slide-in effect
- [ ] Icons: subtle rotation or bounce
- [ ] All transitions smooth (200-300ms)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 5: Page Redesigns

#### US-023: Redesign Landing/Home Page
**Description:** As a user, I want a stunning landing page with rich animations.

**Acceptance Criteria:**
- [ ] Hero section with gradient mesh background
- [ ] Animated headline with gradient text
- [ ] Particle effects in background
- [ ] CTA buttons with glow
- [ ] Feature cards with scroll reveal
- [ ] Testimonials section
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-024: Redesign About Page
**Description:** As a user, I want the about page to match the new design system.

**Acceptance Criteria:**
- [ ] Consistent dark theme
- [ ] Team section with card hover effects
- [ ] Scroll reveal animations
- [ ] Parallax image sections
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-025: Redesign Contact Page
**Description:** As a user, I want a polished contact page.

**Acceptance Criteria:**
- [ ] Redesigned form with new input components
- [ ] Submit button with loading state
- [ ] Success/error toast notifications
- [ ] Scroll reveal on form
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-026: Redesign FAQ Page
**Description:** As a user, I want an accordion FAQ with smooth animations.

**Acceptance Criteria:**
- [ ] Dark accordion component
- [ ] Smooth expand/collapse animation
- [ ] Rotate icon on open
- [ ] Staggered reveal on page load
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-027: Redesign 404 Page
**Description:** As a user, I want a creative 404 page.

**Acceptance Criteria:**
- [ ] Animated 404 text (gradient, glitch, or particles)
- [ ] Dark theme consistent
- [ ] Clear CTA to return home
- [ ] Subtle background animation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-028: Redesign Auth Pages (Login/Register)
**Description:** As a user, I want polished authentication pages.

**Acceptance Criteria:**
- [ ] Centered card layout with glassmorphism
- [ ] Gradient accent elements
- [ ] New form inputs and buttons
- [ ] Social login buttons styled
- [ ] Loading states on submit
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-029: Redesign Dashboard/Profile Pages
**Description:** As a user, I want dashboard pages with sidebar and cards.

**Acceptance Criteria:**
- [ ] Sidebar navigation
- [ ] Stat cards with subtle animations
- [ ] Data tables with new styling
- [ ] Action buttons consistent
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

### Phase 6: Polish & Documentation

#### US-030: Add Loading States & Skeletons
**Description:** As a user, I want smooth loading states throughout.

**Acceptance Criteria:**
- [ ] Create `Skeleton` component with shimmer animation
- [ ] Skeleton variants for text, card, avatar, button
- [ ] Dark theme appropriate shimmer colors
- [ ] Apply to pages with data fetching
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-031: Add Toast/Notification System
**Description:** As a user, I want styled toast notifications.

**Acceptance Criteria:**
- [ ] Dark toast styling
- [ ] Variants: success, error, warning, info
- [ ] Slide-in animation
- [ ] Auto-dismiss with progress bar
- [ ] Dismiss button
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

---

#### US-032: Add Icon System
**Description:** As a developer, I need a consistent icon system.

**Acceptance Criteria:**
- [ ] Choose icon library (Lucide recommended)
- [ ] Create `Icon` wrapper component
- [ ] Standard sizes: sm, md, lg
- [ ] Color inheritance from text
- [ ] Document available icons
- [ ] Typecheck passes

---

#### US-033: Implement Reduced Motion Support
**Description:** As a user with motion sensitivity, I want animations to respect my preferences.

**Acceptance Criteria:**
- [ ] Check `prefers-reduced-motion` media query
- [ ] Disable/reduce all animations when preferred
- [ ] Particles/parallax disabled
- [ ] Page transitions simplified
- [ ] Test with reduced motion enabled
- [ ] Typecheck passes

---

#### US-034: Create Component Documentation
**Description:** As a developer, I need documentation for the component library.

**Acceptance Criteria:**
- [ ] Create `docs/components.md` with all components
- [ ] Document props, variants, usage examples
- [ ] Include design token reference
- [ ] Include animation utility reference
- [ ] Typecheck passes

---

#### US-035: Performance Optimization
**Description:** As a user, I want animations to be smooth without jank.

**Acceptance Criteria:**
- [ ] Audit all animations for performance
- [ ] Use `transform` and `opacity` only where possible
- [ ] Implement `will-change` appropriately
- [ ] Lazy load heavy animation components (particles)
- [ ] Test on lower-end devices
- [ ] Lighthouse performance score > 90
- [ ] Typecheck passes

---

#### US-036: Final Visual QA Pass
**Description:** As a user, I want all pages to be pixel-perfect and consistent.

**Acceptance Criteria:**
- [ ] Review all pages for consistency
- [ ] Check spacing, colors, typography alignment
- [ ] Verify all animations work smoothly
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Fix any visual inconsistencies found
- [ ] Typecheck passes
- [ ] Verify all pages in browser using dev-browser skill

---

## Functional Requirements

- FR-1: All components must use design tokens from `tokens.ts`
- FR-2: All interactive elements must have hover/focus/active states
- FR-3: All animations must respect `prefers-reduced-motion`
- FR-4: All components must be responsive (mobile-first)
- FR-5: All new components must be exported from a central index
- FR-6: All pages must use consistent layout wrappers
- FR-7: All forms must show loading states during submission
- FR-8: All async operations must show appropriate loading UI

## Non-Goals

- Light mode support (dark-only per requirements)
- Internationalization (out of scope)
- Accessibility beyond basic requirements (focus states, reduced motion)
- Component library publishing (internal use only)
- Storybook setup (documentation in markdown only)

## Technical Considerations

- Use Framer Motion for all animations (already in Next.js ecosystem)
- Use Tailwind CSS extended with custom tokens
- Consider `@tsparticles/react` for particle effects
- Use CSS custom properties for potential future theming
- Lazy load animation-heavy components
- Use Intersection Observer for scroll-triggered animations

## Success Metrics

- All pages match Leonardo.ai quality level (subjective review)
- Lighthouse performance score > 90
- No animation jank on 60fps displays
- Consistent component usage across all pages
- Complete design token coverage (no hardcoded values)
- Documentation complete and accurate

## Open Questions

- Should we add sound effects to interactions? (probably not)
- Do we need a component playground/preview page?
- Should particle density vary by device capability?

---

## Story Dependency Order

```
Phase 1 (Foundation):     US-001 → US-002 → US-003
Phase 2 (Components):     US-004 through US-012 (parallel after Phase 1)
Phase 3 (Navigation):     US-013 through US-016 (after core components)
Phase 4 (Animations):     US-017 through US-022 (after US-003)
Phase 5 (Pages):          US-023 through US-029 (after components + animations)
Phase 6 (Polish):         US-030 through US-036 (after pages)
```

Total: 36 user stories
