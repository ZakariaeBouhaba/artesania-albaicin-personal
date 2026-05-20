import api from './api'

interface MensajeContacto {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

export const enviarMensaje = async (datos: MensajeContacto): Promise<void> => {
  await api.post('/contacto/', datos)
}