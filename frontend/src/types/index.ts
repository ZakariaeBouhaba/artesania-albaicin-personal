export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  imagen_url?: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  origen: string
  material: string
  hecho_a_mano: boolean
  categoria_id: number
  categoria: Categoria
  imagen_url: string
  estado: string
}