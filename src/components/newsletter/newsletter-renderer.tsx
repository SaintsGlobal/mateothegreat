"use client";

import type { Newsletter, Block } from "@/lib/newsletter-schema";
import { HeaderBlockComponent } from "./blocks/header-block";
import { ParagraphBlockComponent } from "./blocks/paragraph-block";
import { ListBlockComponent } from "./blocks/list-block";
import { ImageBlockComponent } from "./blocks/image-block";
import { CodeBlockComponent } from "./blocks/code-block";
import { LinkSnippetBlockComponent } from "./blocks/link-snippet";
import { ExpandableBlockComponent } from "./blocks/expandable-block";
import { CalloutBlockComponent } from "./blocks/callout-block";
import { VideoBlockComponent } from "./blocks/video-block";
import { BlockquoteBlockComponent } from "./blocks/blockquote-block";

interface NewsletterRendererProps {
  newsletter: Newsletter;
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "header":
      return <HeaderBlockComponent block={block} />;
    case "paragraph":
      return <ParagraphBlockComponent block={block} />;
    case "list":
      return <ListBlockComponent block={block} />;
    case "image":
      return <ImageBlockComponent block={block} />;
    case "video":
      return <VideoBlockComponent block={block} />;
    case "code":
      return <CodeBlockComponent block={block} />;
    case "blockquote":
      return <BlockquoteBlockComponent block={block} />;
    case "callout":
      return <CalloutBlockComponent block={block} />;
    case "expandable":
      return (
        <ExpandableBlockComponent block={block}>
          {block.content.blocks.map((nestedBlock, index) => (
            <BlockRenderer key={index} block={nestedBlock} />
          ))}
        </ExpandableBlockComponent>
      );
    case "tabs":
      // TODO: NL-013 - Tabs block implementation
      return (
        <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <p className="text-gray-500">Tabs: {block.content.tabs.map(t => t.label).join(", ")}</p>
        </div>
      );
    case "snippet":
      return <LinkSnippetBlockComponent block={block} />;
    default:
      return null;
  }
}

export function NewsletterRenderer({ newsletter }: NewsletterRendererProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium uppercase">
            {newsletter.template}
          </span>
          {newsletter.publishedAt && (
            <time dateTime={newsletter.publishedAt}>
              {new Date(newsletter.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span>v{newsletter.version}</span>
        </div>
      </header>

      <div className="newsletter-content">
        {newsletter.blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By {newsletter.author}
        </p>
      </footer>
    </article>
  );
}
