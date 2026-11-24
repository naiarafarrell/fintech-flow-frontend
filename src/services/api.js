/**
 * Cliente HTTP único da aplicação.
 * - Injeta o Bearer token automaticamente
 * - Normaliza erros do backend ({ error: "..." }) em ApiError
 * - Dispara um callback global quando o token expira (401)
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001').replace(/\/$/, '')

const TOKEN_KEY = 'fintechflow_token'
const USER_KEY = 'fintechflow_user'

export const tokenStorage = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* storage indisponível */ } },
  getUser: () => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },
  setUser: (u) => { try { localStorage.setItem(USER_KEY, JSON.stringify(u)) } catch { /* noop */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) } catch { /* noop */ } },
}

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

export async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = tokenStorage.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 0)
  }

  if (res.status === 204) return null

  let data = null
  try { data = await res.json() } catch { /* corpo vazio */ }

  if (!res.ok) {
    // 401 em rota autenticada = sessão expirada
    if (res.status === 401 && auth && token) onUnauthorized?.()
    throw new ApiError(data?.error || data?.message || `Erro inesperado (${res.status})`, res.status)
  }
  return data
}
