import { memo, useState } from 'react'
import Modal from '../ui/Modal'
import { Spinner } from '../ui/Loader'
import { todayYMD } from '../../utils/format'

/** Criação (tx = null) e edição (tx = transação). Valida no cliente e exibe erros da API no próprio modal. */
function TransactionFormModal({ tx, categories, onSave, onClose }) {
  const editing = !!tx
  const [form, setForm] = useState(() => ({
    title: tx?.title ?? '',
    amount: tx ? String(tx.amount) : '',
    type: tx?.type ?? 'expense',
    category: tx?.category ?? '',
    date: tx?.date ?? todayYMD(),
  }))
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.title.trim()) er.title = 'Informe um título.'
    const n = Number(form.amount.replace(',', '.'))
    if (!form.amount || !Number.isFinite(n) || n <= 0) er.amount = 'Informe um valor maior que zero.'
    if (!form.date) er.date = 'Informe a data.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    setApiError('')
    try {
      await onSave({
        title: form.title.trim(),
        amount: Number(form.amount.replace(',', '.')),
        type: form.type,
        category: form.category.trim() || undefined,
        date: form.date,
      })
    } catch (err) {
      setApiError(err.message)
      setBusy(false)
    }
  }

  return (
    <Modal title={editing ? 'Editar transação' : 'Nova transação'} onClose={onClose} closable={!busy}>
      <form onSubmit={submit} noValidate>
        <div className="modal-body">
          {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

          <div className="type-toggle" role="radiogroup" aria-label="Tipo">
            {[['income', 'Entrada'], ['expense', 'Saída']].map(([v, l]) => (
              <button type="button" key={v} role="radio" aria-checked={form.type === v}
                className={`type-btn ${v} ${form.type === v ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, type: v }))}>{l}</button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tx-title">Título</label>
            <input id="tx-title" className={`form-input ${errors.title ? 'error' : ''}`} value={form.title} onChange={set('title')} maxLength={100} autoFocus />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="tx-amount">Valor (R$)</label>
              <input id="tx-amount" className={`form-input ${errors.amount ? 'error' : ''}`} inputMode="decimal" placeholder="0,00" value={form.amount} onChange={set('amount')} />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="tx-date">Data</label>
              <input id="tx-date" type="date" className={`form-input ${errors.date ? 'error' : ''}`} value={form.date} onChange={set('date')} />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="tx-cat">Categoria</label>
            <input id="tx-cat" className="form-input" list="tx-cats" value={form.category} onChange={set('category')} maxLength={50} placeholder="Opcional" />
            <datalist id="tx-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancelar</button>
          <button type="submit" className="btn btn-gold" disabled={busy}>
            {busy ? <Spinner size={16} /> : editing ? 'Salvar alterações' : 'Adicionar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default memo(TransactionFormModal)
