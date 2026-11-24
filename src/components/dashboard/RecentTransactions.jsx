import { memo } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/format'
import { EmptyBox } from '../ui/Icons'

function RecentTransactions({ items }) {
  return (
    <div className="table-card">
      <div className="table-header">
        <div className="table-title">Lançamentos recentes</div>
        <Link className="btn btn-ghost btn-sm" to="/transactions">Ver todos →</Link>
      </div>
      {items.length === 0 ? (
        <div className="empty-state"><EmptyBox /><p>Nenhuma transação ainda.</p></div>
      ) : (
        <table>
          <thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Tipo</th><th className="num">Valor</th></tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td data-label="Título"><div className="tx-desc">{t.title}</div></td>
                <td data-label="Categoria"><span className="chip">{t.category || '—'}</span></td>
                <td data-label="Data">{formatDate(t.date)}</td>
                <td data-label="Tipo"><span className={`badge badge-${t.type}`}>{t.type === 'income' ? 'Entrada' : 'Saída'}</span></td>
                <td data-label="Valor" className="num">
                  <span className={`amount-cell amount-${t.type}`}>{t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default memo(RecentTransactions)
