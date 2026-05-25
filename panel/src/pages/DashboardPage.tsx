import { useQuery } from '@tanstack/react-query'
import { getEstadisticas } from '../services/estadisticas'
import { getVentas } from '../services/ventas'
import { useAuth } from '../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import { TrendingUp, TrendingDown, ShoppingBag, MessageSquare, AlertTriangle, CreditCard, Banknote, Calendar } from 'lucide-react'

function DashboardPage() {
  const { usuario } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas,
    refetchInterval: 30000
  })

  const { data: ventas = [] } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => getVentas(),
    refetchInterval: 30000
  })

  const hoy = new Date()
  const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === hoy.toDateString())
  const ventasAyer = ventas.filter(v => {
    const ayer = new Date(hoy)
    ayer.setDate(hoy.getDate() - 1)
    return new Date(v.fecha).toDateString() === ayer.toDateString()
  })

  const totalAyer = ventasAyer.reduce((sum, v) => sum + v.total_final, 0)
  const totalHoy = stats?.total_hoy || 0
  const diferenciaDia = totalAyer > 0 ? ((totalHoy - totalAyer) / totalAyer * 100) : 0
  const tendenciaPositiva = diferenciaDia >= 0

  // Ventas por hora hoy
  const ventasPorHora = Array.from({ length: 24 }, (_, hora) => {
    const ventasHora = ventasHoy.filter(v => new Date(v.fecha).getHours() === hora)
    return {
      hora: `${hora}h`,
      total: ventasHora.reduce((sum, v) => sum + v.total_final, 0),
      cantidad: ventasHora.length
    }
  }).filter(h => h.total > 0 || (hoy.getHours() >= parseInt(h.hora) && hoy.getHours() <= parseInt(h.hora) + 2))

  // Ventas últimos 7 días
  const ventasUltimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() - (6 - i))
    const ventasDia = ventas.filter(v => new Date(v.fecha).toDateString() === fecha.toDateString())
    return {
      dia: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      total: ventasDia.reduce((sum, v) => sum + v.total_final, 0),
      ventas: ventasDia.length,
      tpv: ventasDia.filter(v => v.metodo_pago === 'TPV').reduce((sum, v) => sum + v.total_final, 0),
      efectivo: ventasDia.filter(v => v.metodo_pago === 'Efectivo').reduce((sum, v) => sum + v.total_final, 0),
    }
  })

  // Datos para gráfico de tarta
  const pieData = [
    { name: 'TPV', value: stats?.total_tpv || 0 },
    { name: 'Efectivo', value: stats?.total_efectivo || 0 }
  ].filter(d => d.value > 0)

  const COLORS = ['#C9922A', '#5C3D2E']

  // Hora actual formateada
  const horaActual = hoy.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  const fechaActual = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#F0E0B8] px-3 py-2 shadow-lg">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-[#5C3D2E] text-sm font-serif">{entry.name}: {entry.value}€</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">

      {/* CABECERA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[#5C3D2E] text-4xl mb-1">
            Bienvenido, {usuario?.nombre?.split('@')[0] || 'Admin'}
          </h1>
          <p className="text-[#8B7355] text-sm capitalize flex items-center gap-2">
            <Calendar size={14} className="text-[#C9922A]" />
            {fechaActual} · {horaActual}
          </p>
        </div>
        {(stats?.num_mensajes_sin_leer || 0) > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2">
            <MessageSquare size={16} className="text-amber-600" />
            <span className="text-amber-700 text-sm">{stats?.num_mensajes_sin_leer} mensajes sin leer</span>
          </div>
        )}
      </div>

      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-4 gap-4">

        {/* Hoy */}
        <div className="bg-[#5C3D2E] p-6 col-span-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#E8C46A] text-xs uppercase tracking-widest">Hoy</p>
            <ShoppingBag size={16} className="text-[#E8C46A]/60" />
          </div>
          <p className="font-serif text-white text-4xl mb-1">{totalHoy.toFixed(2)}€</p>
          <p className="text-white/50 text-xs">{stats?.num_ventas_hoy || 0} ventas registradas</p>
          {totalAyer > 0 && (
            <div className={`flex items-center gap-1 mt-3 text-xs ${tendenciaPositiva ? 'text-green-400' : 'text-red-400'}`}>
              {tendenciaPositiva ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(diferenciaDia).toFixed(1)}% vs ayer ({totalAyer.toFixed(2)}€)
            </div>
          )}
        </div>

        {/* Semana */}
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-3">Esta semana</p>
          <p className="font-serif text-[#5C3D2E] text-4xl mb-1">{(stats?.total_semana || 0).toFixed(2)}€</p>
          <p className="text-[#8B7355] text-xs">Últimos 7 días</p>
        </div>

        {/* Mes */}
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-3">Este mes</p>
          <p className="font-serif text-[#5C3D2E] text-4xl mb-1">{(stats?.total_mes || 0).toFixed(2)}€</p>
          <p className="text-[#8B7355] text-xs">{hoy.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Alertas */}
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-3">Alertas</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-[#C9922A]" />
              <span className="text-[#5C3D2E] text-sm">{stats?.num_mensajes_sin_leer || 0} mensajes sin leer</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className={stats?.num_productos_agotados ? 'text-red-500' : 'text-[#8B7355]'} />
              <span className={`text-sm ${stats?.num_productos_agotados ? 'text-red-500' : 'text-[#8B7355]'}`}>
                {stats?.num_productos_agotados || 0} productos agotados
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MÉTODOS DE PAGO HOY */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#F0E0B8] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8F0] border border-[#F0E0B8] flex items-center justify-center">
            <CreditCard size={20} className="text-[#C9922A]" />
          </div>
          <div>
            <p className="text-[#C9922A] text-xs uppercase tracking-widest">TPV hoy</p>
            <p className="font-serif text-[#5C3D2E] text-2xl">
              {ventasHoy.filter(v => v.metodo_pago === 'TPV').reduce((s, v) => s + v.total_final, 0).toFixed(2)}€
            </p>
          </div>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF8F0] border border-[#F0E0B8] flex items-center justify-center">
            <Banknote size={20} className="text-[#5C3D2E]" />
          </div>
          <div>
            <p className="text-[#C9922A] text-xs uppercase tracking-widest">Efectivo hoy</p>
            <p className="font-serif text-[#5C3D2E] text-2xl">
              {ventasHoy.filter(v => v.metodo_pago === 'Efectivo').reduce((s, v) => s + v.total_final, 0).toFixed(2)}€
            </p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-3 gap-6">

        {/* Ventas últimos 7 días */}
        <div className="col-span-2 bg-white border border-[#F0E0B8] p-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">Ventas últimos 7 días</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ventasUltimos7Dias}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9922A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C9922A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E0B8" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#8B7355' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B7355' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Total" stroke="#C9922A" strokeWidth={2} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* TPV vs Efectivo */}
        <div className="bg-white border border-[#F0E0B8] p-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">Método de pago</h2>
          {pieData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center">
              <p className="text-[#8B7355] text-sm italic">Sin datos</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={75} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}€`} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-[#8B7355] text-xs">{entry.name}: {entry.value.toFixed(2)}€</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* VENTAS POR HORA HOY */}
      {ventasPorHora.length > 0 && (
        <div className="bg-white border border-[#F0E0B8] p-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">Ventas por hora — hoy</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ventasPorHora}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E0B8" />
              <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#8B7355' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B7355' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" name="Total" fill="#C9922A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ÚLTIMAS VENTAS */}
      <div className="bg-white border border-[#F0E0B8] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl">Últimas ventas de hoy</h2>
          <span className="text-[#8B7355] text-xs">{ventasHoy.length} ventas · {totalHoy.toFixed(2)}€ total</span>
        </div>
        {ventasHoy.length === 0 ? (
          <p className="text-[#8B7355] text-sm italic">No hay ventas registradas hoy</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E0B8]">
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Hora</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Descripción</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Descuento</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Total</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Pago</th>
              </tr>
            </thead>
            <tbody>
              {[...ventasHoy].reverse().map((venta) => (
                <tr key={venta.id} className="border-b border-[#F0E0B8] hover:bg-[#FDF8F0] transition-colors">
                  <td className="py-3 text-[#8B7355] text-sm">
                    {new Date(venta.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-[#5C3D2E] text-sm">{venta.descripcion}</td>
                  <td className="py-3 text-[#8B7355] text-sm">{venta.descuento > 0 ? `-${venta.descuento}€` : '—'}</td>
                  <td className="py-3 text-[#5C3D2E] font-serif text-lg">{venta.total_final}€</td>
                  <td className="py-3">
                    <span className={`text-xs uppercase tracking-widest px-2 py-1 border ${
                      venta.metodo_pago === 'TPV' ? 'border-[#C9922A] text-[#C9922A]' : 'border-[#5C3D2E] text-[#5C3D2E]'
                    }`}>
                      {venta.metodo_pago}
                    </span>
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

export default DashboardPage