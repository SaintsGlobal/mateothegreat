"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ParagraphBlock } from "@/lib/newsletter-schema";

interface ParagraphBlockProps {
  block: ParagraphBlock;
}

export function ParagraphBlockComponent({ block }: ParagraphBlockProps) {
  const align = block.style?.align ?? "left";
  const emphasis = block.style?.emphasis ?? "normal";

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const emphasisClass = {
    normal: "",
    highlight: "text-blue-600 dark:text-blue-400",
    muted: "text-gray-500 dark:text-gray-400",
  }[emphasis];

  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none mb-4 ${alignClass} ${emphasisClass} ${block.style?.className ?? ""}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {block.content.markdown}
      </ReactMarkdown>
    </div>
  );
}
