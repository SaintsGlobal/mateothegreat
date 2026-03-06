"use client";

import { useState, useCallback } from "react";
import type { Newsletter, Block } from "@/lib/newsletter-schema";

interface CopyArticleButtonProps {
  newsletter: Newsletter;
}

function blockToText(block: Block): string {
  switch (block.type) {
    case "header": {
      const levelNum = parseInt(block.content.level.replace("h", ""), 10);
      const prefix = "#".repeat(levelNum);
      return `${prefix} ${block.content.text}\n`;
    }

    case "paragraph":
      return `${block.content.markdown}\n`;

    case "list": {
      const items = block.content.items
        .map((item, i) =>
          block.content.ordered ? `${i + 1}. ${item}` : `- ${item}`
        )
        .join("\n");
      return `${items}\n`;
    }

    case "image":
      return block.content.caption
        ? `[Image: ${block.content.caption}]\n`
        : `[Image: ${block.content.alt}]\n`;

    case "video":
      return block.content.title
        ? `[Video: ${block.content.title}]\n`
        : `[Video]\n`;

    case "code":
      const lang = block.content.language || "";
      const filename = block.content.filename ? ` (${block.content.filename})` : "";
      return `\`\`\`${lang}${filename}\n${block.content.code}\n\`\`\`\n`;

    case "blockquote": {
      const quote = block.content.text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
      const attribution = block.content.attribution
        ? `\n> — ${block.content.attribution}`
        : "";
      return `${quote}${attribution}\n`;
    }

    case "callout":
      return `[${block.content.variant.toUpperCase()}] ${block.content.text}\n`;

    case "expandable": {
      const title = block.content.title;
      const nestedContent = block.content.blocks
        .map((b) => blockToText(b as Block))
        .join("\n");
      return `[${title}]\n${nestedContent}\n`;
    }

    case "tabs": {
      const tabsContent = block.content.tabs
        .map((tab) => {
          const tabBlocks = tab.blocks
            .map((b) => blockToText(b as Block))
            .join("\n");
          return `[Tab: ${tab.label}]\n${tabBlocks}`;
        })
        .join("\n");
      return `${tabsContent}\n`;
    }

    case "snippet":
      return `${block.content.title}\n${block.content.description}\n${block.content.url}\n`;

    default:
      return "";
  }
}

function newsletterToPlainText(newsletter: Newsletter): string {
  const header = `${newsletter.title}\n${"=".repeat(newsletter.title.length)}\n\n`;
  const meta = `By ${newsletter.author} | ${newsletter.template}\n\n`;
  const content = newsletter.blocks.map((block) => blockToText(block)).join("\n");

  return `${header}${meta}${content}`;
}

export function CopyArticleButton({ newsletter }: CopyArticleButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = newsletterToPlainText(newsletter);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [newsletter]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label={copied ? "Copied!" : "Copy article"}
    >
      {copied ? (
        <>
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
