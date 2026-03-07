# AGENTS.md

## Build & Run

Succinct rules for how to BUILD the project:

```bash
npm run dev          # Start dev server on port 7000
npm run build        # Production build
```

## Validation

Run these after implementing to get immediate feedback:

- Tests: `npm run test`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`

## Operational Notes

Succinct learnings about how to RUN the project:

- Tailwind v4 uses inline @theme in CSS, not tailwind.config.ts
- Colors defined as CSS custom properties in globals.css
- To add colors: add CSS variable + @theme declaration

### Codebase Patterns

- Styles: `src/app/globals.css` (CSS variables, @theme inline)
- Components: `src/components/ui/` (Button, Input, Card, Accordion)
- Layout: `src/components/layout/` (Header, Footer, UserDropdown)
- Pages: `src/app/*/page.tsx`
