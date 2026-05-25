import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getImagenes, subirImagen, deleteImagen } from '../services/productos'
import { Upload, Trash2, Star, X } from 'lucide-react'
import { updateProducto } from '../services/productos'

interface Props {
  productoId: number
  imagenPrincipal: string
  onCerrar: () => void
}

function GaleriaImagenes({ productoId, imagenPrincipal, onCerrar }: Props) {
  const queryClient = useQueryClient()
  const [subiendo, setSubiendo] = useState(false)

  const { data: imagenes = [], isLoading } = useQuery({
    queryKey: ['imagenes', productoId],
    queryFn: () => getImagenes(productoId)
  })

  const deleteMutation = useMutation({
    mutationFn: deleteImagen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imagenes', productoId] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })

  const setPrincipalMutation = useMutation({
    mutationFn: (imagen_url: string) => updateProducto(productoId, { imagen_url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setSubiendo(true)
    for (const file of files) {
      await subirImagen(productoId, file)
    }
    queryClient.invalidateQueries({ queryKey: ['imagenes', productoId] })
    queryClient.invalidateQueries({ queryKey: ['productos'] })
    setSubiendo(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-8">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0E0B8]">
          <h3 className="font-serif text-[#5C3D2E] text-xl">Galería de imágenes</h3>
          <button onClick={onCerrar} className="text-[#8B7355] hover:text-[#5C3D2E] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Subir fotos */}
          <label className={`flex items-center justify-center gap-3 border-2 border-dashed border-[#C9922A]/40 p-5 cursor-pointer hover:border-[#C9922A] hover:bg-[#FDF8F0] transition-colors mb-6 ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={20} className="text-[#C9922A]" />
            <span className="text-[#5C3D2E] text-sm">
              {subiendo ? 'Subiendo...' : 'Añadir más fotos (puedes seleccionar varias)'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleSubir}
              disabled={subiendo}
            />
          </label>

          {/* Grid de imágenes */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#F0E0B8] animate-pulse" />
              ))}
            </div>
          ) : imagenes.length === 0 ? (
            <p className="text-[#8B7355] text-sm text-center py-8 italic">No hay imágenes todavía</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {imagenes.map((imagen) => {
                const esPrincipal = imagen.imagen_url === imagenPrincipal
                return (
                  <div key={imagen.id} className="relative group aspect-square">
                    <img
                      src={imagen.imagen_url}
                      alt=""
                      className={`w-full h-full object-cover ${esPrincipal ? 'ring-2 ring-[#C9922A]' : ''}`}
                    />
                    {/* Badge principal */}
                    {esPrincipal && (
                      <div className="absolute top-2 left-2 bg-[#C9922A] text-white text-xs px-2 py-0.5 flex items-center gap-1">
                        <Star size={10} fill="white" />
                        Principal
                      </div>
                    )}
                    {/* Acciones al hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!esPrincipal && (
                        <button
                          onClick={() => setPrincipalMutation.mutate(imagen.imagen_url)}
                          className="bg-[#C9922A] text-white p-2 rounded hover:bg-[#E8C46A] transition-colors"
                          title="Hacer principal"
                        >
                          <Star size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(imagen.id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <p className="text-[#8B7355] text-xs mt-4">
            ✦ Haz clic en <Star size={10} className="inline" /> para establecer la imagen principal que se muestra en el catálogo.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F0E0B8]">
          <button
            onClick={onCerrar}
            className="w-full border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest py-3 hover:bg-[#5C3D2E] hover:text-white transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  )
}

export default GaleriaImagenes