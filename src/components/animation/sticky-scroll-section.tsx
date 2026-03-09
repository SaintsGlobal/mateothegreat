// US-003: Sticky scroll section for cinematic content reveals

"use client";

import { useRef, useSyncExternalStore } from "react";
import { useScrollProgress, useReducedMotion } from "@/hooks/use-scroll-animations";

interface StickyScrollSectionProps {
  children: (progress: number, step: number) => React.ReactNode;
  scrollDistance?: number; // vh units, default 200
  steps?: number; // number of discrete steps, default 1
  className?: string;
}

function useMediaQuery(query: string): boolean {
  function subscribe(callback: () => void) {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  }

  function getSnapshot() {
    return window.matchMedia(query).matches;
  }

  function getServerSnapshot() {
    return false;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function StickyScrollSection({
  children,
  scrollDistance = 200,
  steps = 1,
  className = "",
}: StickyScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const currentStep = Math.min(Math.floor(progress * steps), steps - 1);

  // Mobile or reduced motion: render static content
  if (isMobile || prefersReducedMotion) {
    return (
      <div className={className}>
        {children(1, steps - 1)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${scrollDistance}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {children(progress, currentStep)}
      </div>
    </div>
  );
}
