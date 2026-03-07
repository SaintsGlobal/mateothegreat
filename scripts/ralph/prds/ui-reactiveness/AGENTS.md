# AGENTS.md

## Build & Run

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
```

## Validation

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm run test`

## Operational Notes

<!-- Ralph appends operational learnings here -->

### Codebase Patterns

- Animation tokens in `src/styles/animations.ts`
- Design tokens in `src/styles/tokens.ts`
- UI components in `src/components/ui/*.tsx`
- Use Tailwind classes for transitions (duration-X, ease-X)
- Prefer CSS transforms over layout properties for animations
