import { useCallback, useMemo, useState } from 'react'
import { useTransactions } from '../context/TransactionsContext'
import { useToast } from '../context/ToastContext'
import { useDebounce } from '../hooks/useDebounce'
import TransactionTable from '../components/transactions/TransactionTable'
import TransactionFilters from '../components/transactions/TransactionFilters'
import { EMPTY_FILTERS } from '../components/transactions/filters'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import Pagination from '../components/transactions/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'
import ErrorModal from '../components/ui/ErrorModal'
import { TableSkeleton } from '../components/ui/Loader'
import { Plus } from '../components/ui/Icons'
import { formatCurrency } from '../utils/format'

const PAGE_SIZE = 10
const DEFAULT_CATEGORIES = ['Salário', 'Aluguel', 'Alimentação', 'Transporte', 'Investimento', 'Serviços', 'Impostos', 'Outros']

export default function TransactionsPage() {
  const { transactions, loading, error, clearError, reload, create, update, remove } = useTransactions()
  const toast = useToast()

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [form, setForm] = useState(null)       // null | { tx: Transaction|null }
  const [toDelete, setToDelete] = useState(null)

  // Busca com debounce: evita refiltrar a lista a cada tecla
  const search = useDebounce(filters.search.trim().toLowerCase(), 250)

  const categories = useMemo(
    () => [...new Set([...DEFAULT_CATEGORIES, ...transactions.map((t) => t.category).filter(Boolean)])].sort(),
    [transactions],
  )

  const filtered = useMemo(() => {
    const { type, category, from, to } = filters
    const list = transactions.filter((t) =>
      (!search || t.title.toLowerCase().includes(search) || (t.category ?? '').toLowerCase().includes(search)) &&
      (!type || t.type === type) &&
      (!category || t.category === category) &&
      (!from || t.date >= from) &&
      (!to || t.date <= to))

    const dir = sort.dir === 'asc' ? 1 : -1
    return list.sort((a, b) => {
      if (sort.field === 'amount') return (a.amount - b.amount) * dir
      if (sort.field === 'title') return a.title.localeCompare(b.title, 'pt-BR') * dir
      return a.date.localeCompare(b.date) * dir || (a.id - b.id) * dir
    })
  }, [transactions, filters, search, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  )
  const total = useMemo(
    () => filtered.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0),
    [filtered],
  )

  // Handlers estáveis => TransactionRow (memo) não re-renderiza à toa
  const onFilter = useCallback((field, value) => { setFilters((f) => ({ ...f, [field]: value })); setPage(1) }, [])
  const onClear = useCallback(() => { setFilters(EMPTY_FILTERS); setPage(1) }, [])
  const onSort = useCallback((field) => {
    setSort((s) => (s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: field === 'title' ? 'asc' : 'desc' }))
  }, [])
  const openCreate = useCallback(() => setForm({ tx: null }), [])
  const onEdit = useCallback((tx) => setForm({ tx }), [])
  const onDelete = useCallback((tx) => setToDelete(tx), [])
  const closeForm = useCallback(() => setForm(null), [])
  const closeDelete = useCallback(() => setToDelete(null), [])

  const handleSave = useCallback(async (data) => {
    if (form?.tx) {
      await update(form.tx.id, data)
      toast.success('Transação atualizada!')
    } else {
      await create(data)
      toast.success('Transação adicionada!')
    }
    setForm(null)
  }, [form, create, update, toast])

  const handleDelete = useCallback(async () => {
    try {
      await remove(toDelete.id)
      toast.success('Transação excluída.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setToDelete(null)
    }
  }, [toDelete, remove, toast])

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <header className="topbar">
        <h1>Transações</h1>
        <button className="btn btn-gold" onClick={openCreate}><Plus width={16} height={16} /> Nova transação</button>
      </header>

      <div className="page">
        <button className="btn btn-gold fab" onClick={openCreate} aria-label="Nova transação"><Plus width={20} height={20} /></button>

        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">Todas as transações</div>
              <div className="table-sub">
                {filtered.length} resultado(s) · saldo do filtro: <strong className={total >= 0 ? 'amount-income' : 'amount-expense'}>{formatCurrency(total)}</strong>
              </div>
            </div>
            <TransactionFilters filters={filters} categories={categories} onChange={onFilter} onClear={onClear} />
          </div>

          {loading ? (
            <TableSkeleton />
          ) : (
            <TransactionTable
              items={pageItems} sort={sort} onSort={onSort} onEdit={onEdit} onDelete={onDelete}
              emptyMessage={hasFilters ? 'Nenhuma transação encontrada com esses filtros.' : 'Nenhuma transação ainda. Adicione a primeira!'}
            />
          )}
          <Pagination page={currentPage} pages={pages} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      </div>

      {form && <TransactionFormModal tx={form.tx} categories={categories} onSave={handleSave} onClose={closeForm} />}
      {toDelete && (
        <ConfirmModal
          title="Excluir transação?"
          message={`"${toDelete.title}" será removida permanentemente.`}
          onConfirm={handleDelete} onClose={closeDelete}
        />
      )}
      {error && <ErrorModal title="Não foi possível carregar as transações" message={error.message} onRetry={reload} onClose={clearError} />}
    </>
  )
}
