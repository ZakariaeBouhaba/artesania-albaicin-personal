import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductos, createProducto, updateProducto, updateEstado, deleteProducto, subirImagen } from '../services/productos'
import { getCategorias } from '../services/categorias'
import { Plus, Pencil, Trash2, Upload, PackagePlus } from 'lucide-react'
import type { Producto } from '../types'

const MATERIALES = [
  'Cuero vaca',
  'Cuero marroquí',
  'Alpaca plateada',
  'Acero inoxidable',
  'Plata de ley',
  'Cerámica',
  'Madera',
  'Cristal',
  'Hierro fundido',
  'Tela / Textil',
  'Otro'
]

interface ProductoMasivo {
  file: File
  preview: string
  nombre: string
  categoria_id: number
  origen: string
  material: string
  estado: string
  hecho_a_mano: boolean
  subiendo: boolean
  subido: boolean
  error: string
}

function ProductosPage() {
  const queryClient = useQueryClient()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarMasivo, setMostrarMasivo] = useState(false)
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
  const [materialPersonalizado, setMaterialPersonalizado] = useState('')
  const [productosMasivos, setProductosMasivos] = useState<ProductoMasivo[]>([])
  const [subiendoMasivo, setSubiendoMasivo] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    origen: '',
    material: '',
    hecho_a_mano: true,
    categoria_id: 0,
    imagen_url: '',
    estado: 'disponible'
  })

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos
  })

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias
  })

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      cerrarFormulario()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Producto> }) =>
      updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      cerrarFormulario()
    }
  })

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      updateEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
    }
  })

  const subirImagenMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      subirImagen(id, file),
    onSuccess: (data, variables) => {
      updateEstadoMutation.mutate({ id: variables.id, estado: formData.estado })
      setFormData(prev => ({ ...prev, imagen_url: data.imagen_url }))
      queryClient.invalidateQueries({ queryKey: ['productos'] })
    }
  })

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setProductoEditando(null)
    setMaterialPersonalizado('')
    setFormData({
      nombre: '',
      descripcion: '',
      origen: '',
      material: '',
      hecho_a_mano: true,
      categoria_id: 0,
      imagen_url: '',
      estado: 'disponible'
    })
  }

  const abrirEditar = (producto: Producto) => {
    setProductoEditando(producto)
    const esMaterialLista = MATERIALES.includes(producto.material)
    if (!esMaterialLista && producto.material) {
      setMaterialPersonalizado(producto.material)
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        origen: producto.origen,
        material: 'Otro',
        hecho_a_mano: producto.hecho_a_mano,
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url,
        estado: producto.estado
      })
    } else {
      setMaterialPersonalizado('')
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        origen: producto.origen,
        material: producto.material,
        hecho_a_mano: producto.hecho_a_mano,
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url,
        estado: producto.estado
      })
    }
    setMostrarFormulario(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const materialFinal = formData.material === 'Otro' ? materialPersonalizado : formData.material
    const datos = { ...formData, material: materialFinal }
    if (productoEditando) {
      updateMutation.mutate({ id: productoEditando.id, data: datos })
    } else {
      createMutation.mutate(datos)
    }
  }

  const handleImagenChange = async (e: React.ChangeEvent<HTMLInputElement>, productoId: number) => {
    const file = e.target.files?.[0]
    if (file) {
      subirImagenMutation.mutate({ id: productoId, file })
    }
  }

  // SUBIDA MASIVA
  const handleSeleccionarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const nuevos: ProductoMasivo[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      nombre: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      categoria_id: categorias[0]?.id || 0,
      origen: 'Granada',
      material: 'Cuero marroquí',
      estado: 'disponible',
      hecho_a_mano: true,
      subiendo: false,
      subido: false,
      error: ''
    }))
    setProductosMasivos(prev => [...prev, ...nuevos])
  }

  const actualizarProductoMasivo = (index: number, campo: string, valor: string | number | boolean) => {
    setProductosMasivos(prev => prev.map((p, i) =>
      i === index ? { ...p, [campo]: valor } : p
    ))
  }

  const eliminarProductoMasivo = (index: number) => {
    setProductosMasivos(prev => prev.filter((_, i) => i !== index))
  }

  const subirTodos = async () => {
    setSubiendoMasivo(true)
    for (let i = 0; i < productosMasivos.length; i++) {
      const pm = productosMasivos[i]
      if (pm.subido) continue
      try {
        setProductosMasivos(prev => prev.map((p, idx) =>
          idx === i ? { ...p, subiendo: true } : p
        ))
        const productoCreado = await createProducto({
          nombre: pm.nombre,
          descripcion: '',
          origen: pm.origen,
          material: pm.material,
          hecho_a_mano: pm.hecho_a_mano,
          categoria_id: pm.categoria_id,
          imagen_url: '',
          estado: pm.estado
        })
        await subirImagen(productoCreado.id, pm.file)
        setProductosMasivos(prev => prev.map((p, idx) =>
          idx === i ? { ...p, subiendo: false, subido: true } : p
        ))
      } catch {
        setProductosMasivos(prev => prev.map((p, idx) =>
          idx === i ? { ...p, subiendo: false, error: 'Error al subir' } : p
        ))
      }
    }
    setSubiendoMasivo(false)
    queryClient.invalidateQueries({ queryKey: ['productos'] })
  }

  const cerrarMasivo = () => {
    setMostrarMasivo(false)
    setProductosMasivos([])
  }

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'border-green-600 text-green-600'
      case 'agotado': return 'border-red-600 text-red-600'
      default: return 'border-[#C9922A] text-[#C9922A]'
    }
  }

  const estadoLabel = (estado: string) => {
    switch (estado) {
      case 'disponible': return '✅ Disponible'
      case 'agotado': return '❌ Agotado'
      default: return '📦 Bajo pedido'
    }
  }

  const productosPendientes = productosMasivos.filter(p => !p.subido).length
  const productosSubidos = productosMasivos.filter(p => p.subido).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Productos</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarMasivo(true)}
            className="flex items-center gap-2 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#5C3D2E] hover:text-white transition-colors"
          >
            <PackagePlus size={16} />
            Subida masiva
          </button>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#C9922A] transition-colors"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      {/* FORMULARIO INDIVIDUAL */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-8 w-full max-w-lg my-auto">
            <h2 className="font-serif text-[#5C3D2E] text-2xl mb-6">
              {productoEditando ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Nombre del producto"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  placeholder="Descripción del producto"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Origen</label>
                  <input
                    type="text"
                    value={formData.origen}
                    onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                    placeholder="Granada, Marruecos..."
                    className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Material</label>
                  <select
                    value={formData.material}
                    onChange={(e) => {
                      setFormData({ ...formData, material: e.target.value })
                      if (e.target.value !== 'Otro') setMaterialPersonalizado('')
                    }}
                    className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                  >
                    <option value="">— Selecciona —</option>
                    {MATERIALES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {formData.material === 'Otro' && (
                    <input
                      type="text"
                      value={materialPersonalizado}
                      onChange={(e) => setMaterialPersonalizado(e.target.value)}
                      required
                      placeholder="Escribe el material..."
                      className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Categoría</label>
                  <select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: Number(e.target.value) })}
                    required
                    className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                  >
                    <option value={0}>— Selecciona —</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                  >
                    <option value="disponible">✅ Disponible</option>
                    <option value="agotado">❌ Agotado</option>
                    <option value="bajo_pedido">📦 Bajo pedido</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hecho_a_mano"
                  checked={formData.hecho_a_mano}
                  onChange={(e) => setFormData({ ...formData, hecho_a_mano: e.target.checked })}
                  className="w-4 h-4 accent-[#C9922A]"
                />
                <label htmlFor="hecho_a_mano" className="text-[#5C3D2E] text-sm">Hecho a mano</label>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50"
                >
                  {productoEditando ? 'Guardar cambios' : 'Crear producto'}
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

      {/* MODAL SUBIDA MASIVA */}
      {mostrarMasivo && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white w-full max-w-5xl mx-4 my-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F0E0B8]">
              <div>
                <h2 className="font-serif text-[#5C3D2E] text-2xl">Subida masiva de productos</h2>
                <p className="text-[#8B7355] text-sm mt-1">Selecciona varias fotos y configura cada producto</p>
              </div>
              {productosMasivos.length > 0 && (
                <div className="text-right">
                  <p className="text-[#8B7355] text-xs">{productosSubidos}/{productosMasivos.length} subidos</p>
                  <div className="w-32 h-1 bg-[#F0E0B8] mt-1">
                    <div
                      className="h-full bg-[#C9922A] transition-all"
                      style={{ width: `${(productosSubidos / productosMasivos.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Zona de subida */}
            <div className="p-6 border-b border-[#F0E0B8]">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#C9922A]/40 p-8 cursor-pointer hover:border-[#C9922A] hover:bg-[#FDF8F0] transition-colors">
                <Upload size={32} className="text-[#C9922A] mb-3" />
                <p className="text-[#5C3D2E] font-serif text-lg mb-1">Seleccionar fotos</p>
                <p className="text-[#8B7355] text-sm">JPG, PNG o WEBP — puedes seleccionar varias a la vez</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleSeleccionarFotos}
                />
              </label>
            </div>

            {/* Lista de productos */}
            {productosMasivos.length > 0 && (
              <div className="p-6 max-h-[50vh] overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {productosMasivos.map((pm, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 p-4 border ${
                        pm.subido ? 'border-green-200 bg-green-50' :
                        pm.error ? 'border-red-200 bg-red-50' :
                        'border-[#F0E0B8]'
                      }`}
                    >
                      {/* Imagen preview */}
                      <img
                        src={pm.preview}
                        alt={pm.nombre}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />

                      {/* Campos */}
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={pm.nombre}
                            onChange={(e) => actualizarProductoMasivo(index, 'nombre', e.target.value)}
                            placeholder="Nombre del producto"
                            disabled={pm.subido}
                            className="w-full border border-[#F0E0B8] px-3 py-2 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] disabled:opacity-50"
                          />
                        </div>
                        <select
                          value={pm.categoria_id}
                          onChange={(e) => actualizarProductoMasivo(index, 'categoria_id', Number(e.target.value))}
                          disabled={pm.subido}
                          className="border border-[#F0E0B8] px-3 py-2 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] disabled:opacity-50"
                        >
                          {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                          ))}
                        </select>
                        <select
                          value={pm.origen}
                          onChange={(e) => actualizarProductoMasivo(index, 'origen', e.target.value)}
                          disabled={pm.subido}
                          className="border border-[#F0E0B8] px-3 py-2 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] disabled:opacity-50"
                        >
                          <option value="Granada">Granada</option>
                          <option value="Marruecos">Marruecos</option>
                          <option value="Turquía">Turquía</option>
                          <option value="España">España</option>
                        </select>
                      </div>

                      {/* Estado / Acciones */}
                      <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                        {pm.subido ? (
                          <span className="text-green-600 text-xs font-medium">✅ Subido</span>
                        ) : pm.error ? (
                          <span className="text-red-500 text-xs">{pm.error}</span>
                        ) : pm.subiendo ? (
                          <span className="text-[#C9922A] text-xs">Subiendo...</span>
                        ) : (
                          <button
                            onClick={() => eliminarProductoMasivo(index)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 p-6 border-t border-[#F0E0B8]">
              {productosPendientes > 0 && (
                <button
                  onClick={subirTodos}
                  disabled={subiendoMasivo}
                  className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50"
                >
                  {subiendoMasivo
                    ? `Subiendo... (${productosSubidos}/${productosMasivos.length})`
                    : `Subir ${productosPendientes} producto${productosPendientes > 1 ? 's' : ''}`
                  }
                </button>
              )}
              <button
                onClick={cerrarMasivo}
                disabled={subiendoMasivo}
                className="flex-1 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors disabled:opacity-50"
              >
                {productosSubidos > 0 ? 'Cerrar' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTA */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#F0E0B8] animate-pulse h-64" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="bg-white border border-[#F0E0B8] p-12 text-center">
          <p className="font-serif text-[#5C3D2E] text-2xl mb-2">No hay productos</p>
          <p className="text-[#8B7355] text-sm">Añade tu primer producto haciendo clic en "Nuevo producto" o usa "Subida masiva"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white border border-[#F0E0B8] overflow-hidden">
              <div className="relative aspect-square bg-[#FDF8F0]">
                {producto.imagen_url ? (
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8B7355] text-sm">
                    Sin imagen
                  </div>
                )}
                <label className="absolute bottom-2 right-2 bg-white border border-[#C9922A] text-[#C9922A] p-2 cursor-pointer hover:bg-[#C9922A] hover:text-white transition-colors">
                  <Upload size={14} />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleImagenChange(e, producto.id)}
                  />
                </label>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif text-[#5C3D2E] text-lg leading-tight">{producto.nombre}</h3>
                  <span className={`text-xs border px-2 py-0.5 flex-shrink-0 ${estadoColor(producto.estado)}`}>
                    {estadoLabel(producto.estado)}
                  </span>
                </div>
                <p className="text-[#8B7355] text-xs mb-3">{producto.categoria?.nombre}</p>
                <select
                  value={producto.estado}
                  onChange={(e) => updateEstadoMutation.mutate({ id: producto.id, estado: e.target.value })}
                  className="w-full border border-[#F0E0B8] px-3 py-2 text-[#5C3D2E] text-xs outline-none focus:border-[#C9922A] mb-3"
                >
                  <option value="disponible">✅ Disponible</option>
                  <option value="agotado">❌ Agotado</option>
                  <option value="bajo_pedido">📦 Bajo pedido</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => abrirEditar(producto)}
                    className="flex-1 flex items-center justify-center gap-1 border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest py-2 hover:bg-[#C9922A] hover:text-white transition-colors"
                  >
                    <Pencil size={12} />
                    Editar
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(producto.id)}
                    className="flex items-center justify-center gap-1 border border-red-400 text-red-400 text-xs uppercase tracking-widest px-3 py-2 hover:bg-red-400 hover:text-white transition-colors"
                  >
                    <Trash2 size={12} />
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

export default ProductosPage