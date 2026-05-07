'use client';

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let toastId = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();
let currentToasts: Toast[] = [];

export function toast(message: string, type: Toast["type"] = "success") {
  const id = ++toastId;
  currentToasts = [...currentToasts, { id, message, type }];
  listeners.forEach(fn => fn(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter(t => t.id !== id);
    listeners.forEach(fn => fn(currentToasts));
  }, 3000);
}

export function dismissToast(id: number) {
  currentToasts = currentToasts.filter(t => t.id !== id);
  listeners.forEach(fn => fn(currentToasts));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (updated: Toast[]) => setToasts([...updated]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  if (toasts.length === 0) return null;

  const colors = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    error: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-sm animate-[slideInRight_0.3s_ease-out] ${colors[t.type]}`}
        >
          <span className="text-xs">{icons[t.type]}</span>
          <span>{t.message}</span>
          <button onClick={() => dismissToast(t.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
