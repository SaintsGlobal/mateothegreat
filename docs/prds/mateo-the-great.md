# PRD: Mateo The Great Microsite

## Introduction

A minimalist fullstack microsite for the "Mateo The Great" media brand. The site serves as the brand's digital home with a striking landing page featuring YouTube content, newsletter signup via Resend, and a members-only area for exclusive content. Design inspired by Leonardo.ai's dark, sleek aesthetic with gradients and futuristic vibes.

**Brand:** Mateo The Great
**Company:** MTG Intellectual Reserve, LLC
**YouTube:** [@_mateothegreat](https://youtube.com/@_mateothegreat)
**Production URL:** www.mateothegreat.ai
**Dev Server:** localhost:7000

## Goals

- Launch a professional brand presence at mateothegreat.ai
- Capture newsletter subscribers via Resend integration
- Provide members-only exclusive content area
- Establish modern, maintainable codebase with Next.js App Router
- Deploy via Railway with CI/CD from GitHub

## User Stories

### US-001: Project Setup & Infrastructure
**Description:** As a developer, I need the project scaffolded with all tooling so I can start building features.

**Acceptance Criteria:**
- [ ] Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
- [ ] Configure for port 7000 in development
- [ ] Set up Prisma with PostgreSQL schema
- [ ] Initialize GitHub repository
- [ ] Configure Railway project with PostgreSQL database
- [ ] Set up environment variables (.env.example documented)
- [ ] Typecheck and lint pass

### US-002: Database Schema
**Description:** As a developer, I need the database schema defined for users, sessions, and content.

**Acceptance Criteria:**
- [ ] User model: id, email, name, passwordHash, createdAt, updatedAt
- [ ] NewsletterSubscriber model: id, email, subscribedAt, status
- [ ] ExclusiveContent model: id, title, slug, content, type, createdAt, publishedAt
- [ ] Migration runs successfully
- [ ] Typecheck passes

### US-003: Landing Page Hero
**Description:** As a visitor, I want to see an impactful hero section so I understand the brand immediately.

**Acceptance Criteria:**
- [ ] Full-viewport hero with brand name "Mateo The Great"
- [ ] Tagline/brand statement
- [ ] Embedded YouTube video (placeholder or latest from @_mateothegreat)
- [ ] Dark theme with gradient accents using brand colors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Navigation & Layout
**Description:** As a visitor, I want minimal navigation so I can access key sections easily.

**Acceptance Criteria:**
- [ ] Fixed header with logo/brand name
- [ ] Nav links: Home, Exclusive (shows lock if not authenticated), Sign In
- [ ] Footer with copyright "MTG Intellectual Reserve, LLC" and social links
- [ ] Smooth scroll behavior
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Newsletter Signup Component
**Description:** As a visitor, I want to subscribe to the newsletter so I stay updated.

**Acceptance Criteria:**
- [ ] Email input with validation
- [ ] Submit button with loading state
- [ ] Success/error feedback messages
- [ ] Stores subscriber in database
- [ ] Sends welcome email via Resend
- [ ] Prevents duplicate subscriptions
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Resend Integration
**Description:** As a developer, I need Resend configured for transactional emails.

**Acceptance Criteria:**
- [ ] Resend SDK installed and configured
- [ ] Welcome email template for new subscribers
- [ ] Email verification template for auth
- [ ] Password reset template
- [ ] Emails send from branded domain (noreply@mateothegreat.ai)
- [ ] Typecheck passes

### US-007: Authentication - Sign Up
**Description:** As a visitor, I want to create an account so I can access exclusive content.

**Acceptance Criteria:**
- [ ] Sign up page at /signup
- [ ] Form: email, password, confirm password
- [ ] Password requirements: min 8 chars
- [ ] Email verification flow via Resend
- [ ] Stores user with hashed password (bcrypt)
- [ ] Redirects to /account on success
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Authentication - Sign In
**Description:** As a user, I want to sign in so I can access my account.

**Acceptance Criteria:**
- [ ] Sign in page at /signin
- [ ] Form: email, password
- [ ] "Forgot password?" link
- [ ] Error message for invalid credentials
- [ ] Creates session cookie on success
- [ ] Redirects to /account or previous page
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Authentication - Password Reset
**Description:** As a user, I want to reset my password if I forget it.

**Acceptance Criteria:**
- [ ] Forgot password page at /forgot-password
- [ ] Sends reset link via Resend
- [ ] Reset page at /reset-password?token=xxx
- [ ] Token expires after 1 hour
- [ ] Success redirects to sign in
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Account Management Page
**Description:** As a user, I want to manage my account settings.

**Acceptance Criteria:**
- [ ] Account page at /account (protected route)
- [ ] Display current email and name
- [ ] Edit name functionality
- [ ] Change password functionality
- [ ] Sign out button
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Exclusive Content - List View
**Description:** As a member, I want to see all exclusive content available to me.

**Acceptance Criteria:**
- [ ] Exclusive content page at /exclusive (protected route)
- [ ] Grid/list of content cards with title, type, date
- [ ] Content types: article, video, announcement
- [ ] Empty state if no content yet
- [ ] Non-authenticated users see teaser + sign up CTA
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: Exclusive Content - Detail View
**Description:** As a member, I want to view individual exclusive content pieces.

**Acceptance Criteria:**
- [ ] Content detail page at /exclusive/[slug] (protected route)
- [ ] Renders markdown/rich content
- [ ] Shows publish date and content type
- [ ] Back to list link
- [ ] Non-authenticated users redirected to sign in
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: Railway Deployment Configuration
**Description:** As a developer, I need Railway configured for production deployment.

**Acceptance Criteria:**
- [ ] Railway project created and linked via CLI
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured in Railway
- [ ] Auto-deploy from main branch
- [ ] Custom domain www.mateothegreat.ai configured
- [ ] Health check endpoint at /api/health
- [ ] Document SSL/DNS setup steps for Squarespace

### US-014: Design System & Styling
**Description:** As a developer, I need a consistent design system using the brand color palette.

**Acceptance Criteria:**
- [ ] Tailwind config with brand colors (green #5EC180, cyan #4CC2D5, coral #FF7593, orange #FF9F55, lightYellow #FFD683, gold #FFC927, gray #BCBCBC)
- [ ] Dark theme base (#0a0a0a, #1a1a1a)
- [ ] Gradient utilities using brand colors
- [ ] Glow/blur effects for cards and buttons
- [ ] Typography scale with Inter font
- [ ] Button, input, and card component styles
- [ ] Smooth transitions and hover states
- [ ] Typecheck passes

### US-015: Seed Placeholder Content
**Description:** As a developer, I need placeholder exclusive content for the members area.

**Acceptance Criteria:**
- [ ] Prisma seed script created
- [ ] 3 placeholder articles about current AI news (Claude 4, GPT-5 rumors, AI agents)
- [ ] Articles have realistic titles, dates, and markdown content
- [ ] Seed runs successfully
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Site runs on localhost:7000 in development
- FR-2: All pages server-rendered by default (App Router)
- FR-3: Authentication uses HTTP-only session cookies
- FR-4: Passwords hashed with bcrypt (cost factor 12)
- FR-5: Protected routes redirect to /signin if unauthenticated
- FR-6: Newsletter subscribers stored in database and synced to Resend
- FR-7: YouTube embed uses privacy-enhanced mode (youtube-nocookie.com)
- FR-8: All forms use Server Actions for submissions
- FR-9: Rate limiting on auth endpoints (5 attempts per minute)
- FR-10: Responsive breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)

## Non-Goals

- No admin panel/CMS (content managed directly in database for now)
- No social login (Google, GitHub, etc.)
- No payment/subscription features
- No blog or public content beyond landing page
- No analytics integration (add later)
- No dark/light mode toggle (dark mode only)

## Design Considerations

- **Inspiration:** Leonardo.ai aesthetic - dark backgrounds (#0a0a0a to #1a1a1a), subtle glow effects, glassmorphism cards
- **Brand Color Palette:**
  - Green: `#5EC180`
  - Cyan: `#4CC2D5`
  - Coral: `#FF7593`
  - Orange: `#FF9F55`
  - Light Yellow: `#FFD683`
  - Gold: `#FFC927`
  - Gray: `#BCBCBC`
- **Typography:** Inter or similar modern sans-serif
- **Spacing:** Generous whitespace, breathing room between sections
- **Animations:** Subtle fade-ins, smooth hover transitions
- **Mobile:** Hamburger menu, stacked layouts, touch-friendly targets
- **YouTube Hero:** Use placeholder video or latest from @_mateothegreat channel

## Technical Considerations

- **Framework:** Next.js 14+ with App Router
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Custom implementation with bcrypt + session cookies
- **Email:** Resend SDK
- **Styling:** Tailwind CSS v3
- **Deployment:** Railway (with Railway CLI for management)
- **Repository:** GitHub (new repo to be initialized)

### Environment Variables Required
```
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
SESSION_SECRET=...
NEXT_PUBLIC_SITE_URL=https://www.mateothegreat.ai
```

## Success Metrics

- Site loads in under 2 seconds on 3G
- Newsletter signup conversion rate > 5%
- Zero authentication security vulnerabilities
- 100% Lighthouse accessibility score
- Successful deployment pipeline with <5 min build times

## Open Questions

- ~~What specific YouTube video(s) to feature on hero?~~ **Resolved:** Use placeholder or latest from @_mateothegreat
- ~~Any existing brand assets (logo, colors) to incorporate?~~ **Resolved:** Brand color palette provided
- ~~Initial exclusive content to seed the members area?~~ **Resolved:** Placeholder AI news articles
- ~~Resend domain verification - do you have DNS access for mateothegreat.ai?~~ **Resolved:** Yes, via Squarespace
