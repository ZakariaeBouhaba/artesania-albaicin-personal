import api from './api'
import type { Producto } from '../types'

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get('/productos/')
  return response.data
}

export const getProductosByCategoria = async (categoria_id: number): Promise<Producto[]> => {
  const response = await api.get('/productos/', { params: { categoria_id } })
  return response.data
}

export const getProducto = async (id: number): Promise<Producto> => {
  const response = await api.get(`/productos/${id}`)
  return response.data
}