"use client";

import { useState, type ReactNode } from "react";
import type { ExpandableBlock } from "@/lib/newsletter-schema";

interface ExpandableBlockProps {
  block: ExpandableBlock;
  children: ReactNode;
}

export function ExpandableBlockComponent({ block, children }: ExpandableBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { title, preview } = block.content;

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {title}
          </span>
          {preview && !isExpanded && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {preview}
            </p>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
