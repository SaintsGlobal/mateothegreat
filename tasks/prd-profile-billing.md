# PRD: User Profile & Billing System

## Introduction

Add a comprehensive user profile page with account management, personalization options, and a full billing portal. The billing system will be Stripe-ready with stubbed endpoints and mock data, allowing the frontend and data models to be built now while actual payment processing is connected later. Users can manage their subscription (Free/Premium tiers), view payment methods, and access invoice history.

## Goals

- Create a full-featured profile page at `/profile` for authenticated users
- Implement subscription tier system (Free / Premium) with database models
- Build billing portal UI with plan management, payment methods, and invoices
- Stub all Stripe-related endpoints with realistic mock data
- Prepare database schema for seamless Stripe integration later
- Maintain consistent dark theme aesthetic matching existing site

## User Stories

### US-001: Subscription & Billing Database Models
**Description:** As a developer, I need database models for subscriptions and billing so user tier data persists.

**Acceptance Criteria:**
- [ ] Add `Subscription` model: id, userId, tier (FREE|PREMIUM), status (ACTIVE|CANCELED|PAST_DUE), stripeSubscriptionId (nullable), stripeCustomerId (nullable), currentPeriodStart, currentPeriodEnd, createdAt, updatedAt
- [ ] Add `PaymentMethod` model: id, userId, type (CARD), last4, brand, expiryMonth, expiryYear, isDefault, stripePaymentMethodId (nullable), createdAt
- [ ] Add `Invoice` model: id, userId, subscriptionId, amount, currency, status (PAID|PENDING|FAILED), stripeInvoiceId (nullable), pdfUrl (nullable), periodStart, periodEnd, createdAt
- [ ] Add tier field to User model: `tier` enum (FREE|PREMIUM) with default FREE
- [ ] Run migration successfully
- [ ] Typecheck passes

### US-002: Profile Page Layout & Navigation
**Description:** As a user, I want a profile page with clear sections so I can manage my account.

**Acceptance Criteria:**
- [ ] Create profile page at `/profile` (protected route)
- [ ] Sidebar navigation with sections: Profile, Preferences, Billing, Invoices
- [ ] Active section highlighted in sidebar
- [ ] URL updates with section (e.g., `/profile?section=billing`)
- [ ] Mobile: collapsible sidebar or tab navigation
- [ ] Redirect to `/signin` if not authenticated
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Profile Section - Basic Info
**Description:** As a user, I want to view and edit my profile information.

**Acceptance Criteria:**
- [ ] Display current name and email
- [ ] Avatar display with placeholder (initials-based) if no image
- [ ] Edit name with inline save
- [ ] Email shown as read-only (with note: "Contact support to change")
- [ ] Show account creation date
- [ ] Show current subscription tier badge (Free/Premium)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Profile Section - Avatar Upload
**Description:** As a user, I want to upload a profile picture so my account feels personalized.

**Acceptance Criteria:**
- [ ] Add `avatarUrl` field to User model (nullable string)
- [ ] Avatar upload button with file picker
- [ ] Accept jpg, png, webp up to 2MB
- [ ] Preview before save
- [ ] Store in `/public/avatars/{userId}.{ext}` (or prepare for S3 later)
- [ ] Fallback to initials avatar if no upload
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Profile Section - Change Password
**Description:** As a user, I want to change my password from my profile.

**Acceptance Criteria:**
- [ ] Change password form: current password, new password, confirm new password
- [ ] Validate current password before allowing change
- [ ] Password requirements: min 8 characters
- [ ] Success message on completion
- [ ] Error handling for incorrect current password
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Preferences Section - Bio & Display
**Description:** As a user, I want to set a bio and display preferences.

**Acceptance Criteria:**
- [ ] Add `bio` field to User model (nullable, max 500 chars)
- [ ] Add `preferences` JSON field to User model for extensible settings
- [ ] Bio textarea with character count
- [ ] Toggle for "Show email on profile" (stored in preferences)
- [ ] Save button with loading state
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Preferences Section - Notification Settings
**Description:** As a user, I want to control what notifications I receive.

**Acceptance Criteria:**
- [ ] Email notification toggles: Newsletter updates, New content alerts, Account activity
- [ ] Store in user preferences JSON
- [ ] Changes save immediately with toast confirmation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Billing Section - Current Plan Display
**Description:** As a user, I want to see my current subscription plan clearly.

**Acceptance Criteria:**
- [ ] Display current tier (Free or Premium) with visual distinction
- [ ] Show plan features comparison (Free: newsletters only / Premium: exclusive content + early access)
- [ ] For Premium: show billing cycle dates (current period start/end)
- [ ] For Premium: show next billing date and amount
- [ ] For Free: prominent upgrade CTA
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Billing Section - Upgrade/Downgrade Flow (Stubbed)
**Description:** As a user, I want to change my subscription plan.

**Acceptance Criteria:**
- [ ] "Upgrade to Premium" button for Free users
- [ ] "Manage Plan" dropdown for Premium users (Change plan, Cancel subscription)
- [ ] Clicking upgrade shows pricing modal: $9.99/month for Premium
- [ ] "Subscribe" button calls stubbed API endpoint
- [ ] Stub returns success with mock subscription data
- [ ] UI updates to show Premium tier after "upgrade"
- [ ] Cancel flow shows confirmation modal with "Your access continues until {date}"
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Billing Section - Payment Methods (Stubbed)
**Description:** As a user, I want to manage my payment methods.

**Acceptance Criteria:**
- [ ] List saved payment methods (cards) with last4, brand icon, expiry
- [ ] "Default" badge on primary payment method
- [ ] "Add payment method" button opens modal
- [ ] Modal has card input fields (stubbed - just collects data, doesn't validate)
- [ ] "Add Card" calls stubbed endpoint, returns mock card data
- [ ] "Remove" button on non-default cards with confirmation
- [ ] "Set as default" option on cards
- [ ] Empty state: "No payment methods" with add CTA
- [ ] Note: "Payment processing will be available soon" indicator
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Invoices Section - Invoice History (Stubbed)
**Description:** As a user, I want to view my billing history.

**Acceptance Criteria:**
- [ ] Table/list of invoices: date, amount, status, download link
- [ ] Status badges: Paid (green), Pending (yellow), Failed (red)
- [ ] "Download PDF" button (stubbed - shows toast "PDF generation coming soon")
- [ ] Pagination if more than 10 invoices
- [ ] For Free users: "No invoices - upgrade to Premium to see billing history"
- [ ] Mock data: show 3 sample invoices for Premium users
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: Stubbed Billing API Endpoints
**Description:** As a developer, I need API endpoints that simulate Stripe operations.

**Acceptance Criteria:**
- [ ] `POST /api/billing/subscribe` - Creates mock subscription, returns subscription object
- [ ] `POST /api/billing/cancel` - Marks subscription as canceled (effective end of period)
- [ ] `POST /api/billing/payment-methods` - Adds mock payment method
- [ ] `DELETE /api/billing/payment-methods/[id]` - Removes payment method
- [ ] `PATCH /api/billing/payment-methods/[id]/default` - Sets as default
- [ ] `GET /api/billing/invoices` - Returns mock invoice list
- [ ] All endpoints update database models (real data, just no Stripe calls)
- [ ] Add `// TODO: Replace with Stripe API call` comments at integration points
- [ ] Typecheck passes

### US-013: Subscription Service Layer
**Description:** As a developer, I need a service layer that abstracts billing operations for easy Stripe integration later.

**Acceptance Criteria:**
- [ ] Create `src/lib/billing/subscription-service.ts`
- [ ] Functions: `createSubscription()`, `cancelSubscription()`, `getSubscription()`, `updateSubscription()`
- [ ] Create `src/lib/billing/payment-service.ts`
- [ ] Functions: `addPaymentMethod()`, `removePaymentMethod()`, `setDefaultPaymentMethod()`, `listPaymentMethods()`
- [ ] Create `src/lib/billing/invoice-service.ts`
- [ ] Functions: `listInvoices()`, `getInvoice()`, `generateInvoicePdf()` (stub)
- [ ] Each function has clear `// STRIPE_INTEGRATION_POINT` marker
- [ ] Typecheck passes

### US-014: Content Access Control by Tier
**Description:** As a developer, I need tier-based access control for exclusive content.

**Acceptance Criteria:**
- [ ] Create `src/lib/auth/tier-guard.ts` utility
- [ ] `requireTier(tier: 'FREE' | 'PREMIUM')` middleware/helper
- [ ] `/exclusive` pages check user tier before rendering content
- [ ] Free users see content previews with "Upgrade to access" overlay
- [ ] Premium users see full content
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-015: Profile Header Component
**Description:** As a user, I want to see my profile summary in navigation.

**Acceptance Criteria:**
- [ ] User dropdown in header shows: avatar, name, tier badge
- [ ] Dropdown menu: Profile, Billing, Sign out
- [ ] Link to `/profile` from dropdown
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-016: Seed Mock Billing Data
**Description:** As a developer, I need seed data for testing the billing UI.

**Acceptance Criteria:**
- [ ] Extend Prisma seed script
- [ ] Create test user with Premium subscription
- [ ] Add 2 mock payment methods (Visa, Mastercard)
- [ ] Add 3 mock invoices (paid status, different months)
- [ ] Seed runs successfully
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Profile page requires authentication; redirects to `/signin` if not logged in
- FR-2: Subscription tiers: FREE (default) and PREMIUM ($9.99/month)
- FR-3: Free tier access: public pages, newsletters
- FR-4: Premium tier access: all Free content + exclusive content area
- FR-5: Billing operations update database immediately (for stubbed version)
- FR-6: All billing service functions have clear Stripe integration points marked
- FR-7: Avatar upload limited to 2MB, stored locally (prepared for S3)
- FR-8: Password changes require current password verification
- FR-9: Preferences stored as JSON for flexibility
- FR-10: Invoice list paginates at 10 items per page

## Non-Goals

- No actual Stripe integration (stubs only)
- No real payment processing
- No webhook handling (will be added with Stripe)
- No proration calculations for plan changes
- No multiple subscription products (single Premium tier only)
- No team/organization billing
- No usage-based metering
- No coupon/discount codes

## Design Considerations

- **Layout:** Two-column on desktop (sidebar + content), single column on mobile
- **Tier Badges:** Free (gray), Premium (gold/brand gradient)
- **Card Icons:** Use brand icons for Visa, Mastercard, Amex, etc.
- **Status Colors:** Paid=green (#5EC180), Pending=yellow (#FFC927), Failed=red/coral (#FF7593)
- **Upgrade CTA:** Prominent gradient button matching brand aesthetic
- **Empty States:** Helpful messages with clear CTAs, not just "No data"
- **Stubbed Indicators:** Subtle "Coming soon" or info icon where features are stubbed

## Technical Considerations

- **Stripe Preparation:** All IDs (stripeCustomerId, stripeSubscriptionId, etc.) are nullable, allowing records to exist before Stripe connection
- **Service Layer:** Abstract all billing logic into service files for easy swap to real Stripe SDK
- **Type Safety:** Create TypeScript types matching Stripe's response shapes for smooth migration
- **Environment Variables:** Document required Stripe keys (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET) in `.env.example` as placeholders
- **Webhook Ready:** Design Invoice model to be populated by Stripe webhooks later

### Future Stripe Integration Points
```typescript
// subscription-service.ts
async function createSubscription(userId: string, priceId: string) {
  // STRIPE_INTEGRATION_POINT: Replace with stripe.subscriptions.create()
  // For now, create local subscription record with mock data
}
```

## Success Metrics

- Profile page loads in under 2 seconds
- All billing UI elements render correctly with mock data
- Tier-based access control works (Free users blocked from Premium content)
- Zero TypeScript errors in billing service layer
- Clear path to Stripe integration (documented TODO markers)

## Open Questions

- Should we support annual billing option (with discount) in the future?
- Will there be a trial period for Premium?
- Should canceled users retain access to previously-viewed exclusive content?
