// US-008: Immersive image blocks with sticky scroll

"use client";

import { StickyScrollSection } from "@/components/animation/sticky-scroll-section";

interface ImmersiveImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ImmersiveImage({ src, alt, caption }: ImmersiveImageProps) {
  return (
    <StickyScrollSection scrollDistance={150} className="mb-6">
      {(progress) => (
        <div className="relative h-screen flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-full object-cover rounded-lg"
            style={{
              transform: `scale(${0.8 + progress * 0.2})`,
              opacity: Math.min(progress * 2, 1),
              willChange: "transform, opacity",
            }}
          />
          {caption && (
            <p
              className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-400"
              style={{
                opacity: progress > 0.8 ? (progress - 0.8) * 5 : 0,
                transition: "opacity 100ms ease-out",
              }}
            >
              {caption}
            </p>
          )}
        </div>
      )}
    </StickyScrollSection>
  );
}
