import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMensajes, marcarLeido, deleteMensaje } from '../services/mensajes'
import { Trash2, Mail, MailOpen } from 'lucide-react'

function MensajesPage() {
  const queryClient = useQueryClient()

  const { data: mensajes = [], isLoading } = useQuery({
    queryKey: ['mensajes'],
    queryFn: () => getMensajes()
  })

  const marcarLeidoMutation = useMutation({
    mutationFn: marcarLeido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensajes'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMensaje,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensajes'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
    }
  })

  const mensajesSinLeer = mensajes.filter(m => !m.leido).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Mensajes</h1>
        {mensajesSinLeer > 0 && (
          <span className="bg-[#C9922A] text-white text-xs uppercase tracking-widest px-3 py-1">
            {mensajesSinLeer} sin leer
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-[#8B7355]">Cargando...</p>
      ) : mensajes.length === 0 ? (
        <div className="bg-white border border-[#F0E0B8] p-12 text-center">
          <p className="font-serif text-[#5C3D2E] text-2xl mb-2">No hay mensajes</p>
          <p className="text-[#8B7355] text-sm">Los mensajes del formulario de contacto aparecerán aquí</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`bg-white border p-6 ${
                !mensaje.leido ? 'border-[#C9922A]' : 'border-[#F0E0B8]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!mensaje.leido ? (
                      <Mail size={16} className="text-[#C9922A]" />
                    ) : (
                      <MailOpen size={16} className="text-[#8B7355]" />
                    )}
                    <span className="font-medium text-[#5C3D2E] text-sm">{mensaje.nombre}</span>
                    <span className="text-[#8B7355] text-xs">{mensaje.email}</span>
                    <span className="text-[#8B7355] text-xs ml-auto">
                      {new Date(mensaje.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">{mensaje.asunto}</p>
                  <p className="text-[#8B7355] text-sm leading-relaxed">{mensaje.mensaje}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!mensaje.leido && (
                    <button
                      onClick={() => marcarLeidoMutation.mutate(mensaje.id)}
                      className="text-[#C9922A] hover:text-[#5C3D2E] transition-colors"
                      title="Marcar como leído"
                    >
                      <MailOpen size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(mensaje.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Eliminar mensaje"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MensajesPage