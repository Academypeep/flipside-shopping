'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, title, message, type }])

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-[#171717] p-4 text-white shadow-2xl backdrop-blur-xl transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <span className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle className="size-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="size-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="size-5 text-cyan-400" />}
            </span>
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-white">{toast.title}</p>
              {toast.message && <p className="mt-0.5 text-xs text-neutral-400">{toast.message}</p>}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-neutral-500 hover:text-white"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
