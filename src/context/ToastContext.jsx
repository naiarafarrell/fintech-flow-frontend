import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Alert, Check, Info } from '../components/ui/Icons'

const ToastContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}

const ICONS = { success: Check, error: Alert, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])

  const push = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  // API estável: não causa re-render nos consumidores quando a lista muda
  const api = useMemo(() => ({
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 5000),
    info: (m) => push(m, 'info'),
  }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-wrap" role="region" aria-live="polite" aria-label="Notificações">
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          return (
            <button key={t.id} type="button" className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
              <Icon /> <span>{t.message}</span>
            </button>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
