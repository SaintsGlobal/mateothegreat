// US-001 + US-012: Scroll animation utility hooks with performance optimizations

"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * usePageVisibility — pauses scroll listeners when tab is hidden.
 */
function usePageVisibility(): boolean {
  function subscribe(callback: () => void) {
    document.addEventListener("visibilitychange", callback);
    return () => document.removeEventListener("visibilitychange", callback);
  }

  function getSnapshot() {
    return !document.hidden;
  }

  function getServerSnapshot() {
    return true;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * useScrollProgress — returns 0-1 progress as an element scrolls through the viewport.
 * 0 = element bottom edge enters viewport bottom, 1 = element top edge exits viewport top.
 * Uses requestAnimationFrame-throttled passive scroll listener.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const isVisible = usePageVisibility();
  const rafId = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const element = ref.current;
    if (!element) return;

    let ticking = false;

    function update() {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalDistance = windowHeight + rect.height;
      const traveled = windowHeight - rect.top;
      const p = Math.min(Math.max(traveled / totalDistance, 0), 1);

      setProgress(p);
      ticking = false;
    }

    function onScroll() {
      if (!ticking && isVisible) {
        ticking = true;
        rafId.current = requestAnimationFrame(update);
      }
    }

    // Initial calculation
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [ref, prefersReducedMotion, isVisible]);

  return progress;
}

/**
 * useInView — detects element visibility using IntersectionObserver.
 * Delegates to the same IO logic as useScrollReveal but with a simpler API.
 */
export function useInView(
  ref: RefObject<HTMLElement | null>,
  options?: { threshold?: number; triggerOnce?: boolean }
): boolean {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { threshold = 0.1, triggerOnce = true } = options ?? {};

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, triggerOnce, prefersReducedMotion]);

  return isVisible;
}

/**
 * useParallax — returns transform values based on scroll position.
 * Negative speed = moves slower than scroll (background feel).
 * Positive speed = moves faster than scroll (foreground feel).
 */
export function useParallax(speed: number): { y: number; style: CSSProperties } {
  const [y, setY] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const isVisible = usePageVisibility();
  const rafId = useRef(0);

  // Clamp speed to prevent excessive movement
  const clampedSpeed = Math.max(-2, Math.min(2, speed));

  useEffect(() => {
    if (prefersReducedMotion) {
      setY(0);
      return;
    }

    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      setY(scrollY * clampedSpeed);
      ticking = false;
    }

    function onScroll() {
      if (!ticking && isVisible) {
        ticking = true;
        rafId.current = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [clampedSpeed, prefersReducedMotion, isVisible]);

  const style: CSSProperties = prefersReducedMotion
    ? {}
    : { transform: `translate3d(0, ${y}px, 0)`, willChange: "transform" };

  return { y, style };
}

// Re-export useReducedMotion for unified API
export { useReducedMotion } from "./useReducedMotion";
