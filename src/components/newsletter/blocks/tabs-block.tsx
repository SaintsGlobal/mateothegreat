"use client";

import { useState, type ReactNode } from "react";
import type { TabsBlock, Block } from "@/lib/newsletter-schema";

interface TabsBlockProps {
  block: TabsBlock;
  renderBlock: (block: Block, index: number) => ReactNode;
}

export function TabsBlockComponent({ block, renderBlock }: TabsBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { tabs } = block.content;

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Tab Headers */}
      <div
        className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === index
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            {/* Active indicator */}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 transition-transform duration-200 ${
                activeTab === index ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="relative">
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`tabpanel-${index}`}
            role="tabpanel"
            aria-hidden={activeTab !== index}
            className={`p-4 transition-opacity duration-200 ${
              activeTab === index
                ? "opacity-100"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            {tab.blocks.map((nestedBlock, blockIndex) =>
              renderBlock(nestedBlock, blockIndex)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
