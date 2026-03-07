# AGENTS.md - Operational Reference

This file is auto-updated by Ralph as it learns operational details about the codebase.

## Build & Run

```bash
npm run dev          # Start dev server on port 7000
npm run build        # Production build
```

## Validation

```bash
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright E2E tests
```

## Database

```bash
npx prisma db push   # Apply schema changes
npx prisma generate  # Regenerate client
npx prisma studio    # Database GUI
```

## Key Paths

- Prisma client: `src/lib/db.ts`
- Server Actions: `src/app/*/actions.ts`
- Components: `src/components/`

## Conventions

- Server Actions preferred over API routes
- Dark theme with brand colors (cyan, coral, gold)
- Use existing utilities before creating new ones

## Learned Notes

<!-- Ralph updates this section as it learns -->
