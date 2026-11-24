import { memo } from 'react'

export const Spinner = memo(function Spinner({ size = 18, label = 'Carregando' }) {
  return <span className="spinner" style={{ width: size, height: size }} role="status" aria-label={label} />
})

/** Tela cheia: usada na validação inicial de rotas (lazy/Suspense). */
export const PageLoader = memo(function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size={32} />
    </div>
  )
})

export const Skeleton = memo(function Skeleton({ height = 16, width = '100%', radius = 6, style }) {
  return <span className="skeleton" style={{ height, width, borderRadius: radius, ...style }} aria-hidden="true" />
})

/** Placeholder do dashboard enquanto a API responde. */
export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="page" aria-busy="true" aria-label="Carregando dashboard">
      <Skeleton height={110} radius={16} style={{ marginBottom: 24 }} />
      <div className="stats-grid">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={96} radius={16} />)}
      </div>
      <div className="charts-grid">
        <Skeleton height={320} radius={16} />
        <Skeleton height={320} radius={16} />
      </div>
    </div>
  )
})

export const TableSkeleton = memo(function TableSkeleton({ rows = 6 }) {
  return (
    <div className="table-skeleton" aria-busy="true" aria-label="Carregando transações">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} height={44} />)}
    </div>
  )
})
