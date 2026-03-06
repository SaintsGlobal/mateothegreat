import type { VideoBlock } from "@/lib/newsletter-schema";

interface VideoBlockProps {
  block: VideoBlock;
}

export function VideoBlockComponent({ block }: VideoBlockProps) {
  const { youtubeId, title } = block.content;

  // Use youtube-nocookie.com for privacy-friendly embeds
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}`;

  return (
    <figure className="mb-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
        <iframe
          src={embedUrl}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
