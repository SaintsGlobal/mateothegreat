import type { SnippetBlock } from "@/lib/newsletter-schema";

interface LinkSnippetProps {
  block: SnippetBlock;
}

export function LinkSnippetBlockComponent({ block }: LinkSnippetProps) {
  const { url, title, description, image, favicon, domain } = block.content;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group block mb-6 rounded-lg border border-gray-200 dark:border-gray-700
        overflow-hidden transition-all duration-200
        hover:border-gray-300 dark:hover:border-gray-600
        hover:shadow-md hover:scale-[1.01]
        ${block.style?.className ?? ""}
      `}
    >
      <div className="flex">
        {image && (
          <div className="flex-shrink-0 w-48 h-32 overflow-hidden hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-500">
            {favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt=""
                className="w-4 h-4 rounded-sm"
                loading="lazy"
              />
            )}
            <span className="truncate">{domain}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
