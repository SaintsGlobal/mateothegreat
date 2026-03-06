# PRD: Newsletter Content System

## Introduction

Upgrade the newsletter/article system with a structured JSON content format, reusable templates, a CLI skill for guided newsletter creation, and a draft/approval workflow that publishes to the database on approval. This enables rich, consistent newsletter content with support for multiple content types, snippets, and one-click copy functionality.

## Goals

- Define a flexible JSON schema supporting text, media, and interactive content blocks
- Create 5 reference newsletter templates (Weekly Update, Deep Dive, News Digest, Behind-the-Scenes, Special Announcement)
- Build a Claude Code skill (`/newsletter`) for interview-based newsletter creation
- Implement draft/approval workflow with file-based drafts and database-published content
- Add copy-to-clipboard button for entire article content
- Support multiple snippet types (code, link previews, embedded content)

## User Stories

### US-001: Define Newsletter JSON Schema
**Description:** As a developer, I need a documented JSON schema for newsletter content so all newsletters have consistent structure.

**Acceptance Criteria:**
- [ ] Create `docs/newsletter-schema.md` documenting the JSON structure
- [ ] Schema supports content block types: `header`, `paragraph`, `list`, `image`, `video`, `code`, `blockquote`, `callout`, `expandable`, `tabs`, `snippet`
- [ ] Each block has `type`, `content`, and optional `style` properties
- [ ] Root schema includes: `id`, `title`, `slug`, `template`, `status` (draft|approved|published), `author`, `publishedAt`, `blocks[]`
- [ ] Typecheck passes

### US-002: Create Newsletter Template - Weekly Update
**Description:** As a content creator, I want a Weekly Update template so I can quickly create consistent weekly newsletters.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/templates/weekly-update.json`
- [ ] Template includes: hero header, intro paragraph, 3-5 highlight sections with headers, bullet lists for quick updates, closing CTA
- [ ] Template has placeholder content showing expected structure
- [ ] JSON validates against schema

### US-003: Create Newsletter Template - Deep Dive
**Description:** As a content creator, I want a Deep Dive template for in-depth technical or educational content.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/templates/deep-dive.json`
- [ ] Template includes: title, intro, multiple h2/h3 sections, code snippets, images, blockquotes, conclusion
- [ ] Supports longer-form content with expandable sections
- [ ] JSON validates against schema

### US-004: Create Newsletter Template - News Digest
**Description:** As a content creator, I want a News Digest template for curating multiple news items.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/templates/news-digest.json`
- [ ] Template includes: intro, 5-7 news item cards with link snippets, brief commentary per item, category tags
- [ ] Each news item has title, source, summary, link
- [ ] JSON validates against schema

### US-005: Create Newsletter Template - Behind-the-Scenes
**Description:** As a content creator, I want a Behind-the-Scenes template for personal/informal updates.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/templates/behind-the-scenes.json`
- [ ] Template includes: casual intro, image gallery section, story blocks, personal notes callout
- [ ] Supports embedded media (photos, videos)
- [ ] JSON validates against schema

### US-006: Create Newsletter Template - Special Announcement
**Description:** As a content creator, I want a Special Announcement template for important news.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/templates/special-announcement.json`
- [ ] Template includes: bold hero header, announcement body, key details list, CTA buttons, FAQ expandable section
- [ ] High-impact visual styling hints in style properties
- [ ] JSON validates against schema

### US-007: Newsletter Renderer Component
**Description:** As a user, I want newsletters to render beautifully from JSON so I can read rich content.

**Acceptance Criteria:**
- [ ] Create `src/components/newsletter/newsletter-renderer.tsx`
- [ ] Renders all block types: header, paragraph, list, image, video, code, blockquote, callout, expandable, tabs
- [ ] Each block type has its own sub-component in `src/components/newsletter/blocks/`
- [ ] Responsive layout, matches site aesthetic
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Code Snippet Block with Syntax Highlighting
**Description:** As a user, I want code snippets to have syntax highlighting so technical content is readable.

**Acceptance Criteria:**
- [ ] Create `src/components/newsletter/blocks/code-block.tsx`
- [ ] Uses syntax highlighting library (e.g., Prism or Shiki)
- [ ] Supports common languages: javascript, typescript, python, bash, json
- [ ] Copy button on code blocks
- [ ] Dark theme styling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Link Snippet Block (Unfurl Preview)
**Description:** As a user, I want link snippets to show rich previews so I can see what I'm clicking.

**Acceptance Criteria:**
- [ ] Create `src/components/newsletter/blocks/link-snippet.tsx`
- [ ] Displays: title, description, favicon, domain, optional image
- [ ] Card-style layout with hover state
- [ ] Snippet data stored in JSON (not fetched at runtime)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: Expandable Section Block
**Description:** As a user, I want expandable sections so long content doesn't overwhelm the page.

**Acceptance Criteria:**
- [ ] Create `src/components/newsletter/blocks/expandable-block.tsx`
- [ ] Click to expand/collapse with smooth animation
- [ ] Shows title and preview when collapsed
- [ ] Chevron indicator for state
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-011: Callout Block (Info/Warning/Tip)
**Description:** As a user, I want callout boxes so important information stands out.

**Acceptance Criteria:**
- [ ] Create `src/components/newsletter/blocks/callout-block.tsx`
- [ ] Variants: info (blue/cyan), warning (orange), tip (green), important (coral)
- [ ] Icon + colored border/background styling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-012: Copy Article Button
**Description:** As a user, I want to copy the entire article with one click so I can share it easily.

**Acceptance Criteria:**
- [ ] Add copy button in top-right area of article page
- [ ] Button copies article content as formatted text (not JSON)
- [ ] Shows "Copied!" confirmation feedback
- [ ] Positioned fixed/sticky so always accessible while scrolling
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-013: Draft Newsletter Storage
**Description:** As a developer, I need draft newsletters stored as files so they can be edited before publishing.

**Acceptance Criteria:**
- [ ] Create `content/newsletters/drafts/` directory
- [ ] Draft files named `{slug}.json`
- [ ] Drafts include full newsletter JSON with `"status": "draft"`
- [ ] Add `.gitignore` entry if drafts should not be committed (or keep for version control)
- [ ] Typecheck passes

### US-014: Newsletter Approval - JSON Field
**Description:** As a content creator, I want to approve a newsletter by editing the status field.

**Acceptance Criteria:**
- [ ] Changing `"status": "draft"` to `"status": "approved"` in JSON marks for publish
- [ ] Document this workflow in `docs/newsletter-workflow.md`

### US-015: Newsletter Publish Pipeline
**Description:** As a developer, I need approved newsletters to publish to the database automatically.

**Acceptance Criteria:**
- [ ] Create `scripts/publish-newsletters.ts` script
- [ ] Script reads all files in `content/newsletters/drafts/`
- [ ] For each file with `"status": "approved"`:
  - Insert/update in ExclusiveContent table (or new Newsletter table)
  - Set `"status": "published"` and `publishedAt` timestamp
  - Move file to `content/newsletters/published/` archive
- [ ] Script can run manually or via CI
- [ ] Typecheck passes

### US-016: Newsletter Database Model
**Description:** As a developer, I need a database model to store published newsletters.

**Acceptance Criteria:**
- [ ] Add Newsletter model to Prisma schema (or extend ExclusiveContent)
- [ ] Fields: id, title, slug (unique), template, content (JSON), author, status, publishedAt, createdAt, updatedAt
- [ ] Run migration: `npx prisma db push`
- [ ] Typecheck passes

### US-017: Newsletter List Page Update
**Description:** As a user, I want to see all published newsletters in a list so I can browse content.

**Acceptance Criteria:**
- [ ] Update `/exclusive` page to fetch from Newsletter table
- [ ] Display newsletter cards with title, date, template badge
- [ ] Link to `/exclusive/{slug}` detail page
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-018: Newsletter Detail Page
**Description:** As a user, I want to view a single newsletter with full rendered content.

**Acceptance Criteria:**
- [ ] Update `/exclusive/[slug]` to fetch newsletter by slug
- [ ] Pass JSON content to NewsletterRenderer component
- [ ] Include copy button (US-012)
- [ ] 404 if slug not found
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-019: Create /newsletter Skill - Interview Flow
**Description:** As a content creator, I want a Claude Code skill that interviews me to create newsletters.

**Acceptance Criteria:**
- [ ] Create skill at `~/.claude/skills/newsletter/skill.md`
- [ ] Skill asks for: template choice, title, sections content, images, code snippets
- [ ] Interview adapts based on template chosen
- [ ] Generates valid JSON matching schema
- [ ] Saves to `content/newsletters/drafts/{slug}.json`

### US-020: /newsletter Skill - Approve Command
**Description:** As a content creator, I want to approve newsletters via CLI command.

**Acceptance Criteria:**
- [ ] Skill supports `/newsletter approve <slug>` syntax
- [ ] Sets `"status": "approved"` in the draft JSON
- [ ] Confirms action with "Newsletter '{title}' approved. Run publish script to deploy."
- [ ] Error if slug not found

### US-021: /newsletter Skill - List Drafts Command
**Description:** As a content creator, I want to list all draft newsletters.

**Acceptance Criteria:**
- [ ] Skill supports `/newsletter list` syntax
- [ ] Shows table: slug, title, template, created date, status
- [ ] Indicates which are ready for approval

### US-022: /newsletter Skill - Preview Command
**Description:** As a content creator, I want to preview a draft before approving.

**Acceptance Criteria:**
- [ ] Skill supports `/newsletter preview <slug>` syntax
- [ ] Opens draft in browser at localhost preview route
- [ ] Or displays formatted summary in terminal

### US-023: CI Integration for Newsletter Publish
**Description:** As a developer, I want approved newsletters to publish on deploy.

**Acceptance Criteria:**
- [ ] Add `npm run publish:newsletters` script to package.json
- [ ] GitHub Actions workflow runs publish script after build
- [ ] Only runs when files in `content/newsletters/` change
- [ ] Railway picks up database changes on deploy

## Functional Requirements

- FR-1: Newsletter JSON schema supports block types: header, paragraph, list, image, video, code, blockquote, callout, expandable, tabs, snippet (link/embed)
- FR-2: Five reference templates exist: weekly-update, deep-dive, news-digest, behind-the-scenes, special-announcement
- FR-3: NewsletterRenderer component renders all block types with appropriate styling
- FR-4: Code blocks have syntax highlighting and copy functionality
- FR-5: Link snippets display unfurled previews (title, description, image, domain)
- FR-6: Copy button in article header copies full article as text
- FR-7: Draft newsletters stored as JSON files in `content/newsletters/drafts/`
- FR-8: Status field controls workflow: draft -> approved -> published
- FR-9: Publish script migrates approved drafts to database
- FR-10: `/newsletter` skill provides interview-based creation flow
- FR-11: `/newsletter approve <slug>` marks draft for publishing
- FR-12: Published newsletters display on `/exclusive` page

## Non-Goals

- No WYSIWYG editor in browser (CLI skill is the authoring interface)
- No real-time collaboration on drafts
- No scheduled publishing (publish is immediate on approval + deploy)
- No email delivery of newsletters (web-only for now)
- No comments or reactions on newsletters
- No A/B testing of newsletter content

## Technical Considerations

- JSON content stored as JSONB in PostgreSQL for queryability
- Syntax highlighting: consider Shiki (build-time) vs Prism (client-side)
- Link snippet metadata must be provided in JSON (no runtime fetching to avoid rate limits)
- Templates are reference only; skill generates fresh JSON each time
- Consider zod schema for runtime validation of newsletter JSON

## Design Considerations

- Newsletter blocks should match existing site aesthetic (dark theme, brand colors)
- Callout colors: info=cyan, warning=orange, tip=green, important=coral
- Copy button: subtle icon in top-right, tooltip on hover
- Code blocks: dark background, monospace font, language badge
- Expandable sections: chevron animation, smooth height transition

## Success Metrics

- Content creators can produce a newsletter in < 10 minutes via CLI skill
- Zero malformed JSON errors on publish
- Newsletter pages load in < 2 seconds
- Copy button works across all browsers

## Decisions (Closed Questions)

- **Markdown in paragraphs:** Yes - paragraph blocks support markdown content rendered via react-markdown
- **Versioning:** Yes - NewsletterVersion model tracks history, version increments on each publish
- **Git tracking:** Drafts are git-tracked (not gitignored) for version control and collaboration
- **Preview route:** Yes - `/preview/[slug]` renders drafts with "PREVIEW - NOT PUBLISHED" banner
