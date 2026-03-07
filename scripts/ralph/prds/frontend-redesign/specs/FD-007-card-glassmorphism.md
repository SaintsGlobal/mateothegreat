# FD-007: Card Component with Glassmorphism

## Description

As a user, I want content cards with glassmorphism effect and hover animations.

## Acceptance Criteria

- [ ] Create src/components/ui/Card.tsx
- [ ] Background: rgba(17,17,17,0.8) with backdrop-blur-md
- [ ] Border: 1px solid rgba(255,255,255,0.1)
- [ ] Border radius: rounded-xl (1rem)
- [ ] Hover: translateY(-2px) with increased shadow
- [ ] Hover: border glow effect (optional violet tint)
- [ ] Support header, body, footer slots via children or props
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

## Glassmorphism Recipe

```css
.card-glass {
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```
