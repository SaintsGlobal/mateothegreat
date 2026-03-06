"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { CodeBlock } from "@/lib/newsletter-schema";

interface CodeBlockComponentProps {
  block: CodeBlock;
}

export function CodeBlockComponent({ block }: CodeBlockComponentProps) {
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(block.content.code, {
        lang: block.content.language,
        theme: "github-dark",
      });
      setHighlightedCode(html);
    }
    highlight();
  }, [block.content.code, block.content.language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.content.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mb-4 group">
      {block.content.filename && (
        <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-t-lg border-b border-gray-700 font-mono">
          {block.content.filename}
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        {highlightedCode ? (
          <div
            className={`overflow-x-auto ${block.content.filename ? "rounded-b-lg" : "rounded-lg"} [&>pre]:p-4 [&>pre]:m-0`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        ) : (
          <pre
            className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${block.content.filename ? "rounded-b-lg" : "rounded-lg"}`}
          >
            <code>{block.content.code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
