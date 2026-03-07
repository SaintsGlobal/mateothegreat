# FD-019: Particle Background Effect

## Description

As a user, I want subtle animated particles in hero sections.

## Acceptance Criteria

- [ ] Install: `npm install @tsparticles/react tsparticles`
- [ ] Create src/components/animation/ParticleBackground.tsx
- [ ] Use @tsparticles/react or custom canvas implementation
- [ ] Props: particleCount, color, speed, connectLines (boolean)
- [ ] Constellation effect: particles connect with lines when close
- [ ] Colors: violet/cyan matching accent palette
- [ ] Low CPU impact (limit particles, use canvas)
- [ ] Disabled when prefers-reduced-motion
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

## Configuration Example

```typescript
const options = {
  particles: {
    number: { value: 50 },
    color: { value: ["#8b5cf6", "#06b6d4"] },
    links: {
      enable: true,
      color: "#8b5cf6",
      opacity: 0.3
    },
    move: { enable: true, speed: 1 }
  }
};
```
