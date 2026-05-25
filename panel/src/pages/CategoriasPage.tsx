import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/categorias'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import type { Categoria } from '../types'

function CategoriasPage() {
  const queryClient = useQueryClient()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen_url: ''
  })

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias
  })

  const categoriasFiltradas = categorias.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const createMutation = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarFormulario()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof formData }) =>
      updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      cerrarFormulario()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setCategoriaEditando(null)
    setFormData({ nombre: '', descripcion: '', imagen_url: '' })
  }

  const abrirEditar = (categoria: Categoria) => {
    setCategoriaEditando(categoria)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      imagen_url: categoria.imagen_url || ''
    })
    setMostrarFormulario(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoriaEditando) {
      updateMutation.mutate({ id: categoriaEditando.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Categorías</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#C9922A] transition-colors"
        >
          <Plus size={16} />
          Nueva categoría
        </button>
      </div>

      {/* BÚSQUEDA */}
      <div className="bg-white border border-[#F0E0B8] p-4 mb-6 flex items-center gap-3">
        <Search size={16} className="text-[#C9922A]" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar categoría..."
          className="flex-1 text-[#5C3D2E] text-sm outline-none"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            className="text-[#8B7355] text-xs hover:text-[#5C3D2E] transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-full max-w-md">
            <h2 className="font-serif text-[#5C3D2E] text-2xl mb-6">
              {categoriaEditando ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Nombre de la categoría"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descripción</label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción opcional"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">URL de imagen</label>
                <input
                  type="text"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="/ceramica.png"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50"
                >
                  {categoriaEditando ? 'Guardar cambios' : 'Crear categoría'}
                </button>
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="flex-1 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA */}
      {isLoading ? (
        <p className="text-[#8B7355]">Cargando...</p>
      ) : (
        <div className="bg-white border border-[#F0E0B8]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E0B8]">
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest p-4">Imagen</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest p-4">Nombre</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest p-4">Descripción</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#8B7355] text-sm italic">
                    No se encontraron categorías
                  </td>
                </tr>
              ) : (
                categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id} className="border-b border-[#F0E0B8]">
                    <td className="p-4">
                      {categoria.imagen_url ? (
                        <img src={categoria.imagen_url} alt={categoria.nombre} className="w-12 h-12 object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-[#F0E0B8]" />
                      )}
                    </td>
                    <td className="p-4 text-[#5C3D2E] font-medium">{categoria.nombre}</td>
                    <td className="p-4 text-[#8B7355] text-sm">{categoria.descripcion || '—'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEditar(categoria)}
                          className="text-[#C9922A] hover:text-[#5C3D2E] transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(categoria.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CategoriasPage