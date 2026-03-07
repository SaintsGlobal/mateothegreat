// FD-031: Toast notification hook

"use client";

import { useCallback, useState } from "react";

interface ToastItem {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (opts: Omit<ToastItem, "id">) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { ...opts, id }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
