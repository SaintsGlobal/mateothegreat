// US-005: Reading progress indicator

"use client";

import { useEffect, useState, type RefObject } from "react";
import { useScrollProgress, useReducedMotion } from "@/hooks/use-scroll-animations";

interface ReadingProgressProps {
  articleRef: RefObject<HTMLElement | null>;
}

export function ReadingProgress({ articleRef }: ReadingProgressProps) {
  const progress = useScrollProgress(articleRef);
  const prefersReducedMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade in after scrolling past ~100px
  const isVisible = scrollY > 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms ease-out",
      }}
    >
      <div
        className="h-full w-full"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
          backgroundColor: "var(--brand-cyan)",
          boxShadow: prefersReducedMotion
            ? "none"
            : "0 0 10px var(--brand-cyan)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
