import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { setUnauthorizedHandler, tokenStorage } from '../services/api'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (tokenStorage.get() ? tokenStorage.getUser() : null))
  const [sessionExpired, setSessionExpired] = useState(false)

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await authService.login(email, password)
    tokenStorage.set(token)
    tokenStorage.setUser(u)
    setSessionExpired(false)
    setUser(u)
  }, [])

  // Cadastra e já autentica em seguida (o backend de register não devolve token)
  const register = useCallback(async (name, email, password) => {
    await authService.register(name, email, password)
    await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  // Token expirado/inválido em qualquer rota => derruba a sessão
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear()
      setUser(null)
      setSessionExpired(true)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, sessionExpired }),
    [user, login, register, logout, sessionExpired],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
