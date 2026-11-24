import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="fatal">
      <h2>404 — Página não encontrada</h2>
      <p>O endereço que você tentou acessar não existe.</p>
      <Link className="btn btn-gold" to="/dashboard">Ir para o dashboard</Link>
    </div>
  )
}
