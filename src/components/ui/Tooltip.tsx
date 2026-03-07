// FD-012: Lightweight tooltip component with positioning

"use client";

import { useCallback, useRef, useState } from "react";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  delay?: number;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
} as const;

const arrowStyles = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-[#222222] border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[#222222] border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-[#222222] border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-[#222222] border-y-transparent border-l-transparent",
} as const;

export function Tooltip({
  content,
  position = "top",
  children,
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 ${positionStyles[position]}
            bg-[#222222] border border-white/10
            text-sm text-white
            px-3 py-1.5 rounded-md
            max-w-xs whitespace-nowrap
            animate-in fade-in duration-150
          `}
        >
          {content}
          <span
            className={`absolute w-0 h-0 border-4 ${arrowStyles[position]}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
