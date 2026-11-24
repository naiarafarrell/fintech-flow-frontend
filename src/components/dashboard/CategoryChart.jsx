import { memo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/format'

const COLORS = ['#C8973A', '#2A2A2A', '#1A6B3C', '#9B2020', '#5B7DB1', '#8A621A', '#9A9A9A']

/** Despesas por categoria (donut). Carregado via React.lazy. */
function CategoryChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-title">Despesas por categoria</div>
      {data.length === 0 ? (
        <div className="chart-empty">Nenhuma saída registrada.</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} isAnimationActive={false}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default memo(CategoryChart)
