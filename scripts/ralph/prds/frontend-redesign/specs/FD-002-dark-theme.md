# FD-002: Global Dark Theme Styles

## Description

As a user, I want the entire app to use the new dark theme consistently.

## Acceptance Criteria

- [ ] Update globals.css with dark color scheme from tokens
- [ ] Set html/body background to #0a0a0a
- [ ] Remove all light mode styles and theme toggle logic
- [ ] Update default text color to white with secondary gray hierarchy
- [ ] Add Inter font family via Google Fonts or next/font
- [ ] Remove ThemeProvider or set to dark-only
- [ ] npm run typecheck passes
- [ ] Verify in browser using dev-browser skill

## Implementation Notes

- Delete src/components/ui/theme-toggle.tsx
- Remove any ThemeProvider wrapping
- Existing dark foundation: #0a0a0a bg, Inter font already configured
