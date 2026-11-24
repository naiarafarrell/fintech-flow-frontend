import { memo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Close } from './Icons'

/**
 * Modal acessível: fecha com ESC / clique no overlay, trava o scroll do body
 * e devolve o foco ao elemento que abriu.
 */
function Modal({ title, onClose, children, footer, size = 'md', closable = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()

    const onKey = (e) => { if (e.key === 'Escape' && closable) onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [onClose, closable])

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && closable) onClose() }}>
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        {title && (
          <div className="modal-head">
            <h3>{title}</h3>
            {closable && (
              <button className="close-btn" onClick={onClose} aria-label="Fechar"><Close /></button>
            )}
          </div>
        )}
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export default memo(Modal)
