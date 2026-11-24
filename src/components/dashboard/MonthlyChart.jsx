import { memo } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompact, formatCurrency, monthLabel } from '../../utils/format'

/** Entradas x saídas por mês + linha de saldo. Carregado via React.lazy. */
function MonthlyChart({ data }) {
  const rows = data.map((r) => ({ ...r, label: monthLabel(r.key) }))
  return (
    <div className="chart-card">
      <div className="chart-title">Fluxo mensal</div>
      {rows.length === 0 ? (
        <div className="chart-empty">Sem dados para exibir.</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2DDD0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatCompact} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
            <Tooltip formatter={(v) => formatCurrency(v)} cursor={{ fill: 'rgba(200,151,58,.08)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Entradas" fill="#1A6B3C" radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive={false} />
            <Bar dataKey="expense" name="Saídas" fill="#9B2020" radius={[4, 4, 0, 0]} maxBarSize={32} isAnimationActive={false} />
            <Line dataKey="balance" name="Saldo" stroke="#C8973A" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default memo(MonthlyChart)
