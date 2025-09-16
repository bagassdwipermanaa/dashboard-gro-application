/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function show(message, type = "info", durationMs = 2500) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    window.setTimeout(() => dismiss(id), durationMs);
  }

  function dismiss(id) {
    setToasts((t) => t.filter((x) => x.id !== id));
  }

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center">
        <div className="space-y-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-lg bg-white/95 backdrop-blur text-sm transition-all duration-300 ${
                t.type === "success"
                  ? "border-emerald-200"
                  : t.type === "error"
                  ? "border-red-200"
                  : "border-gray-200"
              } animate-toast`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
