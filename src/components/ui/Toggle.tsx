// FD-009: Accessible toggle/switch component

"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const trackSizes = {
  sm: "w-9 h-5",
  md: "w-11 h-6",
} as const;

const knobSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
} as const;

const knobTranslate = {
  sm: "translate-x-4",
  md: "translate-x-5",
} as const;

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`
        relative inline-flex flex-shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark
        disabled:opacity-50 disabled:cursor-not-allowed
        ${trackSizes[size]}
        ${checked ? "bg-[#8b5cf6]" : "bg-[#333333]"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow-sm
          transform transition-transform duration-200 ease-out
          ${knobSizes[size]}
          ${checked ? knobTranslate[size] : "translate-x-0.5"}
        `}
        style={{ marginTop: "2px" }}
      />
    </button>
  );
}
