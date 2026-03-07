# Implementation Plan

## Status: ALL COMPLETE

All 12 user stories implemented in a single pass. Typecheck, lint, and build all pass.

## Priority 1: Foundation (must be done first)

### US-001: Faster Animation Tokens — COMPLETE
- **File:** `src/styles/animations.ts`
- **Status:** `instant: 50` MISSING, `quick: 100` MISSING, `snappy` easing MISSING
- **Changes needed:**
  - Add `instant: 50` and `quick: 100` to `duration` object
  - Update `fast: 200` → `fast: 150`, `normal: 300` → `normal: 200`, `slow: 500` → `slow: 400`
  - Add `snappy: "cubic-bezier(0.2, 0, 0, 1)"` to `easing` object
  - Add `instant` and `quick` entries to `transition` object
- **Risk:** Changing existing token values may affect components already using them. Verify all consumers after update.
- **Depends on:** Nothing

## Priority 2: Core Interactive Components

### US-002: Button Micro-interactions — COMPLETE
- **File:** `src/components/ui/button.tsx`
- **Current:** `duration-200 ease-out`, no `hover:brightness-110`, `active:scale-[0.98]` EXISTS
- **Changes needed:**
  - Change `duration-200` → `duration-100` (or `duration-75`)
  - Add `hover:brightness-110` for subtle brightness feedback
  - Focus ring: change inherited 200ms → add explicit `duration-75` for ring
- **Depends on:** US-001

### US-003: Input Focus States — COMPLETE
- **File:** `src/components/ui/input.tsx`
- **Current:** `duration-200`, has `focus:ring-2` but no glow from tokens, no placeholder transition
- **Changes needed:**
  - Change `duration-200` → `duration-100`
  - Add glow effect using `glows.violetSubtle` from tokens (box-shadow style)
  - Add `placeholder:transition-opacity placeholder:duration-100` for placeholder fade
- **Depends on:** US-001

### US-004: Card Hover Effects — COMPLETE
- **File:** `src/components/ui/card.tsx`
- **Current:** `duration-300`, `hover:-translate-y-0.5` EXISTS, no default border highlight on hover
- **Changes needed:**
  - Change `duration-300` → `duration-100`
  - Add `hover:border-white/20` for default (non-glow) cards
  - Verify no layout shift (already uses transform, should be fine)
- **Depends on:** US-001

### US-005: Toggle/Switch Animations — COMPLETE
- **File:** `src/components/ui/Toggle.tsx`
- **Current:** `duration-200 ease-out` for both track and knob, no spring easing
- **Changes needed:**
  - Knob: change easing to spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, `duration-150`
  - Track color: `duration-100`
- **Depends on:** US-001

## Priority 3: Dropdown & Overlay Components

### US-006: Select/Dropdown Transitions — COMPLETE
- **File:** `src/components/ui/Select.tsx`
- **Current:** `duration-150` for open/chevron, no explicit option hover duration
- **Changes needed:**
  - Open animation: `duration-100` (from 150)
  - Option hover: add explicit `duration-50`
  - Close: match open duration or slightly faster
  - Chevron: `duration-100` (from 150)
- **Depends on:** US-001

### US-007: Modal Transitions — COMPLETE
- **File:** `src/components/ui/Modal.tsx`
- **Current:** Entry `duration-200`, backdrop `duration-200`, NO exit animation (instant removal)
- **Changes needed:**
  - Entry: `duration-150` (from 200)
  - Backdrop: `duration-100` (from 200)
  - Exit: Add exit animation `duration-100` (requires state management for unmount delay)
- **Note:** Exit animation is the most complex change — need to delay `return null` to allow animation to play. Consider adding an `isClosing` state or using CSS `animate-out` classes.
- **Depends on:** US-001

### US-010: Tooltip Appearance — COMPLETE
- **File:** `src/components/ui/Tooltip.tsx`
- **Current:** Show delay 200ms, fade-in `duration-150`
- **Changes needed:**
  - Default delay: 200ms → 100ms
  - Fade-in: `duration-150` → `duration-75`
  - Exit: add `duration-50` or make instant
- **Depends on:** US-001

## Priority 4: Feedback & Loading Components

### US-008: Toast Notifications — COMPLETE
- **File:** `src/components/ui/Toast.tsx`
- **Current:** Entry `duration-200` slide-in-from-right, progress bar `duration-100`
- **Changes needed:**
  - Entry: `duration-150` (from 200)
  - Auto-dismiss exit: `duration-200` (add explicit exit animation)
  - Manual dismiss: `duration-75` (quick exit)
- **Note:** May need exit animation state similar to Modal (US-007)
- **Depends on:** US-001

### US-009: Skeleton Loading States — COMPLETE
- **File:** `src/components/ui/Skeleton.tsx`
- **Current:** Shimmer at 1.5s cycle (CORRECT per spec), no content transition
- **Changes needed:**
  - Verify pulse/shimmer is smooth 60fps (likely already fine with CSS animation)
  - Add content transition: fade-in `duration-200` when content replaces skeleton
  - Consider if shimmer effect needs enhancement for premium feel
- **Note:** Content transition may require a wrapper component or usage pattern change
- **Depends on:** US-001

## Priority 5: Navigation Components

### US-011: Tab Switching — COMPLETE
- **File:** `src/components/ui/Tabs.tsx`
- **Current:** `duration-200` for all, no spring physics, no active indicator animation
- **Changes needed:**
  - Active indicator: add spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)`, keep `duration-200`
  - Tab hover: `duration-50`
  - Content: ensure instant swap (no transition on content area)
- **Depends on:** US-001

### US-012: Sidebar Transitions — COMPLETE
- **File:** `src/components/ui/Sidebar.tsx`
- **Current:** Width `duration-300`, text `duration-200`, chevron `duration-300`
- **Changes needed:**
  - Width: `duration-300` → `duration-200` with ease-out
  - Text fade: `duration-200` → `duration-100`
  - Chevron: `duration-300` → `duration-200`
  - Icons: should have no transition (stay in place) — verify current behavior
- **Depends on:** US-001

## Additional Observations

### Broader Duration Cleanup (out of scope but noted)
These files also use `duration-200` or `duration-300` but are NOT in specs:
- `src/components/ui/accordion.tsx` — `duration-300` (2x)
- `src/components/layout/footer.tsx` — `duration-300` (3x)
- `src/components/layout/PageLayout.tsx` — `duration-200`
- `src/components/contact-form.tsx` — `duration-200`
- `src/components/newsletter/blocks/expandable-block.tsx` — `duration-200`
- `src/components/newsletter/blocks/tabs-block.tsx` — `duration-200`
- `src/components/newsletter/blocks/link-snippet.tsx` — `duration-200`
- `src/app/globals.css` — `duration-200` and `duration-300` in keyframes

