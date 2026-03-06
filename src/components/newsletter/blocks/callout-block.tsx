import type { CalloutBlock } from "@/lib/newsletter-schema";

interface CalloutBlockProps {
  block: CalloutBlock;
}

const variantStyles = {
  info: {
    container: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-500",
    icon: "text-cyan-600 dark:text-cyan-400",
    text: "text-cyan-900 dark:text-cyan-100",
  },
  warning: {
    container: "bg-orange-50 dark:bg-orange-900/20 border-orange-500",
    icon: "text-orange-600 dark:text-orange-400",
    text: "text-orange-900 dark:text-orange-100",
  },
  tip: {
    container: "bg-green-50 dark:bg-green-900/20 border-green-500",
    icon: "text-green-600 dark:text-green-400",
    text: "text-green-900 dark:text-green-100",
  },
  important: {
    container: "bg-coral-50 dark:bg-red-900/20 border-coral-500",
    icon: "text-coral-600 dark:text-red-400",
    text: "text-coral-900 dark:text-red-100",
  },
};

// Coral fallback: Tailwind doesn't have coral by default, use red-400 tones
const variantStylesFallback = {
  important: {
    container: "bg-red-50 dark:bg-red-900/20 border-red-400",
    icon: "text-red-500 dark:text-red-400",
    text: "text-red-900 dark:text-red-100",
  },
};

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function TipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function ImportantIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function getIcon(variant: CalloutBlock["content"]["variant"]) {
  switch (variant) {
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "tip":
      return TipIcon;
    case "important":
      return ImportantIcon;
  }
}

export function CalloutBlockComponent({ block }: CalloutBlockProps) {
  const { text, variant } = block.content;

  // Use fallback for important since Tailwind doesn't have coral
  const styles = variant === "important"
    ? variantStylesFallback.important
    : variantStyles[variant];

  const Icon = getIcon(variant);

  return (
    <div
      className={`flex gap-3 p-4 mb-4 rounded-r border-l-4 ${styles.container}`}
      role="note"
      aria-label={`${variant} callout`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <p className={`text-sm leading-relaxed ${styles.text}`}>{text}</p>
    </div>
  );
}
