# Frontend Redesign - Leonardo.ai Inspired

## Overview

Complete frontend overhaul to achieve an industry-grade, premium dark UI inspired by Leonardo.ai. Dark-only theme, rich animations (parallax, particles, scroll reveals), glassmorphism effects, and a comprehensive component library with design tokens.

## Tech Stack

- **Frontend**: React + Tailwind CSS + Framer Motion
- **Animations**: Framer Motion + CSS transitions
- **Particles**: @tsparticles/react
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## Design Principles

1. **Dark-only theme** - No light mode support
2. **Rich animations** - Scroll reveals, parallax, micro-interactions
3. **Glassmorphism** - Frosted glass effects on cards and modals
4. **Consistent tokens** - Centralized design tokens for colors, spacing, shadows
5. **Performance-first** - GPU-accelerated animations, lazy loading

## Color Palette

- **Background**: #0a0a0a (primary), #111111 (surface), #1a1a1a (elevated)
- **Text**: white (primary), rgba(255,255,255,0.7) (secondary), rgba(255,255,255,0.5) (muted)
- **Accent Primary**: violet-500 (#8b5cf6)
- **Accent Secondary**: cyan-500 (#06b6d4)
- **Borders**: rgba(255,255,255,0.06-0.15)

## Non-Goals

- Light mode support
- Internationalization/i18n
- Component library npm publishing
- Storybook setup
- Full WCAG AAA accessibility compliance
- Server-side rendering optimization
- E2E test updates for new components

## Dependencies to Install

```bash
npm install framer-motion lucide-react @tsparticles/react tsparticles
```
