import { memo } from 'react'
import TransactionRow from './TransactionRow'
import { EmptyBox, Sort } from '../ui/Icons'

function SortTh({ field, sort, onSort, children, className }) {
  const active = sort.field === field
  return (
    <th className={className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button className={`th-sort ${active ? 'active' : ''}`} onClick={() => onSort(field)}>
        {children} <Sort width={12} height={12} />{active && (sort.dir === 'asc' ? '↑' : '↓')}
      </button>
    </th>
  )
}

/** Tabela reutilizável de transações (ordenação, estado vazio e ações por linha). */
function TransactionTable({ items, sort, onSort, onEdit, onDelete, emptyMessage }) {
  if (items.length === 0) {
    return <div className="empty-state"><EmptyBox /><p>{emptyMessage}</p></div>
  }
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <SortTh field="title" sort={sort} onSort={onSort}>Título</SortTh>
            <th>Categoria</th>
            <SortTh field="date" sort={sort} onSort={onSort}>Data</SortTh>
            <th>Tipo</th>
            <SortTh field="amount" sort={sort} onSort={onSort} className="num">Valor</SortTh>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {items.map((tx) => <TransactionRow key={tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)}
        </tbody>
      </table>
    </div>
  )
}

export default memo(TransactionTable)
