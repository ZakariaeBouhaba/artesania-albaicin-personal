import api from './api'
import type { Categoria } from '../types'

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await api.get('/categorias/')
  return response.data
}

export const getCategoria = async (id: number): Promise<Categoria> => {
  const response = await api.get(`/categorias/${id}`)
  return response.data
}

export const createCategoria = async (categoria: {
  nombre: string
  descripcion?: string
  imagen_url?: string
}): Promise<Categoria> => {
  const response = await api.post('/categorias/', categoria)
  return response.data
}

export const updateCategoria = async (id: number, categoria: {
  nombre: string
  descripcion?: string
  imagen_url?: string
}): Promise<Categoria> => {
  const response = await api.put(`/categorias/${id}`, categoria)
  return response.data
}

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}