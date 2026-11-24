import { memo } from 'react'
import { formatCurrency, formatDate } from '../../utils/format'
import { Edit, Trash } from '../ui/Icons'

/**
 * Linha memoizada: só re-renderiza se a própria transação mudar.
 * onEdit/onDelete precisam ser estáveis (useCallback) no componente pai.
 */
function TransactionRow({ tx, onEdit, onDelete }) {
  return (
    <tr>
      <td data-label="Título"><div className="tx-desc">{tx.title}</div></td>
      <td data-label="Categoria"><span className="chip">{tx.category || '—'}</span></td>
      <td data-label="Data">{formatDate(tx.date)}</td>
      <td data-label="Tipo"><span className={`badge badge-${tx.type}`}>{tx.type === 'income' ? 'Entrada' : 'Saída'}</span></td>
      <td data-label="Valor" className="num">
        <span className={`amount-cell amount-${tx.type}`}>{tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}</span>
      </td>
      <td className="actions-cell">
        <div className="row-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(tx)} aria-label={`Editar ${tx.title}`}><Edit width={14} height={14} /> Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(tx)} aria-label={`Excluir ${tx.title}`}><Trash width={14} height={14} /></button>
        </div>
      </td>
    </tr>
  )
}

export default memo(TransactionRow)
