export interface Producto {
  id: number
  nombre: string
  descripcion: string
  origen: string
  material: string
  hecho_a_mano: boolean
  categoria: string
  imagen_url: string
}

export interface Categoria {
  id: number
  nombre: string
}