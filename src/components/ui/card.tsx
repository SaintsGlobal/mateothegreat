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
          bg-dark-alt rounded-xl
          border border-brand-gray/20
          p-6
          transition-all duration-300
          ${
            glow
              ? "hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(76,194,213,0.15)]"
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
