# AGENTS.md

## Build & Run

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

## Validation

- Tests: `npm run test` (vitest)
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint` — Note: currently broken due to missing ESLint config (pre-existing issue, not related to scroll-story work)

## Operational Notes

- `npm run typecheck` may not exist; use `npx tsc --noEmit` directly
- Next.js 16.1.6 — uses new app router patterns

### Codebase Patterns

- Animation hooks live in `src/hooks/use-scroll-animations.ts`; existing hooks in `useReducedMotion.ts` and `useScrollReveal.ts`
- `useMediaQuery` uses `useSyncExternalStore` for SSR-safe media query detection
- Server components pass serialized data to client animation wrappers (see exclusive page pattern)
