import { Component } from 'react'

/** Última linha de defesa: erros de renderização não derrubam a página em branco. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) { return { error } }

  componentDidCatch(error, info) { console.error('[ErrorBoundary]', error, info) }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="fatal">
        <h2>Ops! Ocorreu um erro inesperado.</h2>
        <p>Recarregue a página para continuar.</p>
        <button className="btn btn-gold" onClick={() => window.location.reload()}>Recarregar</button>
      </div>
    )
  }
}
