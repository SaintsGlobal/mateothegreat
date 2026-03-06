# Newsletter Content Directory

This directory contains all newsletter content for the system.

## Structure

```
content/newsletters/
├── templates/      # Newsletter templates (starting points)
├── drafts/         # Draft newsletters (not yet published)
└── published/      # Published newsletters (moved from drafts after publish)
```

## Workflow

1. **Create**: Use `/newsletter` skill to create a new draft in `drafts/{slug}.json`
2. **Preview**: View at `http://localhost:7000/preview/{slug}`
3. **Approve**: Use `/newsletter approve {slug}` to mark ready for publishing
4. **Publish**: Run `npm run publish:newsletters` to deploy approved newsletters

## File Format

All newsletter files are JSON matching the schema in `src/lib/newsletter-schema.ts`.

Draft files use the naming convention: `{slug}.json`

Required fields:
- `id`: UUID
- `title`: Newsletter title
- `slug`: URL-friendly identifier (matches filename)
- `template`: Template used (weekly-update, deep-dive, news-digest, etc.)
- `status`: draft | approved | published
- `author`: Author name
- `version`: Integer version number (increments on each publish)
- `blocks`: Array of content blocks

## Status Lifecycle

- **draft**: Initial state, editable
- **approved**: Ready for publishing, awaiting deploy
- **published**: Live in database, file moved to `published/`

## Templates

Available templates in `templates/`:
- `weekly-update.json` - Regular weekly newsletter format
- `deep-dive.json` - In-depth technical content
- `news-digest.json` - Curated news items
- `behind-the-scenes.json` - Informal, personal updates
- `special-announcement.json` - Important announcements
