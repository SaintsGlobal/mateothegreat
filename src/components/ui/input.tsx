"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-gray mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5
            bg-dark-alt border rounded-lg
            text-white placeholder-brand-gray/60
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-dark
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-brand-coral focus:ring-brand-coral/50"
                : "border-brand-gray/30 focus:border-brand-cyan focus:ring-brand-cyan/50"
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-brand-coral">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
