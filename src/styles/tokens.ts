// FD-001: Centralized design tokens for the design system

export const colors = {
  bg: {
    primary: "#0a0a0a",
    secondary: "#111111",
    tertiary: "#1a1a1a",
  },
  text: {
    primary: "rgba(255, 255, 255, 1)",
    secondary: "rgba(255, 255, 255, 0.7)",
    tertiary: "rgba(255, 255, 255, 0.5)",
    muted: "rgba(255, 255, 255, 0.4)",
  },
  accent: {
    violet: "#8b5cf6",
    violetLight: "#a78bfa",
    violetDark: "#6d28d9",
    cyan: "#06b6d4",
    cyanLight: "#22d3ee",
  },
  brand: {
    green: "#5EC180",
    coral: "#FF7593",
    orange: "#FF9F55",
    gold: "#FFC927",
    yellowLight: "#FFD683",
    gray: "#BCBCBC",
  },
  status: {
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
  },
} as const;

export const borders = {
  subtle: "rgba(255, 255, 255, 0.06)",
  default: "rgba(255, 255, 255, 0.1)",
  strong: "rgba(255, 255, 255, 0.15)",
} as const;

export const glows = {
  violet: "0 0 20px rgba(139, 92, 246, 0.4)",
  violetSubtle: "0 0 15px rgba(139, 92, 246, 0.2)",
  cyan: "0 0 20px rgba(6, 182, 212, 0.4)",
  cyanSubtle: "0 0 15px rgba(6, 182, 212, 0.2)",
} as const;

export const glassmorphism = {
  bg: "rgba(17, 17, 17, 0.8)",
  border: borders.default,
  blur: "backdrop-blur-md",
} as const;
