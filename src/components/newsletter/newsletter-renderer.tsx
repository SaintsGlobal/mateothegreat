// US-005, US-006, US-007: Newsletter renderer with parallax hero, reading progress, and block scroll reveals

"use client";

import { useRef } from "react";
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
import { TabsBlockComponent } from "./blocks/tabs-block";
import { CopyArticleButton } from "./copy-article-button";
import { ReadingProgress } from "./reading-progress";
import { ParallaxLayer } from "@/components/animation/parallax-layer";
import { ScrollReveal } from "@/components/animation/ScrollReveal";

// US-007: Block-to-animation mapping
type ScrollRevealVariant = "fade" | "slide-up" | "slide-left" | "slide-right" | "scale";
const blockAnimations: Record<string, ScrollRevealVariant> = {
  paragraph: "slide-up",
  header: "fade",
  image: "scale",
  code: "slide-right",
  blockquote: "slide-left",
  callout: "scale",
  list: "slide-up",
  video: "scale",
  expandable: "fade",
  tabs: "fade",
  snippet: "fade",
};

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
      return (
        <TabsBlockComponent
          block={block}
          renderBlock={(nestedBlock, index) => (
            <BlockRenderer key={index} block={nestedBlock} />
          )}
        />
      );
    case "snippet":
      return <LinkSnippetBlockComponent block={block} />;
    default:
      return null;
  }
}

export function NewsletterRenderer({ newsletter }: NewsletterRendererProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  // Extract first header block text for hero title
  const firstHeader = newsletter.blocks.find((b) => b.type === "header");
  const heroTitle = firstHeader
    ? (firstHeader as { content: { text: string } }).content.text
    : newsletter.template;

  return (
    <>
      <ReadingProgress articleRef={articleRef} />

      <article className="max-w-3xl mx-auto px-4 py-8 relative">
        <div className="sticky top-4 z-10 flex justify-end mb-4">
          <CopyArticleButton newsletter={newsletter} />
        </div>

        {/* US-006: Parallax hero header */}
        <header className="relative h-[60vh] overflow-hidden mb-8 rounded-xl flex flex-col items-center justify-center">
          {/* Background parallax gradient */}
          <ParallaxLayer speed={-0.3} className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-[var(--brand-cyan)]/10 via-transparent to-[var(--brand-coral)]/5" />
          </ParallaxLayer>

          {/* Title with parallax */}
          <ParallaxLayer speed={-0.1} className="relative z-10 flex items-center justify-center px-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              {heroTitle}
            </h1>
          </ParallaxLayer>

          {/* Metadata with delayed fade-in */}
          <ScrollReveal delay={300} variant="fade" className="relative z-10 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium uppercase">
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
          </ScrollReveal>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
        </header>

        {/* US-007: Blocks with scroll reveal animations */}
        <div ref={articleRef} className="newsletter-content">
          {newsletter.blocks.map((block, index) => {
            const variant = blockAnimations[block.type] || "fade";
            return (
              <ScrollReveal key={index} variant={variant} delay={index * 50}>
                <BlockRenderer block={block} />
              </ScrollReveal>
            );
          })}
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By {newsletter.author}
          </p>
        </footer>
      </article>
    </>
  );
}
