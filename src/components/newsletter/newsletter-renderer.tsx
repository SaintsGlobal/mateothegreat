"use client";

import type { Newsletter, Block } from "@/lib/newsletter-schema";
import { HeaderBlockComponent } from "./blocks/header-block";
import { ParagraphBlockComponent } from "./blocks/paragraph-block";
import { ListBlockComponent } from "./blocks/list-block";
import { ImageBlockComponent } from "./blocks/image-block";
import { CodeBlockComponent } from "./blocks/code-block";
import { LinkSnippetBlockComponent } from "./blocks/link-snippet";
import { ExpandableBlockComponent } from "./blocks/expandable-block";

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
      // TODO: NL-012 - Video block implementation
      return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4 text-center text-gray-500">
          Video: {block.content.title ?? block.content.youtubeId}
        </div>
      );
    case "code":
      return <CodeBlockComponent block={block} />;
    case "blockquote":
      // TODO: NL-012 - Blockquote block implementation
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-4">
          <p className="text-gray-700 dark:text-gray-300">{block.content.text}</p>
          {block.content.attribution && (
            <cite className="text-sm text-gray-500 dark:text-gray-400">
              — {block.content.attribution}
            </cite>
          )}
        </blockquote>
      );
    case "callout":
      // TODO: NL-011 - Callout block implementation
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r mb-4">
          <p className="text-gray-700 dark:text-gray-300">{block.content.text}</p>
        </div>
      );
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
