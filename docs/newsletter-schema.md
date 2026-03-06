# Newsletter JSON Schema

This document describes the JSON structure for newsletter content.

## Root Structure

```typescript
{
  id: string;          // UUID
  title: string;       // Newsletter title
  slug: string;        // URL-friendly identifier (lowercase, alphanumeric, hyphens)
  template: TemplateType;
  status: "draft" | "approved" | "published";
  author: string;
  version: number;     // Increments on each publish
  publishedAt: string | null;  // ISO datetime when published
  createdAt?: string;  // ISO datetime
  updatedAt?: string;  // ISO datetime
  blocks: Block[];     // Array of content blocks
}
```

## Template Types

- `weekly-update` - Regular weekly newsletter
- `deep-dive` - In-depth technical content
- `news-digest` - Curated news items
- `behind-the-scenes` - Informal updates
- `special-announcement` - Important announcements

## Block Types

Each block has a `type`, `content` object, and optional `style` object.

### Header Block

```json
{
  "type": "header",
  "content": {
    "text": "Welcome to Our Newsletter",
    "level": "h1"
  },
  "style": { "align": "center" }
}
```

Levels: `h1`, `h2`, `h3`, `h4`

### Paragraph Block

Supports markdown content for rich text formatting.

```json
{
  "type": "paragraph",
  "content": {
    "markdown": "This is **bold** and _italic_ text with [links](https://example.com)."
  }
}
```

### List Block

```json
{
  "type": "list",
  "content": {
    "items": ["First item", "Second item", "Third item"],
    "ordered": false
  }
}
```

### Image Block

```json
{
  "type": "image",
  "content": {
    "src": "https://example.com/image.jpg",
    "alt": "Description of image",
    "caption": "Optional caption text"
  }
}
```

### Video Block

Supports YouTube embeds.

```json
{
  "type": "video",
  "content": {
    "youtubeId": "dQw4w9WgXcQ",
    "title": "Video title"
  }
}
```

### Code Block

```json
{
  "type": "code",
  "content": {
    "code": "const greeting = 'Hello, World!';",
    "language": "typescript",
    "filename": "example.ts"
  }
}
```

Languages: `javascript`, `typescript`, `python`, `bash`, `json`, `tsx`

### Blockquote Block

```json
{
  "type": "blockquote",
  "content": {
    "text": "The only way to do great work is to love what you do.",
    "attribution": "Steve Jobs"
  }
}
```

### Callout Block

```json
{
  "type": "callout",
  "content": {
    "text": "Remember to backup your data regularly!",
    "variant": "warning"
  }
}
```

Variants: `info` (cyan), `warning` (orange), `tip` (green), `important` (coral)

### Expandable Block

Collapsible sections for long content.

```json
{
  "type": "expandable",
  "content": {
    "title": "Click to expand",
    "preview": "Optional preview text...",
    "blocks": [
      { "type": "paragraph", "content": { "markdown": "Hidden content here." } }
    ]
  }
}
```

### Tabs Block

Tabbed content sections.

```json
{
  "type": "tabs",
  "content": {
    "tabs": [
      {
        "label": "JavaScript",
        "blocks": [{ "type": "code", "content": { "code": "console.log('js')", "language": "javascript" } }]
      },
      {
        "label": "Python",
        "blocks": [{ "type": "code", "content": { "code": "print('py')", "language": "python" } }]
      }
    ]
  }
}
```

### Snippet Block (Link Preview)

Rich link previews with metadata stored in JSON.

```json
{
  "type": "snippet",
  "content": {
    "url": "https://github.com/vercel/next.js",
    "title": "Next.js by Vercel",
    "description": "The React Framework for the Web",
    "image": "https://example.com/og-image.jpg",
    "favicon": "https://github.com/favicon.ico",
    "domain": "github.com"
  }
}
```

## Style Object (Optional)

All blocks support an optional `style` object:

```typescript
{
  className?: string;           // Custom CSS class
  align?: "left" | "center" | "right";
  emphasis?: "normal" | "highlight" | "muted";
}
```

## Validation

Use the Zod schema from `src/lib/newsletter-schema.ts` to validate newsletter JSON:

```typescript
import { newsletterSchema } from "@/lib/newsletter-schema";

const result = newsletterSchema.safeParse(jsonData);
if (!result.success) {
  console.error(result.error.issues);
}
```

## File Locations

- **Drafts**: `content/newsletters/drafts/{slug}.json`
- **Published**: `content/newsletters/published/{slug}.json`
- **Templates**: `content/newsletters/templates/{template-name}.json`
