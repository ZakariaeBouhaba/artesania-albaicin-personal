import api from './api'
import type { Estadisticas } from '../types'

export const getEstadisticas = async (): Promise<Estadisticas> => {
  const response = await api.get('/estadisticas/')
  return response.data
}