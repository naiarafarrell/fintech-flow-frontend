import { memo } from 'react'
import { formatCurrency } from '../../utils/format'

function SummaryCards({ summary }) {
  const { income, expense, balance, incomeCount, expenseCount, total } = summary
  const tone = balance >= 0 ? 'positive' : 'negative'
  return (
    <>
      <section className="balance-hero">
        <div>
          <div className="balance-title">Saldo disponível</div>
          <div className={`balance-amount ${tone}`}>{formatCurrency(balance)}</div>
        </div>
        <div className="balance-tags">
          <div className="balance-tag up">↑ {formatCurrency(income)} entradas</div>
          <div className="balance-tag down">↓ {formatCurrency(expense)} saídas</div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Transações</div>
          <div className="stat-value neutral">{total}</div>
          <div className="stat-sub">lançamentos registrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Entradas</div>
          <div className="stat-value positive">{formatCurrency(income)}</div>
          <div className="stat-sub">{incomeCount} lançamentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Saídas</div>
          <div className="stat-value negative">{formatCurrency(expense)}</div>
          <div className="stat-sub">{expenseCount} lançamentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Saldo</div>
          <div className={`stat-value ${tone}`}>{formatCurrency(balance)}</div>
          <div className="stat-sub">{balance >= 0 ? 'positivo' : 'negativo'}</div>
        </div>
      </section>
    </>
  )
}

export default memo(SummaryCards)
