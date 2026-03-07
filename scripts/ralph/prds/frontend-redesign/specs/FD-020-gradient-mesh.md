# FD-020: Gradient Mesh Background

## Description

As a user, I want animated gradient mesh backgrounds like Leonardo.ai.

## Acceptance Criteria

- [ ] Create src/components/animation/GradientMesh.tsx
- [ ] Multiple gradient blobs that slowly drift/morph
- [ ] Colors: violet (#8b5cf6), cyan (#06b6d4), subtle amber
- [ ] CSS animation or Framer Motion for blob movement
- [ ] Blur filter on blobs for soft effect
- [ ] Low performance impact (CSS preferred over JS)
- [ ] Covers full section behind content
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

## CSS Implementation

```css
.gradient-blob {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: blob-drift 20s infinite ease-in-out;
}

@keyframes blob-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 20px) scale(0.9); }
}
```
