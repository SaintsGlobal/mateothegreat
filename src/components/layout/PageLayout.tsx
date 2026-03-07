// FD-016: Reusable page layout wrapper

"use client";

import { useEffect, useState } from "react";
import { GradientMesh } from "@/components/animation/GradientMesh";
import { ArrowUp } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  withGradientBg?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "6xl" | "7xl";
  className?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

export function PageLayout({
  children,
  withGradientBg = false,
  maxWidth = "6xl",
  className = "",
}: PageLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {withGradientBg && <GradientMesh className="z-0" />}
      <div
        className={`relative z-10 mx-auto px-4 py-12 ${maxWidthMap[maxWidth]} ${className}`}
      >
        {children}
      </div>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-violet-500/20 hover:bg-violet-500/30 text-white rounded-full p-3 transition-all duration-200 animate-in fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
