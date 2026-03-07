// FD-001: Animation timing tokens

export const duration = {
  instant: 50,
  quick: 100,
  fast: 150,
  normal: 200,
  slow: 400,
  slower: 700,
} as const;

export const easing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  snappy: "cubic-bezier(0.2, 0, 0, 1)",
} as const;

export const transition = {
  instant: `${duration.instant}ms ${easing.snappy}`,
  quick: `${duration.quick}ms ${easing.out}`,
  fast: `${duration.fast}ms ${easing.out}`,
  normal: `${duration.normal}ms ${easing.out}`,
  slow: `${duration.slow}ms ${easing.out}`,
} as const;
