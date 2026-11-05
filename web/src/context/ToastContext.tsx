"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-4), { id, type, title, description }]);

      setTimeout(() => {
        dismiss(id);
      }, 4200);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    success: (title, description) => addToast("success", title, description),
    error: (title, description) => addToast("error", title, description),
    warning: (title, description) => addToast("warning", title, description),
    info: (title, description) => addToast("info", title, description),
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Contenedor Flotante de Toasts */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const esExito = t.type === "success";
          const esError = t.type === "error";
          const esAdvertencia = t.type === "warning";

          const bordeColor = esExito
            ? "border-[#0fa336]"
            : esError
            ? "border-[#e22718]"
            : esAdvertencia
            ? "border-[#f4b400]"
            : "border-[#0066b1]";

          const icono = esExito ? (
            <CheckCircle2 className="w-5 h-5 text-[#00E676] shrink-0" />
          ) : esError ? (
            <AlertCircle className="w-5 h-5 text-[#e22718] shrink-0" />
          ) : esAdvertencia ? (
            <AlertTriangle className="w-5 h-5 text-[#f4b400] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#0066b1] shrink-0" />
          );

          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto relative bg-[#0d0d0d]/95 backdrop-blur-md border-l-4 border border-[#262626] rounded-lg p-3.5 shadow-2xl flex items-start justify-between gap-3 transition-all duration-200",
                bordeColor
              )}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5">{icono}</div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="mt-1 text-xs text-[#bbbbbb] leading-snug">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="text-[#7e7e7e] hover:text-white p-1 rounded transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}
