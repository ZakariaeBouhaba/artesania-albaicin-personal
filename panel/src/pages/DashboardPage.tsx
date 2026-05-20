import { useQuery } from '@tanstack/react-query'
import { getEstadisticas } from '../services/estadisticas'
import { getVentas } from '../services/ventas'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas,
    refetchInterval: 30000
  })

  const { data: ventas = [] } = useQuery({
    queryKey: ['ventas-hoy'],
    queryFn: () => getVentas(),
    refetchInterval: 30000
  })

  const ventasHoy = ventas.filter(v => {
    const hoy = new Date().toDateString()
    return new Date(v.fecha).toDateString() === hoy
  })

  const pieData = [
    { name: 'TPV', value: stats?.total_tpv || 0 },
    { name: 'Efectivo', value: stats?.total_efectivo || 0 }
  ]

  const COLORS = ['#C9922A', '#5C3D2E']

  return (
    <div>
      <h1 className="font-serif text-[#5C3D2E] text-4xl mb-8">Dashboard</h1>

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">Hoy</p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{stats?.total_hoy || 0}€</p>
          <p className="text-[#8B7355] text-xs mt-1">{stats?.num_ventas_hoy || 0} ventas</p>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">Esta semana</p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{stats?.total_semana || 0}€</p>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">Este mes</p>
          <p className="font-serif text-[#5C3D2E] text-4xl">{stats?.total_mes || 0}€</p>
        </div>
        <div className="bg-white border border-[#F0E0B8] p-6">
          <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-2">Alertas</p>
          <p className="text-[#8B7355] text-sm mt-1">✉️ {stats?.num_mensajes_sin_leer || 0} mensajes sin leer</p>
          <p className="text-[#8B7355] text-sm mt-1">❌ {stats?.num_productos_agotados || 0} productos agotados</p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#F0E0B8] p-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">TPV vs Efectivo</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}€`}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#F0E0B8] p-6">
          <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">Ventas de hoy</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ventasHoy.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E0B8" />
              <XAxis dataKey="descripcion" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="total_final" fill="#C9922A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ÚLTIMAS VENTAS */}
      <div className="bg-white border border-[#F0E0B8] p-6">
        <h2 className="font-serif text-[#5C3D2E] text-xl mb-6">Últimas ventas de hoy</h2>
        {ventasHoy.length === 0 ? (
          <p className="text-[#8B7355] text-sm italic">No hay ventas registradas hoy</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0E0B8]">
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Hora</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Descripción</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Total</th>
                <th className="text-left text-[#C9922A] text-xs uppercase tracking-widest pb-3">Pago</th>
              </tr>
            </thead>
            <tbody>
              {ventasHoy.map((venta) => (
                <tr key={venta.id} className="border-b border-[#F0E0B8]">
                  <td className="py-3 text-[#8B7355] text-sm">
                    {new Date(venta.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-[#5C3D2E] text-sm">{venta.descripcion}</td>
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