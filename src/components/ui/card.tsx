import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glow = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-[rgba(17,17,17,0.8)] backdrop-blur-md
          rounded-xl
          border border-white/10
          p-6
          transition-all duration-300
          hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20
          ${
            glow
              ? "hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              : ""
          }
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
