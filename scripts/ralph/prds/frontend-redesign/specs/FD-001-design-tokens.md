# FD-001: Design Tokens Configuration

## Description

As a developer, I need centralized design tokens so all components use consistent values.

## Acceptance Criteria

- [ ] Create src/styles/tokens.ts with color palette: bg (#0a0a0a, #111, #1a1a1a), text (white hierarchy), accents (violet-500 #8b5cf6, cyan-500 #06b6d4)
- [ ] Add border tokens: subtle (rgba 0.06), default (0.1), strong (0.15)
- [ ] Add glow effects: glow-primary, glow-cyan with rgba values
- [ ] Create src/styles/animations.ts with duration (fast 200ms, normal 300ms, slow 500ms) and easing presets
- [ ] Update tailwind.config.ts to extend theme with custom tokens
- [ ] Create CSS custom properties in globals.css for all tokens
- [ ] npm run typecheck passes

## Implementation Notes

- Tailwind v4 uses inline @theme in CSS, not tailwind.config.ts
- Add CSS variables in :root, then reference in @theme inline block
