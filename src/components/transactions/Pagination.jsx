import { memo } from 'react'

function Pagination({ page, pages, total, pageSize, onPage }) {
  if (pages <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  return (
    <div className="pagination">
      <span className="pagination-info">{from}–{to} de {total}</span>
      <div className="pagination-btns">
        <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => onPage(page - 1)}>← Anterior</button>
        <span className="pagination-page">{page} / {pages}</span>
        <button className="btn btn-ghost btn-sm" disabled={page === pages} onClick={() => onPage(page + 1)}>Próxima →</button>
      </div>
    </div>
  )
}

export default memo(Pagination)
