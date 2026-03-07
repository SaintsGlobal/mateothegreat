# FD-023: Landing Page Redesign

## Overview
Redesign the landing page with gradient mesh background, particle effects, scroll animations, and gradient text.

## File
`src/app/page.tsx` (update existing)

## Dependencies
- FD-004 (Button)
- FD-017 (ScrollReveal)
- FD-019 (ParticleBackground)
- FD-020 (GradientMesh)

## Current State
- Gradient background with coral-to-cyan
- Text gradient coral-to-cyan
- NewsletterForm component
- YouTube video embed
- Feature list with basic styling

## Requirements

### Hero Section
- GradientMesh background (violet, cyan blobs)
- ParticleBackground overlay with constellation effect
- Headline with gradient text: `bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent`
- Subtitle: `text-white/60 text-lg`
- CTA buttons using new violet Button component

### Feature Cards Section
- Grid of feature cards using Card component with glassmorphism
- ScrollReveal with stagger animation
- Each card: icon, title, description
- Hover lift effect

### Social Proof / Content Section
- YouTube embed with refined dark border styling
- Newsletter signup with updated form styling

### Color Migration
- Replace all `brand-coral` references with violet gradient
- Replace `from-brand-coral to-brand-cyan` with `from-cyan-400 to-violet-500`

## Acceptance Criteria
- [ ] Hero has GradientMesh + ParticleBackground
- [ ] Gradient text uses cyan-to-violet
- [ ] Feature cards animate in with ScrollReveal
- [ ] CTA buttons use violet styling
- [ ] Page looks premium and polished
- [ ] `npm run typecheck` passes
