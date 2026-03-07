// FD-008: Badge/Pill component for status indicators and labels

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-white/10 text-white/70 border-white/10",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  accent: "bg-violet-500/10 text-violet-400 border-violet-500/20",
} as const;

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
} as const;

export function Badge({
  variant = "default",
  size = "md",
  icon,
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
