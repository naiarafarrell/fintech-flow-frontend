import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { transactionService } from '../services/transactionService'

const TransactionsContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useTransactions = () => {
  const ctx = useContext(TransactionsContext)
  if (!ctx) throw new Error('useTransactions deve ser usado dentro de <TransactionsProvider>')
  return ctx
}

const byDateDesc = (a, b) => b.date.localeCompare(a.date) || b.id - a.id

/**
 * Fonte única de dados: Dashboard e Transações compartilham a mesma lista,
 * então a API é consultada uma vez e as mutações atualizam o estado local
 * (sem refetch completo a cada gravação).
 */
export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const controller = useRef(null)

  // Busca inicial/refetch. Só atualiza estado após o await (nunca de forma síncrona no effect).
  const fetchData = useCallback(async () => {
    controller.current?.abort()
    const ctrl = new AbortController()
    controller.current = ctrl
    try {
      const data = await transactionService.list(ctrl.signal)
      setTransactions(data.sort(byDateDesc))
    } catch (err) {
      if (err.name !== 'AbortError') setError(err)
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [])

  // "Tentar novamente": reinicia loading/erro e refaz a busca
  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    return fetchData()
  }, [fetchData])

  useEffect(() => {
    // fetch-on-mount: o setState ocorre apenas após o await (não é síncrono)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
    return () => controller.current?.abort()
  }, [fetchData])

  const clearError = useCallback(() => setError(null), [])

  const create = useCallback(async (data) => {
    const created = await transactionService.create(data)
    setTransactions((prev) => [created, ...prev].sort(byDateDesc))
    return created
  }, [])

  const update = useCallback(async (id, data) => {
    const updated = await transactionService.update(id, data)
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)).sort(byDateDesc))
    return updated
  }, [])

  const remove = useCallback(async (id) => {
    await transactionService.remove(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value = useMemo(
    () => ({ transactions, loading, error, clearError, reload, create, update, remove }),
    [transactions, loading, error, clearError, reload, create, update, remove],
  )
  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
