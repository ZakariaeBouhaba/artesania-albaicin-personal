export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
}

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

export interface Mensaje {
  id: number
  nombre: string
  email: string
  asunto: string
  mensaje: string
  fecha: string
  leido: boolean
}

export interface Venta {
  id: number
  descripcion: string
  precio_original: number
  descuento: number
  total_final: number
  metodo_pago: string
  notas?: string
  fecha: string
}

export interface Estadisticas {
  total_hoy: number
  total_semana: number
  total_mes: number
  total_tpv: number
  total_efectivo: number
  num_ventas_hoy: number
  num_mensajes_sin_leer: number
  num_productos_agotados: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}