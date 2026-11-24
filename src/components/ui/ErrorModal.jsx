import { memo } from 'react'
import Modal from './Modal'
import { Alert } from './Icons'

/** Modal para erros bloqueantes (ex.: falha ao carregar dados), com opção de tentar de novo. */
function ErrorModal({ title = 'Algo deu errado', message, onRetry, onClose }) {
  return (
    <Modal onClose={onClose} size="sm" title="">
      <div className="modal-body confirm-modal">
        <div className="confirm-icon"><Alert /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
          {onRetry && <button className="btn btn-gold" onClick={onRetry}>Tentar novamente</button>}
        </div>
      </div>
    </Modal>
  )
}

export default memo(ErrorModal)
