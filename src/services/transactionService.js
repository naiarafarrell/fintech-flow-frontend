import { request } from './api'

/** Normaliza o payload do backend: amount vem como string ("5000.00") e date como ISO. */
export const normalize = (t) => ({
  ...t,
  amount: Number(t.amount),
  // pega só YYYY-MM-DD para evitar deslocamento de fuso horário
  date: String(t.date).slice(0, 10),
})

export const transactionService = {
  // Leitura
  list: async (signal) => (await request('/api/transactions', { signal })).map(normalize),
  get: async (id) => normalize(await request(`/api/transactions/${id}`)),
  // Gravação
  create: async (data) => normalize(await request('/api/transactions', { method: 'POST', body: data })),
  // Atualização
  update: async (id, data) => normalize(await request(`/api/transactions/${id}`, { method: 'PUT', body: data })),
  remove: (id) => request(`/api/transactions/${id}`, { method: 'DELETE' }),
}
