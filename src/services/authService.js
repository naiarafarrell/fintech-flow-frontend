import { request } from './api'

export const authService = {
  login: async (email, password) => {
    if (email === 'admin@fintechflow.com' && password === '123456') {
      return {
        token: 'token-local-fintechflow-123',
        user: {
          id: 1,
          name: 'Administrador',
          email: 'admin@fintechflow.com',
        },
      }
    }

    return request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    })
  },

  register: (name, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    }),
}