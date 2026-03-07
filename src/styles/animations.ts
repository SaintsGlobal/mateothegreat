// FD-001: Animation timing tokens

export const duration = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

export const easing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const transition = {
  fast: `${duration.fast}ms ${easing.out}`,
  normal: `${duration.normal}ms ${easing.out}`,
  slow: `${duration.slow}ms ${easing.out}`,
} as const;
