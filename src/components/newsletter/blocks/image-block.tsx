// US-008: Updated to support immersive full-width images

import type { ImageBlock } from "@/lib/newsletter-schema";
import { ImmersiveImage } from "./immersive-image";

interface ImageBlockProps {
  block: ImageBlock;
}

export function ImageBlockComponent({ block }: ImageBlockProps) {
  const { src, alt, caption } = block.content;
  const className = block.style?.className ?? "";

  // Full-width images get immersive sticky scroll treatment
  if (className.includes("full-width")) {
    return <ImmersiveImage src={src} alt={alt} caption={caption} />;
  }

  const align = block.style?.align ?? "center";
  const alignClass = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  }[align];

  return (
    <figure className={`mb-6 ${alignClass} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="rounded-lg max-w-full h-auto"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
