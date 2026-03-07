// FD-017: Scroll reveal animation wrapper

"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const variants = {
  fadeUp: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } },
};

export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
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
