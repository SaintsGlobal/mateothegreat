import type { HeaderBlock } from "@/lib/newsletter-schema";

interface HeaderBlockProps {
  block: HeaderBlock;
}

export function HeaderBlockComponent({ block }: HeaderBlockProps) {
  const { text, level } = block.content;
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

  const baseClass = `${alignClass} ${emphasisClass} ${block.style?.className ?? ""}`;

  const headingClasses = {
    h1: `text-4xl font-bold mb-6 ${baseClass}`,
    h2: `text-3xl font-semibold mb-4 mt-8 ${baseClass}`,
    h3: `text-2xl font-semibold mb-3 mt-6 ${baseClass}`,
    h4: `text-xl font-medium mb-2 mt-4 ${baseClass}`,
  };

  const Tag = level;

  return <Tag className={headingClasses[level]}>{text}</Tag>;
}
