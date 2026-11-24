import { memo, useState } from 'react'
import Modal from './Modal'
import { Trash } from './Icons'
import { Spinner } from './Loader'

/** Confirmação de ação destrutiva, com estado de loading durante a chamada à API. */
function ConfirmModal({ title, message, confirmLabel = 'Excluir', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false)

  const handle = async () => {
    setBusy(true)
    try { await onConfirm() } finally { setBusy(false) }
  }

  return (
    <Modal onClose={onClose} size="sm" closable={!busy} title="">
      <div className="modal-body confirm-modal">
        <div className="confirm-icon"><Trash /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancelar</button>
          <button className="btn btn-danger-solid" onClick={handle} disabled={busy}>
            {busy ? <Spinner size={16} /> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default memo(ConfirmModal)
