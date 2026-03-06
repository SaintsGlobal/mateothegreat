import type { ListBlock } from "@/lib/newsletter-schema";

interface ListBlockProps {
  block: ListBlock;
}

export function ListBlockComponent({ block }: ListBlockProps) {
  const { items, ordered } = block.content;
  const align = block.style?.align ?? "left";

  const alignClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  }[align];

  const baseClass = `mb-4 ${alignClass} ${block.style?.className ?? ""}`;

  if (ordered) {
    return (
      <ol className={`list-decimal list-inside space-y-2 ${baseClass}`}>
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={`list-disc list-inside space-y-2 ${baseClass}`}>
      {items.map((item, index) => (
        <li key={index} className="text-gray-700 dark:text-gray-300">
          {item}
        </li>
      ))}
    </ul>
  );
}
