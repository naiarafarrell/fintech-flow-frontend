import { lazy, Suspense, useMemo } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import { expensesByCategory, monthlySeries, summarize } from '../utils/dashboard'
import SummaryCards from '../components/dashboard/SummaryCards'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import { DashboardSkeleton, Skeleton } from '../components/ui/Loader'
import ErrorModal from '../components/ui/ErrorModal'

// Recharts é pesado: os gráficos viram chunks separados, carregados sob demanda.
const MonthlyChart = lazy(() => import('../components/dashboard/MonthlyChart'))
const CategoryChart = lazy(() => import('../components/dashboard/CategoryChart'))

export default function DashboardPage() {
  const { transactions, loading, error, reload, clearError } = useTransactions()

  // Agregações recalculadas apenas quando a lista muda
  const summary = useMemo(() => summarize(transactions), [transactions])
  const monthly = useMemo(() => monthlySeries(transactions), [transactions])
  const byCategory = useMemo(() => expensesByCategory(transactions), [transactions])
  const recent = useMemo(() => transactions.slice(0, 5), [transactions])

  if (loading && transactions.length === 0) return <DashboardSkeleton />

  return (
    <>
      <header className="topbar"><h1>Dashboard</h1></header>
      <div className="page">
        <SummaryCards summary={summary} />
        <div className="charts-grid">
          <Suspense fallback={<Skeleton height={340} radius={16} />}><MonthlyChart data={monthly} /></Suspense>
          <Suspense fallback={<Skeleton height={340} radius={16} />}><CategoryChart data={byCategory} /></Suspense>
        </div>
        <RecentTransactions items={recent} />
      </div>
      {error && <ErrorModal title="Não foi possível carregar o dashboard" message={error.message} onRetry={reload} onClose={clearError} />}
    </>
  )
}
