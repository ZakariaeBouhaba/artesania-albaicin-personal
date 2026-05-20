import api from './api'
import type { TokenResponse, Usuario } from '../types'

export const login = async (email: string, contrasena: string): Promise<TokenResponse> => {
  const formData = new FormData()
  formData.append('username', email)
  formData.append('password', contrasena)

  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return response.data
}

export const crearUsuario = async (usuario: {
  nombre: string
  email: string
  contrasena: string
  rol: string
}): Promise<Usuario> => {
  const response = await api.post('/auth/crear-usuario', usuario)
  return response.data
}