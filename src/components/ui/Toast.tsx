// FD-031: Toast notification component

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void;
}

const variantConfig = {
  success: { borderColor: "border-l-green-500", Icon: Check },
  error: { borderColor: "border-l-red-500", Icon: X },
  warning: { borderColor: "border-l-amber-500", Icon: AlertCircle },
  info: { borderColor: "border-l-violet-500", Icon: Info },
} as const;

function ToastMessage({ id, variant, message, duration = 5000, onDismiss }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (isPaused) return;

    startTimeRef.current = Date.now();
    const timer = setTimeout(() => onDismiss(id), remainingRef.current);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = remainingRef.current - elapsed;
      setProgress(Math.max(0, (remaining / duration) * 100));
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [id, duration, isPaused, onDismiss]);

  const { borderColor, Icon } = variantConfig[variant];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative overflow-hidden
        bg-[#1a1a1a] border border-white/10 border-l-[3px] ${borderColor}
        rounded-lg shadow-xl
        flex items-start gap-3 p-4 min-w-[300px] max-w-[400px]
        animate-in slide-in-from-right duration-200
      `}
    >
      <Icon size={18} className="flex-shrink-0 mt-0.5 text-white/60" />
      <p className="text-sm text-white/80 flex-1">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="text-white/40 hover:text-white transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-white/20 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: string) => void }) {
  const visible = toasts.slice(-5);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {visible.map((toast) => (
        <ToastMessage key={toast.id} {...toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
