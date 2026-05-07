'use client';

import { useEffect, useState } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
}

type ResolveFn = (value: boolean) => void;

let currentConfirm: { options: ConfirmOptions; resolve: ResolveFn } | null = null;
const listeners: Set<(confirm: typeof currentConfirm) => void> = new Set();

export function confirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise(resolve => {
    currentConfirm = { options, resolve };
    listeners.forEach(fn => fn(currentConfirm));
  });
}

export function ConfirmDialog() {
  const [visible, setVisible] = useState(!!currentConfirm);
  const [options, setOptions] = useState<ConfirmOptions | null>(currentConfirm?.options || null);

  useEffect(() => {
    const listener = (updated: typeof currentConfirm) => {
      setOptions(updated?.options || null);
      setVisible(!!updated);
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  if (!visible || !options) return null;

  const handleConfirm = () => {
    setVisible(false);
    currentConfirm?.resolve(true);
    currentConfirm = null;
  };

  const handleCancel = () => {
    setVisible(false);
    currentConfirm?.resolve(false);
    currentConfirm = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-2xl max-w-sm mx-4 animate-[scaleIn_0.2s_ease-out]">
        <h3 className="text-lg font-semibold mb-2">{options.title || "Confirm Action"}</h3>
        <p className="text-sm text-muted-foreground mb-6">{options.message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {options.cancelLabel || "Cancel"}
          </button>
          <button
            onClick={handleConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              options.variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {options.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
