import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  MessageSquare,
  Users,
  LogOut
} from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/productos', icon: Package, label: 'Productos' },
  { path: '/categorias', icon: Tags, label: 'Categorías' },
  { path: '/ventas', icon: ShoppingBag, label: 'Ventas' },
  { path: '/mensajes', icon: MessageSquare, label: 'Mensajes' },
]

function Sidebar() {
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()

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
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
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