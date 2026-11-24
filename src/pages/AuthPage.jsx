import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Logo from '../components/ui/Logo'
import { Spinner } from '../components/ui/Loader'

const FEATURES = ['Dashboard com gráficos em tempo real', 'Entradas e saídas organizadas por categoria', 'Autenticação segura com JWT']

/** Login e cadastro na mesma tela (mode = "login" | "register"). */
export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const { isAuthenticated, login, register, sessionExpired } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? '/dashboard'} replace />

  const set = (f) => (e) => { setForm((s) => ({ ...s, [f]: e.target.value })); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    const email = form.email.trim()
    if (!isLogin && !form.name.trim()) return setError('Informe seu nome.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Informe um e-mail válido.')
    if (form.password.length < 6) return setError('A senha deve ter ao menos 6 caracteres.')

    setBusy(true)
    try {
      if (isLogin) await login(email, form.password)
      else await register(form.name.trim(), email, form.password)
      toast.success(isLogin ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!')
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div className="auth-brand-logo"><Logo size={44} /></div>
        <h1>Seu dinheiro, sob controle e seguro.</h1>
        <p>Acompanhe entradas, saídas e o saldo da sua operação em um só lugar.</p>
        <ul className="auth-brand-features">
          {FEATURES.map((f) => <li className="auth-feature" key={f}><span className="auth-feature-dot" /><span>{f}</span></li>)}
        </ul>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form-inner" onSubmit={submit} noValidate>
          <div className="auth-mobile-logo"><Logo size={36} light={false} /></div>
          <h2>{isLogin ? 'Entrar na sua conta' : 'Criar conta'}</h2>
          <p>{isLogin ? 'Informe suas credenciais para continuar.' : 'Preencha os dados para começar.'}</p>

          {sessionExpired && isLogin && !error && <div className="alert alert-error" role="alert">Sua sessão expirou. Entre novamente.</div>}
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nome</label>
              <input id="name" className="form-input" autoComplete="name" value={form.name} onChange={set('name')} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input id="email" type="email" className="form-input" autoComplete="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input id="password" type="password" className="form-input" autoComplete={isLogin ? 'current-password' : 'new-password'} value={form.password} onChange={set('password')} />
          </div>

          <button className="btn btn-gold btn-block" type="submit" disabled={busy}>
            {busy ? <Spinner size={18} /> : isLogin ? 'Entrar' : 'Criar conta'}
          </button>

          <div className="auth-switch">
            {isLogin ? <>Não tem conta? <Link to="/register">Cadastre-se</Link></> : <>Já tem conta? <Link to="/login">Entrar</Link></>}
          </div>
        </form>
      </div>
    </div>
  )
}
