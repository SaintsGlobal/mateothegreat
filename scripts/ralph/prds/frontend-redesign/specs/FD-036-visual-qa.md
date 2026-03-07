# FD-036: Final Visual QA Pass

## Overview
Comprehensive visual review of all pages for consistency, responsiveness, and cross-browser compatibility.

## Requirements

### Consistency Check
- All pages use design tokens consistently
- No hardcoded colors outside the token system
- Spacing follows consistent patterns
- Typography hierarchy is uniform

### Responsive Testing
- 375px (mobile)
- 768px (tablet)
- 1280px+ (desktop)
- All components adapt correctly
- No horizontal overflow
- Touch targets minimum 44x44px on mobile

### Cross-browser
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Verify backdrop-blur support and fallbacks

### Animation Review
- All animations are smooth (60fps)
- No janky transitions
- Reduced motion respected
- No animation on page load that causes CLS

### Newsletter Page Fix
- Fix newsletter pages to use brand color system instead of generic Tailwind grays
- `src/app/newsletters/page.tsx` and `src/app/newsletters/[slug]/page.tsx`

## Acceptance Criteria
- [ ] All pages visually consistent
- [ ] Responsive at all breakpoints
- [ ] Cross-browser compatible
- [ ] Newsletter pages use brand colors
- [ ] No visual regressions
