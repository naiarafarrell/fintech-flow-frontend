import { memo } from 'react'

/** Busca + filtros. Componente controlado: o estado vive na página. */
function TransactionFilters({ filters, categories, onChange, onClear }) {
  const set = (field) => (e) => onChange(field, e.target.value)
  const active = Object.values(filters).some(Boolean)

  return (
    <div className="table-filters" role="search">
      <input className="search-input" type="search" placeholder="Buscar por título..." value={filters.search}
        onChange={set('search')} aria-label="Buscar transações" />
      <select className="filter-select" value={filters.type} onChange={set('type')} aria-label="Tipo">
        <option value="">Todos os tipos</option>
        <option value="income">Entradas</option>
        <option value="expense">Saídas</option>
      </select>
      <select className="filter-select" value={filters.category} onChange={set('category')} aria-label="Categoria">
        <option value="">Todas as categorias</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input className="filter-select" type="date" value={filters.from} onChange={set('from')} aria-label="Data inicial" max={filters.to || undefined} />
      <input className="filter-select" type="date" value={filters.to} onChange={set('to')} aria-label="Data final" min={filters.from || undefined} />
      {active && <button className="btn btn-ghost btn-sm" onClick={onClear}>Limpar</button>}
    </div>
  )
}

export default memo(TransactionFilters)
