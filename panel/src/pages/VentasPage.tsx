import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVentas, createVenta, deleteVenta } from '../services/ventas'
import { getProductos } from '../services/productos'
import { Plus, Trash2, Calendar, Download, Search, X, Printer } from 'lucide-react'
import type { Producto, Venta } from '../types'

function imprimirTicket(venta: Venta) {
  const ventana = window.open('', '_blank', 'width=400,height=600')
  if (!ventana) return

  const fecha = new Date(venta.fecha).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
  const hora = new Date(venta.fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit'
  })

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Ticket — Artesanía Albaicín</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Inter+Tight:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter Tight', sans-serif;
          width: 320px;
          margin: 0 auto;
          padding: 24px 16px;
          color: #333;
        }
        .logo-area {
          text-align: center;
          border-bottom: 1px solid #C9922A;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .logo-area h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: #5C3D2E;
          margin-bottom: 2px;
        }
        .logo-area p {
          font-size: 10px;
          color: #8B7355;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .info {
          font-size: 11px;
          color: #8B7355;
          margin-bottom: 16px;
          text-align: center;
        }
        .divider {
          border: none;
          border-top: 1px dashed #C9922A;
          margin: 12px 0;
        }
        .linea {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 6px;
          color: #333;
        }
        .linea.label {
          color: #8B7355;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .linea.total {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #5C3D2E;
          font-weight: 600;
          margin-top: 8px;
        }
        .descuento {
          color: #C9922A;
        }
        .metodo {
          display: inline-block;
          border: 1px solid #5C3D2E;
          color: #5C3D2E;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 3px 8px;
          margin-top: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #C9922A;
          font-size: 10px;
          color: #8B7355;
          line-height: 1.8;
        }
        .footer .gracias {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #5C3D2E;
          margin-bottom: 4px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="logo-area">
        <h1>Artesanía Albaicín</h1>
        <p>Calle Calderería Nueva · Granada</p>
      </div>

      <div class="info">
        Ticket nº ${venta.id} · ${fecha} · ${hora}
      </div>

      <hr class="divider" />

      <div class="linea label">
        <span>Descripción</span>
      </div>
      <div class="linea">
        <span>${venta.descripcion}</span>
      </div>

      <hr class="divider" />

      <div class="linea">
        <span>Precio original</span>
        <span>${venta.precio_original.toFixed(2)}€</span>
      </div>

      ${venta.descuento > 0 ? `
      <div class="linea descuento">
        <span>Descuento</span>
        <span>-${venta.descuento.toFixed(2)}€</span>
      </div>
      ` : ''}

      <div class="linea total">
        <span>Total</span>
        <span>${venta.total_final.toFixed(2)}€</span>
      </div>

      <div style="margin-top: 8px;">
        <span class="metodo">${venta.metodo_pago}</span>
      </div>

      ${venta.notas ? `
      <hr class="divider" />
      <div class="linea label"><span>Notas</span></div>
      <div class="linea"><span>${venta.notas}</span></div>
      ` : ''}

      <div class="footer">
        <p class="gracias">¡Gracias por su visita!</p>
        <p>Artesanía del corazón de Granada</p>
        <p>hola@artesaniaalbaicin.es</p>
        <p>Lun — Dom · 9:30 — 00:00</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `)
  ventana.document.close()
}

function VentasPage() {
  const queryClient = useQueryClient()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [fechaFiltro, setFechaFiltro] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [periodoVista, setPeriodoVista] = useState<'dia' | 'semana' | 'mes'>('dia')
  const [tipoDescuento, setTipoDescuento] = useState<'euros' | 'porcentaje'>('euros')
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)
  const [formData, setFormData] = useState({
    descripcion: '',
    precio_original: '',
    cantidad: '1',
    descuento: '0',
    metodo_pago: 'Efectivo',
    notas: ''
  })

  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => getVentas()
  })

  const { data: productos = [] } = useQuery({
    queryKey: ['productos'],
    queryFn: () => getProductos()
  })

  const productosFiltrados = productos.filter(p =>
    p.estado !== 'agotado' &&
    (p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
     p.categoria.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()))
  )

  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto)
    setBusquedaProducto(producto.nombre)
    setFormData(prev => ({ ...prev, descripcion: producto.nombre }))
    setMostrarDropdown(false)
  }

  const limpiarProducto = () => {
    setProductoSeleccionado(null)
    setBusquedaProducto('')
    setFormData(prev => ({ ...prev, descripcion: '', precio_original: '' }))
  }

  const getRangoDeFechas = () => {
    const fecha = new Date(fechaFiltro + 'T00:00:00')
    if (periodoVista === 'dia') {
      return { inicio: fechaFiltro, fin: fechaFiltro }
    } else if (periodoVista === 'semana') {
      const diaSemana = fecha.getDay() === 0 ? 6 : fecha.getDay() - 1
      const lunes = new Date(fecha)
      lunes.setDate(fecha.getDate() - diaSemana)
      const domingo = new Date(lunes)
      domingo.setDate(lunes.getDate() + 6)
      return { inicio: lunes.toISOString().split('T')[0], fin: domingo.toISOString().split('T')[0] }
    } else {
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
      return { inicio: primerDia.toISOString().split('T')[0], fin: ultimoDia.toISOString().split('T')[0] }
    }
  }

  const { inicio, fin } = getRangoDeFechas()

  const ventasFiltradas = ventas.filter(v => {
    const fechaVenta = new Date(v.fecha).toISOString().split('T')[0]
    return fechaVenta >= inicio && fechaVenta <= fin
  })

  const esHoy = fechaFiltro === new Date().toISOString().split('T')[0]
  const totalFiltrado = ventasFiltradas.reduce((sum, v) => sum + v.total_final, 0)
  const totalTPV = ventasFiltradas.filter(v => v.metodo_pago === 'TPV').reduce((sum, v) => sum + v.total_final, 0)
  const totalEfectivo = ventasFiltradas.filter(v => v.metodo_pago === 'Efectivo').reduce((sum, v) => sum + v.total_final, 0)

  const precioOriginal = Number(formData.precio_original) || 0
  const cantidad = Number(formData.cantidad) || 1
  const descuento = Number(formData.descuento) || 0
  const subtotal = precioOriginal * cantidad
  const descuentoEuros = tipoDescuento === 'porcentaje' ? subtotal * (descuento / 100) : descuento
  const totalFinal = Math.max(0, subtotal - descuentoEuros)

  const resetFormulario = () => {
    setMostrarFormulario(false)
    setFormData({ descripcion: '', precio_original: '', cantidad: '1', descuento: '0', metodo_pago: 'Efectivo', notas: '' })
    setTipoDescuento('euros')
    setProductoSeleccionado(null)
    setBusquedaProducto('')
    setMostrarDropdown(false)
  }

  const createMutation = useMutation({
    mutationFn: createVenta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] })
      queryClient.invalidateQueries({ queryKey: ['estadisticas'] })
      resetFormulario()
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
    const descripcionFinal = cantidad > 1 ? `${formData.descripcion} (x${cantidad})` : formData.descripcion
    createMutation.mutate({
      descripcion: descripcionFinal,
      precio_original: subtotal,
      descuento: descuentoEuros,
      total_final: totalFinal,
      metodo_pago: formData.metodo_pago,
      notas: formData.notas
    })
  }

  const exportarCSV = () => {
    const headers = ['Fecha', 'Hora', 'Descripción', 'Precio Original', 'Descuento', 'Total', 'Método de Pago', 'Notas']
    const rows = ventasFiltradas.map(v => [
      new Date(v.fecha).toLocaleDateString('es-ES'),
      new Date(v.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      v.descripcion,
      `${v.precio_original}€`,
      v.descuento > 0 ? `-${v.descuento}€` : '0€',
      `${v.total_final}€`,
      v.metodo_pago,
      v.notas || ''
    ])
    const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const periodo = periodoVista === 'dia' ? fechaFiltro : periodoVista === 'semana' ? `semana-${inicio}` : `mes-${inicio.slice(0, 7)}`
    link.download = `ventas-${periodo}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getTituloResumen = () => {
    if (periodoVista === 'dia') return esHoy ? 'Total hoy' : `Total ${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES')}`
    if (periodoVista === 'semana') return `Semana del ${new Date(inicio + 'T00:00:00').toLocaleDateString('es-ES')}`
    return `${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
  }

  const getTituloLista = () => {
    if (periodoVista === 'dia') return esHoy ? 'Ventas de hoy' : `Ventas del ${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES')}`
    if (periodoVista === 'semana') return `Ventas de la semana`
    return `Ventas de ${new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Ventas</h1>
        <div className="flex gap-3">
          {ventasFiltradas.length > 0 && (
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#5C3D2E] hover:text-white transition-colors"
            >
              <Download size={16} />
              Exportar CSV
            </button>
          )}
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#C9922A] transition-colors"
          >
            <Plus size={16} />
            Nueva venta
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white border border-[#F0E0B8] p-4 mb-6 flex flex-wrap items-center gap-4">
        <Calendar size={16} className="text-[#C9922A]" />
        <label className="text-[#C9922A] text-xs uppercase tracking-widest">Fecha</label>
        <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} className="border border-[#F0E0B8] px-4 py-2 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
        <button onClick={() => setFechaFiltro(new Date().toISOString().split('T')[0])} className="text-[#C9922A] text-xs uppercase tracking-widest hover:text-[#5C3D2E] transition-colors">Hoy</button>
        <div className="ml-auto flex gap-2">
          {(['dia', 'semana', 'mes'] as const).map((p) => (
            <button key={p} onClick={() => setPeriodoVista(p)} className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${periodoVista === p ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white' : 'border-[#F0E0B8] text-[#8B7355] hover:border-[#C9922A] hover:text-[#C9922A]'}`}>
              {p === 'dia' ? 'Día' : p === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">{getTituloResumen()}</p>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-8 w-full max-w-md mx-4 my-auto">
            <h2 className="font-serif text-[#5C3D2E] text-2xl mb-6">Nueva venta</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Producto del catálogo</label>
                <div className="relative">
                  <div className="flex items-center border border-[#F0E0B8] focus-within:border-[#C9922A]">
                    <Search size={14} className="ml-3 text-[#C9922A] shrink-0" />
                    <input type="text" value={busquedaProducto} onChange={(e) => { setBusquedaProducto(e.target.value); setMostrarDropdown(true); if (!e.target.value) limpiarProducto() }} onFocus={() => setMostrarDropdown(true)} placeholder="Buscar producto..." className="flex-1 px-3 py-3 text-[#5C3D2E] text-sm outline-none bg-transparent" />
                    {productoSeleccionado && <button type="button" onClick={limpiarProducto} className="mr-3 text-[#8B7355] hover:text-[#5C3D2E]"><X size={14} /></button>}
                  </div>
                  {mostrarDropdown && busquedaProducto && productosFiltrados.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-[#F0E0B8] border-t-0 z-10 max-h-48 overflow-y-auto shadow-lg">
                      {productosFiltrados.map(producto => (
                        <button key={producto.id} type="button" onClick={() => seleccionarProducto(producto)} className="w-full text-left px-4 py-3 hover:bg-[#FDF8F0] transition-colors border-b border-[#F0E0B8] last:border-0">
                          <div className="flex items-center gap-3">
                            {producto.imagen_url && <img src={producto.imagen_url} alt={producto.nombre} className="w-8 h-8 object-cover rounded" />}
                            <div>
                              <p className="text-[#5C3D2E] text-sm font-medium">{producto.nombre}</p>
                              <p className="text-[#8B7355] text-xs">{producto.categoria.nombre}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {mostrarDropdown && busquedaProducto && productosFiltrados.length === 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-[#F0E0B8] border-t-0 z-10 shadow-lg">
                      <p className="px-4 py-3 text-[#8B7355] text-sm italic">No se encontraron productos</p>
                    </div>
                  )}
                </div>
                {productoSeleccionado && (
                  <div className="flex items-center gap-2 bg-[#FDF8F0] border border-[#F0E0B8] px-3 py-2">
                    <span className="text-[#5C3D2E] text-xs">✓ {productoSeleccionado.nombre}</span>
                    <span className="text-[#8B7355] text-xs">— {productoSeleccionado.categoria.nombre}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descripción {!productoSeleccionado && <span className="text-[#8B7355] normal-case tracking-normal">(o escribe manualmente)</span>}</label>
                <input type="text" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} required placeholder="Imán Granada, Taza cerámica..." className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Precio unitario (€)</label>
                  <input type="number" value={formData.precio_original} onChange={(e) => setFormData({ ...formData, precio_original: e.target.value })} required min="0" step="0.01" placeholder="0.00" className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
                </div>
                <div className="flex flex-col gap-2 w-24">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Cantidad</label>
                  <input type="number" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })} min="1" step="1" placeholder="1" className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
                </div>
              </div>
              {cantidad > 1 && (
                <div className="bg-[#FDF8F0] border border-[#F0E0B8] px-4 py-2 flex justify-between items-center">
                  <span className="text-[#8B7355] text-xs uppercase tracking-widest">Subtotal ({cantidad} uds)</span>
                  <span className="font-serif text-[#5C3D2E] text-lg">{subtotal.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[#C9922A] text-xs uppercase tracking-widest">Descuento — opcional</label>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setTipoDescuento('euros'); setFormData({ ...formData, descuento: '0' }) }} className={`text-xs px-3 py-1 border transition-colors ${tipoDescuento === 'euros' ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white' : 'border-[#F0E0B8] text-[#8B7355]'}`}>€</button>
                    <button type="button" onClick={() => { setTipoDescuento('porcentaje'); setFormData({ ...formData, descuento: '0' }) }} className={`text-xs px-3 py-1 border transition-colors ${tipoDescuento === 'porcentaje' ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white' : 'border-[#F0E0B8] text-[#8B7355]'}`}>%</button>
                  </div>
                </div>
                <input type="number" value={formData.descuento} onChange={(e) => setFormData({ ...formData, descuento: e.target.value })} min="0" max={tipoDescuento === 'porcentaje' ? '100' : undefined} step={tipoDescuento === 'porcentaje' ? '1' : '0.01'} placeholder={tipoDescuento === 'porcentaje' ? '0%' : '0.00€'} className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
                {descuento > 0 && <p className="text-[#8B7355] text-xs">{tipoDescuento === 'porcentaje' ? `Descuento aplicado: -${descuentoEuros.toFixed(2)}€` : `Descuento aplicado: -${descuento}€`}</p>}
              </div>
              <div className="bg-[#FDF8F0] border border-[#F0E0B8] px-4 py-3 flex justify-between items-center">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest">Total final</span>
                <span className="font-serif text-[#5C3D2E] text-2xl">{totalFinal.toFixed(2)}€</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Método de pago</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setFormData({ ...formData, metodo_pago: 'Efectivo' })} className={`flex-1 py-3 text-xs uppercase tracking-widest border transition-colors ${formData.metodo_pago === 'Efectivo' ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white' : 'border-[#F0E0B8] text-[#8B7355]'}`}>💵 Efectivo</button>
                  <button type="button" onClick={() => setFormData({ ...formData, metodo_pago: 'TPV' })} className={`flex-1 py-3 text-xs uppercase tracking-widest border transition-colors ${formData.metodo_pago === 'TPV' ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white' : 'border-[#F0E0B8] text-[#8B7355]'}`}>💳 TPV</button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Notas — opcional</label>
                <input type="text" value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} placeholder="Notas adicionales..." className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]" />
              </div>
              <div className="flex gap-3 mt-2">
                <button type="submit" disabled={createMutation.isPending} className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50">
                  {createMutation.isPending ? 'Registrando...' : 'Registrar venta'}
                </button>
                <button type="button" onClick={resetFormulario} className="flex-1 border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LISTA DE VENTAS */}
      <div className="bg-white border border-[#F0E0B8] p-6">
        <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">{getTituloLista()}</h2>
        {isLoading ? (
          <p className="text-[#8B7355] text-sm">Cargando...</p>
        ) : ventasFiltradas.length === 0 ? (
          <p className="text-[#8B7355] text-sm italic">No hay ventas registradas para este periodo</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E0B8]">
                {periodoVista !== 'dia' && <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Fecha</th>}
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
                <tr key={venta.id} className="border-b border-[#F0E0B8] hover:bg-[#FDF8F0] transition-colors">
                  {periodoVista !== 'dia' && (
                    <td className="py-3 text-[#8B7355] text-sm">
                      {new Date(venta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </td>
                  )}
                  <td className="py-3 text-[#8B7355] text-sm">
                    {new Date(venta.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-[#5C3D2E] text-sm">{venta.descripcion}</td>
                  <td className="py-3 text-[#8B7355] text-sm">{venta.precio_original}€</td>
                  <td className="py-3 text-[#8B7355] text-sm">{venta.descuento > 0 ? `-${venta.descuento}€` : '—'}</td>
                  <td className="py-3 text-[#5C3D2E] font-serif text-lg">{venta.total_final}€</td>
                  <td className="py-3">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${venta.metodo_pago === 'TPV' ? 'border-[#C9922A] text-[#C9922A]' : 'border-[#5C3D2E] text-[#5C3D2E]'}`}>
                      {venta.metodo_pago}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => imprimirTicket(venta)}
                        className="text-[#C9922A] hover:text-[#5C3D2E] transition-colors"
                        title="Imprimir ticket"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(venta.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Eliminar venta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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