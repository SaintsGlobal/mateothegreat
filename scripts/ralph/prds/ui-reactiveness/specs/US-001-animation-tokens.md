# US-001: Faster Animation Tokens

## Description

As a user, I want interactions to feel instant so the UI doesn't feel sluggish.

## Acceptance Criteria

- [ ] Add `instant: 50` and `quick: 100` to duration tokens
- [ ] Update default transitions to use faster timings
- [ ] Add `snappy` easing curve for micro-interactions
- [ ] Typecheck passes

## Implementation Notes

Update `src/styles/animations.ts`:

```typescript
export const duration = {
  instant: 50,   // NEW: micro-interactions
  quick: 100,    // NEW: hover states
  fast: 150,     // Updated from 200
  normal: 200,   // Updated from 300
  slow: 400,     // Updated from 500
} as const;

export const easing = {
  // ... existing
  snappy: "cubic-bezier(0.2, 0, 0, 1)", // NEW: quick deceleration
} as const;
```
