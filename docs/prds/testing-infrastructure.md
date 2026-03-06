# PRD: Testing Infrastructure

## Introduction

Add comprehensive testing infrastructure to the Mateo The Great microsite. This includes E2E tests with Playwright for critical user flows, unit tests with Vitest for business logic, visual regression testing for UI consistency, and CI pipelines that run on GitHub Actions before Railway deploys.

## Goals

- Catch regressions before they reach production
- Validate critical user flows (auth, newsletter) work end-to-end
- Ensure UI consistency across changes with visual snapshots
- Provide fast feedback loop for developers
- Block broken code from deploying via CI checks

## User Stories

### US-001: Vitest Setup
**Description:** As a developer, I need Vitest configured for unit and integration tests.

**Acceptance Criteria:**
- [ ] Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
- [ ] Create `vitest.config.ts` with jsdom environment and path aliases matching tsconfig
- [ ] Add `test` and `test:coverage` scripts to package.json
- [ ] Create `src/__tests__/setup.ts` with Testing Library matchers
- [ ] Verify: `npm run test` runs without errors (even with no tests yet)

### US-002: Playwright Setup
**Description:** As a developer, I need Playwright configured for E2E and visual regression tests.

**Acceptance Criteria:**
- [ ] Run: `npm install -D @playwright/test`
- [ ] Run: `npx playwright install chromium` (single browser for MVP)
- [ ] Create `playwright.config.ts` with baseURL `http://localhost:7000`, screenshot on failure
- [ ] Add `e2e` and `e2e:ui` scripts to package.json
- [ ] Create `e2e/` directory for test files
- [ ] Verify: `npm run e2e` runs without errors

### US-003: Test Database Setup
**Description:** As a developer, I need an isolated test database so tests don't affect development data.

**Acceptance Criteria:**
- [ ] Create `.env.test` with separate DATABASE_URL (use Railway test DB or local PostgreSQL)
- [ ] Create `scripts/setup-test-db.sh` that runs `prisma db push` with test env
- [ ] Add `pretest` script that loads `.env.test` before running tests
- [ ] Document test database setup in README or TESTING.md
- [ ] Verify: Tests can connect to test database

### US-004: Mock Email Service
**Description:** As a developer, I need email sending mocked during tests so we don't send real emails.

**Acceptance Criteria:**
- [ ] Create `src/lib/__mocks__/email.ts` that exports mock resend client
- [ ] Mock captures sent emails in memory for assertions
- [ ] Export `getLastEmail()` and `clearEmails()` helpers for tests
- [ ] Configure Vitest to use mocks via `vi.mock()`
- [ ] Verify: Unit tests can assert on email content without sending

### US-005: Auth Unit Tests
**Description:** As a developer, I need unit tests for password hashing and session utilities.

**Acceptance Criteria:**
- [ ] Create `src/lib/__tests__/auth.test.ts`
- [ ] Test: `hashPassword()` returns different hash each time (salt)
- [ ] Test: `verifyPassword()` returns true for correct password
- [ ] Test: `verifyPassword()` returns false for wrong password
- [ ] Test: `generateSessionToken()` returns 64-char hex string
- [ ] Verify: `npm run test` passes

### US-006: Newsletter Signup Unit Tests
**Description:** As a developer, I need unit tests for newsletter subscription logic.

**Acceptance Criteria:**
- [ ] Create `src/app/actions/__tests__/newsletter.test.ts`
- [ ] Test: Invalid email returns error
- [ ] Test: Valid email creates subscriber in database
- [ ] Test: Duplicate email returns appropriate message
- [ ] Test: Welcome email is sent on successful signup
- [ ] Verify: `npm run test` passes

### US-007: E2E Homepage Test
**Description:** As a developer, I need E2E tests verifying the homepage loads correctly.

**Acceptance Criteria:**
- [ ] Create `e2e/homepage.spec.ts`
- [ ] Test: Page title is "Mateo The Great"
- [ ] Test: Hero heading "Mateo The Great" is visible
- [ ] Test: YouTube embed iframe exists
- [ ] Test: Newsletter form is visible
- [ ] Test: Navigation links (Home, Exclusive, Sign In) are present
- [ ] Verify: `npm run e2e` passes

### US-008: E2E Signup Flow Test
**Description:** As a developer, I need E2E tests for the complete signup user journey.

**Acceptance Criteria:**
- [ ] Create `e2e/auth-signup.spec.ts`
- [ ] Test: Navigate to /signup from homepage
- [ ] Test: Fill form with valid email/password, submit
- [ ] Test: Redirects to /signin with success message
- [ ] Test: Error shown for mismatched passwords
- [ ] Test: Error shown for existing email
- [ ] Use unique test emails (timestamp-based) to avoid conflicts
- [ ] Verify: `npm run e2e` passes

### US-009: E2E Signin Flow Test
**Description:** As a developer, I need E2E tests for the signin and session flow.

**Acceptance Criteria:**
- [ ] Create `e2e/auth-signin.spec.ts`
- [ ] Test: Demo credentials prefilled on /signin
- [ ] Test: Submit with demo creds redirects to /account
- [ ] Test: Account page shows user email
- [ ] Test: Invalid credentials show error message
- [ ] Test: Sign out button redirects to homepage
- [ ] Verify: `npm run e2e` passes

### US-010: E2E Protected Routes Test
**Description:** As a developer, I need E2E tests verifying auth protection works.

**Acceptance Criteria:**
- [ ] Create `e2e/protected-routes.spec.ts`
- [ ] Test: Unauthenticated user visiting /account redirects to /signin
- [ ] Test: Unauthenticated user visiting /exclusive/[slug] redirects to /signin
- [ ] Test: Authenticated user can access /account
- [ ] Test: Authenticated user can view exclusive content
- [ ] Verify: `npm run e2e` passes

### US-011: Visual Regression - Homepage
**Description:** As a developer, I need visual snapshot tests for homepage consistency.

**Acceptance Criteria:**
- [ ] Create `e2e/visual/homepage.spec.ts`
- [ ] Take full-page screenshot of homepage
- [ ] Take screenshot of hero section
- [ ] Take screenshot of newsletter form
- [ ] Store baseline screenshots in `e2e/screenshots/`
- [ ] Configure Playwright to compare against baselines with threshold
- [ ] Verify: `npm run e2e` passes and generates screenshots

### US-012: Visual Regression - Auth Pages
**Description:** As a developer, I need visual snapshots for auth pages.

**Acceptance Criteria:**
- [ ] Create `e2e/visual/auth.spec.ts`
- [ ] Screenshot /signin page
- [ ] Screenshot /signup page
- [ ] Screenshot /forgot-password page
- [ ] Screenshot /account page (when logged in)
- [ ] Verify: `npm run e2e` passes

### US-013: GitHub Actions - Test Workflow
**Description:** As a developer, I need CI that runs tests on every push and PR.

**Acceptance Criteria:**
- [ ] Create `.github/workflows/test.yml`
- [ ] Trigger on: push to main, pull requests
- [ ] Job 1: Run Vitest unit tests
- [ ] Job 2: Run Playwright E2E tests
- [ ] Use PostgreSQL service container for test database
- [ ] Cache node_modules and Playwright browsers
- [ ] Upload test artifacts (screenshots, videos) on failure
- [ ] Verify: Push to branch triggers workflow

### US-014: GitHub Actions - Lint & Typecheck
**Description:** As a developer, I need CI that validates code quality.

**Acceptance Criteria:**
- [ ] Add to `.github/workflows/test.yml` or create separate workflow
- [ ] Run `npm run lint` - fail on errors
- [ ] Run `npm run build` (includes typecheck)
- [ ] Run before test jobs (fail fast)
- [ ] Verify: Lint errors block PR merge

### US-015: Railway Deploy Integration
**Description:** As a developer, I need Railway to only deploy after GitHub checks pass.

**Acceptance Criteria:**
- [ ] Configure Railway to deploy from main branch only
- [ ] Enable "Check Suites" requirement (wait for GitHub Actions)
- [ ] Document deployment flow in README
- [ ] Verify: Failed tests prevent Railway deployment

## Functional Requirements

- FR-1: Vitest runs unit tests with `npm run test`
- FR-2: Playwright runs E2E tests with `npm run e2e`
- FR-3: Tests use isolated test database, not development data
- FR-4: Email sending is mocked during tests
- FR-5: Visual regression tests compare screenshots against baselines
- FR-6: GitHub Actions runs all tests on push/PR
- FR-7: CI must pass before Railway deploys

## Non-Goals

- No load/performance testing (later phase)
- No mobile device testing (desktop Chrome only for MVP)
- No accessibility audits in CI (manual for now)
- No test coverage thresholds enforced (start minimal)
- No parallel test sharding (not needed at this scale)

## Technical Considerations

- **Test Database:** Use Railway's ability to create a second PostgreSQL instance for tests, or use local Docker PostgreSQL
- **Playwright Screenshots:** Store in git for baselines, use `.gitignore` for failure artifacts
- **CI Secrets:** DATABASE_URL and RESEND_API_KEY needed in GitHub Actions secrets
- **Test Isolation:** Each E2E test should clean up users it creates, or use unique identifiers

## Design Considerations

- Visual regression threshold: 0.1% pixel difference allowed (accounts for anti-aliasing)
- Screenshots taken at 1280x720 viewport for consistency
- Dark theme means careful attention to contrast in screenshots

## Success Metrics

- All tests pass on main branch
- New PRs cannot merge with failing tests
- Visual regressions caught before production
- Test suite runs in under 3 minutes

## Open Questions

- Should we set up a dedicated Railway test environment with its own database?
- Do we want Slack/Discord notifications for CI failures?
