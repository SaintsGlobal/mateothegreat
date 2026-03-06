import type { BlockquoteBlock } from "@/lib/newsletter-schema";

interface BlockquoteBlockProps {
  block: BlockquoteBlock;
}

export function BlockquoteBlockComponent({ block }: BlockquoteBlockProps) {
  const { text, attribution } = block.content;

  return (
    <blockquote className="my-6 pl-4 border-l-4 border-cyan-500 dark:border-cyan-400">
      <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
        {text}
      </p>
      {attribution && (
        <footer className="mt-2">
          <cite className="text-sm text-gray-500 dark:text-gray-400 not-italic">
            — {attribution}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}
