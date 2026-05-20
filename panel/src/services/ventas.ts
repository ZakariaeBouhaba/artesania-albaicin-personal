import api from './api'
import type { Venta } from '../types'

export const getVentas = async (fecha_desde?: string, fecha_hasta?: string, metodo_pago?: string): Promise<Venta[]> => {
  const params: Record<string, string> = {}
  if (fecha_desde) params.fecha_desde = fecha_desde
  if (fecha_hasta) params.fecha_hasta = fecha_hasta
  if (metodo_pago) params.metodo_pago = metodo_pago
  const response = await api.get('/ventas/', { params })
  return response.data
}

export const getVenta = async (id: number): Promise<Venta> => {
  const response = await api.get(`/ventas/${id}`)
  return response.data
}

export const createVenta = async (venta: {
  descripcion: string
  precio_original: number
  descuento: number
  total_final: number
  metodo_pago: string
  notas?: string
}): Promise<Venta> => {
  const response = await api.post('/ventas/', venta)
  return response.data
}

export const deleteVenta = async (id: number): Promise<void> => {
  await api.delete(`/ventas/${id}`)
}