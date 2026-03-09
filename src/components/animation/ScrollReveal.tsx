// FD-017 + US-002: Scroll reveal animation wrapper

"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Spec-aligned variant names with backward-compatible aliases
const variants = {
  // Spec names (US-002)
  "fade": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slide-up": { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  "slide-left": { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
  "slide-right": { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
  "scale": { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } },
  // Backward-compatible aliases (FD-017)
  "fadeUp": { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  "fadeIn": { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  "slideLeft": { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
  "slideRight": { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
};

type ScrollRevealVariant = keyof typeof variants;

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  variant = "fade",
  delay = 0,
  duration = 0.5,
  stagger,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // When stagger is set, wrap children in a stagger container
  if (stagger !== undefined) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger / 1000, delayChildren: delay / 1000 } },
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={variants[variant]}
      transition={{ duration, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function ScrollRevealContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: ScrollRevealContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
