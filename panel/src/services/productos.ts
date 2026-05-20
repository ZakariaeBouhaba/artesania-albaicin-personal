import api from './api'
import type { Producto } from '../types'

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get('/productos/')
  return response.data
}

export const getProducto = async (id: number): Promise<Producto> => {
  const response = await api.get(`/productos/${id}`)
  return response.data
}

export const createProducto = async (producto: {
  nombre: string
  descripcion: string
  origen: string
  material: string
  hecho_a_mano: boolean
  categoria_id: number
  imagen_url: string
  estado: string
}): Promise<Producto> => {
  const response = await api.post('/productos/', producto)
  return response.data
}

export const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
  const response = await api.put(`/productos/${id}`, producto)
  return response.data
}

export const updateEstado = async (id: number, estado: string): Promise<Producto> => {
  const response = await api.patch(`/productos/${id}/estado`, null, { params: { estado } })
  return response.data
}

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}

export const subirImagen = async (productoId: number, file: File): Promise<{ imagen_url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post(`/imagenes/${productoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}