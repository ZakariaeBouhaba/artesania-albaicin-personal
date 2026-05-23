import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getEstadisticas } from '../services/estadisticas'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Package, Tags, ShoppingBag,
  MessageSquare, Users, LogOut
} from 'lucide-react'

function Sidebar() {
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()
  const mensajesAnteriores = useRef<number | null>(null)

  const { data: stats } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas,
    refetchInterval: 30000
  })

  const mensajesSinLeer = stats?.num_mensajes_sin_leer || 0

  // Toast cuando llegan mensajes nuevos
  useEffect(() => {
    if (mensajesAnteriores.current === null) {
      mensajesAnteriores.current = mensajesSinLeer
      return
    }
    if (mensajesSinLeer > mensajesAnteriores.current) {
      const nuevos = mensajesSinLeer - mensajesAnteriores.current
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-center gap-3 bg-white border border-[#F0E0B8] shadow-lg px-5 py-4 max-w-sm`}>
          <div className="w-8 h-8 bg-[#C9922A] rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[#5C3D2E] text-sm font-medium">
              {nuevos === 1 ? 'Nuevo mensaje recibido' : `${nuevos} nuevos mensajes`}
            </p>
            <p className="text-[#8B7355] text-xs">Tienes {mensajesSinLeer} mensajes sin leer</p>
          </div>
        </div>
      ), { duration: 5000 })
    }
    mensajesAnteriores.current = mensajesSinLeer
  }, [mensajesSinLeer])

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', badge: 0 },
    { path: '/productos', icon: Package, label: 'Productos', badge: 0 },
    { path: '/categorias', icon: Tags, label: 'Categorías', badge: 0 },
    { path: '/ventas', icon: ShoppingBag, label: 'Ventas', badge: 0 },
    { path: '/mensajes', icon: MessageSquare, label: 'Mensajes', badge: mensajesSinLeer },
  ]

  return (
    <aside className="w-64 bg-[#5C3D2E] min-h-screen flex flex-col fixed left-0 top-0">

      {/* LOGO */}
      <div className="p-6 border-b border-[#C9922A]/30">
        <img src="/gran.png" alt="Artesanía Albaicín" className="h-16 object-contain mx-auto" />
        <p className="text-[#E8C46A] text-xs uppercase tracking-widest text-center mt-2">Panel de gestión</p>
      </div>

      {/* MENÚ */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#C9922A] text-white'
                      : 'text-white/70 hover:bg-[#C9922A]/20 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Icon size={18} />
                    {item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}

          {/* USUARIOS — solo admin */}
          {usuario?.rol === 'admin' && (
            <li>
              <Link
                to="/usuarios"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === '/usuarios'
                    ? 'bg-[#C9922A] text-white'
                    : 'text-white/70 hover:bg-[#C9922A]/20 hover:text-white'
                }`}
              >
                <Users size={18} />
                <span className="text-sm font-medium">Usuarios</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* USUARIO Y LOGOUT */}
      <div className="p-4 border-t border-[#C9922A]/30">
        <div className="px-4 py-3 mb-2">
          <p className="text-white text-sm font-medium">{usuario?.nombre}</p>
          <p className="text-white/50 text-xs uppercase tracking-widest">{usuario?.rol}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all w-full"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar