// US-010: Card tilt/hover micro-interactions

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-scroll-animations";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 10,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setTilt({
        rotateX: -y * maxTilt,
        rotateY: x * maxTilt,
      });
    },
    [maxTilt]
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  // Disabled on touch devices or reduced motion
  if (isTouch || prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const shadowX = tilt.rotateY * 2;
  const shadowY = -tilt.rotateX * 2;

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
          boxShadow: isHovering
            ? `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.15), 0 0 20px rgba(76, 194, 213, 0.1)`
            : "0 0 0 rgba(0,0,0,0)",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
