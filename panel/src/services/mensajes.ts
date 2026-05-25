import api from './api'
import type { Mensaje } from '../types'

export const getMensajes = async (leido?: boolean): Promise<Mensaje[]> => {
  const params: Record<string, boolean> = {}
  if (leido !== undefined) params.leido = leido
  const response = await api.get('/contacto/', { params })
  return response.data
}

export const getMensaje = async (id: number): Promise<Mensaje> => {
  const response = await api.get(`/contacto/${id}`)
  return response.data
}

export const marcarLeido = async (id: number): Promise<Mensaje> => {
  const response = await api.patch(`/contacto/${id}/leido`)
  return response.data
}

export const deleteMensaje = async (id: number): Promise<void> => {
  await api.delete(`/contacto/${id}`)
}