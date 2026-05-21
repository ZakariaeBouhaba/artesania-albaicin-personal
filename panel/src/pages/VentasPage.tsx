import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVentas, createVenta, deleteVenta } from '../services/ventas'
import { Plus, Trash2, Calendar } from 'lucide-react'

function VentasPage() {
  const queryClient = useQueryClient()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [fechaFiltro, setFechaFiltro] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [formData, setFormData] = useState({
    descripcion: '',
    precio_original: '',
    descuento: '0',
    metodo_pago: 'Efectivo',
    notas: ''
  })

  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => getVentas()
  })

  const ventasFiltradas = ventas.filter(v => {
    const fechaVenta = new Date(v.fecha).toISOString().split('T')[0]
    return fechaVenta === fechaFiltro
  })

  const esHoy = fechaFiltro === new Date().toISOString().split('T')[0]

  const totalFiltrado = ventasFiltradas.reduce((sum, v) => sum + v.total_final, 0)
  const totalTPV = ventasFiltradas.filter(v => v.metodo_pago === 'TPV').reduce((sum, v) => sum + v.total_final, 0)
  const totalEfectivo = ventasFiltradas.filter(v => v.metodo_pago === 'Efectivo').reduce((sum, v) => sum + v.total_final, 0)
  const totalFinal = Number(formData.precio_original) - Number(formData.descuento)

  const createMutation = useMutation({
    mutationFn: createVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
      setMostrarFormulario(false)
      setFormData({ descripcion: '', precio_original: '', descuento: '0', metodo_pago: 'Efectivo', notas: '' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      descripcion: formData.descripcion,
      precio_original: Number(formData.precio_original),
      descuento: Number(formData.descuento),
      total_final: totalFinal,
      metodo_pago: formData.metodo_pago,
      notas: formData.notas
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Ventas</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#C9922A] transition-colors"
        >
          <Plus size={16} />
          Nueva venta
        </button>
      </div>

      {/* FILTRO POR FECHA */}
      <div className="bg-white border border-[#F0E0B8] p-4 mb-6 flex items-center gap-4">
        <Calendar size={16} className="text-[#C9922A]" />
        <label className="text-[#C9922A] text-xs uppercase tracking-widest">Fecha</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="border border-[#F0E0B8] px-4 py-2 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
        />
        <button
          onClick={() => setFechaFiltro(new Date().toISOString().split('T')[0])}
          className="text-[#C9922A] text-xs uppercase tracking-widest hover:text-[#5C3D2E] transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">
            {esHoy ? 'Total hoy' : `Total ${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES')}`}
          </p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{totalFiltrado.toFixed(2)}€</p>
          <p className="text-[#8B7355] text-xs mt-1">{ventasFiltradas.length} ventas</p>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">💳 TPV</p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{totalTPV.toFixed(2)}€</p>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">💵 Efectivo</p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{totalEfectivo.toFixed(2)}€</p>
        </div>
      </div>

      {/* FORMULARIO NUEVA VENTA */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-full max-w-md">
            <h2 className="font-serif text-[#5C3D2E] text-2xl mb-6">Nueva venta</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descripción</label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Imán Granada + Taza..."
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Precio original (€)</label>
                <input
                  type="number"
                  value={formData.precio_original}
                  onChange={(e) => setFormData({ ...formData, precio_original: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descuento (€) — opcional</label>
                <input
                  type="number"
                  value={formData.descuento}
                  onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="bg-[#FDF8F0] border border-[#F0E0B8] px-4 py-3 flex justify-between items-center">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest">Total final</span>
                <span className="font-serif text-[#5C3D2E] text-2xl">{totalFinal.toFixed(2)}€</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Método de pago</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodo_pago: 'Efectivo' })}
                    className={`flex-1 py-3 text-xs uppercase tracking-widest border transition-colors ${
                      formData.metodo_pago === 'Efectivo'
                        ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white'
                        : 'border-[#F0E0B8] text-[#8B7355]'
                    }`}
                  >
                    💵 Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodo_pago: 'TPV' })}
                    className={`flex-1 py-3 text-xs uppercase tracking-widest border transition-colors ${
                      formData.metodo_pago === 'TPV'
                        ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white'
                        : 'border-[#F0E0B8] text-[#8B7355]'
                    }`}
                  >
                    💳 TPV
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Notas — opcional</label>
                <input
                  type="text"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales..."
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Registrando...' : 'Registrar venta'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE VENTAS */}
      <div className="bg-white border border-[#F0E0B8] p-6">
        <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">
          {esHoy ? 'Ventas de hoy' : `Ventas del ${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES')}`}
        </h2>
        {isLoading ? (
          <p className="text-[#8B7355] text-sm">Cargando...</p>
        ) : ventasFiltradas.length === 0 ? (
          <p className="text-[#8B7355] text-sm italic">No hay ventas registradas para esta fecha</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E0B8]">
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Hora</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Descripción</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Original</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Descuento</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Total</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Pago</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="border-b border-[#F0E0B8]">
                  <td className="py-3 text-[#8B7355] text-sm">
                    {new Date(venta.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-[#5C3D2E] text-sm">{venta.descripcion}</td>
                  <td className="py-3 text-[#8B7355] text-sm">{venta.precio_original}€</td>
                  <td className="py-3 text-[#8B7355] text-sm">{venta.descuento > 0 ? `-${venta.descuento}€` : '—'}</td>
                  <td className="py-3 text-[#5C3D2E] font-serif text-lg">{venta.total_final}€</td>
                  <td className="py-3">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${
                      venta.metodo_pago === 'TPV'
                        ? 'border-[#C9922A] text-[#C9922A]'
                        : 'border-[#5C3D2E] text-[#5C3D2E]'
                    }`}>
                      {venta.metodo_pago}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteMutation.mutate(venta.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default VentasPage