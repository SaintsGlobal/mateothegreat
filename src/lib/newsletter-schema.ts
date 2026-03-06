import { z } from "zod";

// Block style schema - optional styling hints
const blockStyleSchema = z.object({
  className: z.string().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  emphasis: z.enum(["normal", "highlight", "muted"]).optional(),
}).optional();

// Header block
const headerBlockSchema = z.object({
  type: z.literal("header"),
  content: z.object({
    text: z.string(),
    level: z.enum(["h1", "h2", "h3", "h4"]),
  }),
  style: blockStyleSchema,
});

// Paragraph block - supports markdown content
const paragraphBlockSchema = z.object({
  type: z.literal("paragraph"),
  content: z.object({
    markdown: z.string(),
  }),
  style: blockStyleSchema,
});

// List block
const listBlockSchema = z.object({
  type: z.literal("list"),
  content: z.object({
    items: z.array(z.string()),
    ordered: z.boolean().default(false),
  }),
  style: blockStyleSchema,
});

// Image block
const imageBlockSchema = z.object({
  type: z.literal("image"),
  content: z.object({
    src: z.string().url(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  style: blockStyleSchema,
});

// Video block
const videoBlockSchema = z.object({
  type: z.literal("video"),
  content: z.object({
    youtubeId: z.string(),
    title: z.string().optional(),
  }),
  style: blockStyleSchema,
});

// Code block
const codeBlockSchema = z.object({
  type: z.literal("code"),
  content: z.object({
    code: z.string(),
    language: z.enum(["javascript", "typescript", "python", "bash", "json", "tsx"]),
    filename: z.string().optional(),
  }),
  style: blockStyleSchema,
});

// Blockquote block
const blockquoteBlockSchema = z.object({
  type: z.literal("blockquote"),
  content: z.object({
    text: z.string(),
    attribution: z.string().optional(),
  }),
  style: blockStyleSchema,
});

// Callout block
const calloutBlockSchema = z.object({
  type: z.literal("callout"),
  content: z.object({
    text: z.string(),
    variant: z.enum(["info", "warning", "tip", "important"]),
  }),
  style: blockStyleSchema,
});

// Link snippet block
const snippetBlockSchema = z.object({
  type: z.literal("snippet"),
  content: z.object({
    url: z.string().url(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    favicon: z.string().url().optional(),
    domain: z.string(),
  }),
  style: blockStyleSchema,
});

// Define base block types (non-recursive)
export type BlockStyle = z.infer<typeof blockStyleSchema>;
export type HeaderBlock = z.infer<typeof headerBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ListBlock = z.infer<typeof listBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type VideoBlock = z.infer<typeof videoBlockSchema>;
export type CodeBlock = z.infer<typeof codeBlockSchema>;
export type BlockquoteBlock = z.infer<typeof blockquoteBlockSchema>;
export type CalloutBlock = z.infer<typeof calloutBlockSchema>;
export type SnippetBlock = z.infer<typeof snippetBlockSchema>;

// Base block type (non-recursive blocks)
type BaseBlock =
  | HeaderBlock
  | ParagraphBlock
  | ListBlock
  | ImageBlock
  | VideoBlock
  | CodeBlock
  | BlockquoteBlock
  | CalloutBlock
  | SnippetBlock;

// Recursive block types defined manually
export type ExpandableBlock = {
  type: "expandable";
  content: {
    title: string;
    preview?: string;
    blocks: Block[];
  };
  style?: BlockStyle;
};

export type TabsBlock = {
  type: "tabs";
  content: {
    tabs: Array<{
      label: string;
      blocks: Block[];
    }>;
  };
  style?: BlockStyle;
};

// Full block type including recursive types
export type Block = BaseBlock | ExpandableBlock | TabsBlock;

// Base block schema (non-recursive) - used for validation within recursive structures
const baseBlockSchema = z.discriminatedUnion("type", [
  headerBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  codeBlockSchema,
  blockquoteBlockSchema,
  calloutBlockSchema,
  snippetBlockSchema,
]);

// For expandable and tabs, we use a simplified nested structure
// that validates base blocks only (no deep nesting support for simplicity)
const expandableBlockSchema = z.object({
  type: z.literal("expandable"),
  content: z.object({
    title: z.string(),
    preview: z.string().optional(),
    blocks: z.array(baseBlockSchema),
  }),
  style: blockStyleSchema,
});

const tabsBlockSchema = z.object({
  type: z.literal("tabs"),
  content: z.object({
    tabs: z.array(z.object({
      label: z.string(),
      blocks: z.array(baseBlockSchema),
    })),
  }),
  style: blockStyleSchema,
});

// Union of all block types
const blockSchema = z.discriminatedUnion("type", [
  headerBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  codeBlockSchema,
  blockquoteBlockSchema,
  calloutBlockSchema,
  snippetBlockSchema,
  expandableBlockSchema,
  tabsBlockSchema,
]);

// Newsletter status
const newsletterStatusSchema = z.enum(["draft", "approved", "published"]);

// Template types
const templateTypeSchema = z.enum([
  "weekly-update",
  "deep-dive",
  "news-digest",
  "behind-the-scenes",
  "special-announcement",
]);

// Root newsletter schema
export const newsletterSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  template: templateTypeSchema,
  status: newsletterStatusSchema,
  author: z.string().min(1),
  version: z.number().int().positive(),
  publishedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  blocks: z.array(blockSchema),
});

export type NewsletterStatus = z.infer<typeof newsletterStatusSchema>;
export type TemplateType = z.infer<typeof templateTypeSchema>;
export type Newsletter = z.infer<typeof newsletterSchema>;

// Export individual schemas for template validation
export {
  blockSchema,
  baseBlockSchema,
  headerBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
  codeBlockSchema,
  blockquoteBlockSchema,
  calloutBlockSchema,
  expandableBlockSchema,
  tabsBlockSchema,
  snippetBlockSchema,
  newsletterStatusSchema,
  templateTypeSchema,
};
