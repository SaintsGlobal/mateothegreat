// FD-030: Skeleton loading placeholder with shimmer animation

interface SkeletonProps {
  variant?: "text" | "card" | "avatar" | "button";
  width?: string;
  height?: string;
  className?: string;
}

const variantStyles = {
  text: "h-4 w-full rounded",
  card: "h-[200px] w-full rounded-xl",
  avatar: "h-12 w-12 rounded-full",
  button: "h-10 w-[120px] rounded-lg",
} as const;

export function Skeleton({ variant = "text", width, height, className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white/[0.06] animate-shimmer relative overflow-hidden ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}
