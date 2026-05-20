import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { crearUsuario } from '../services/auth'
import { useAuth } from '../context/AuthContext'
import { UserPlus } from 'lucide-react'

function UsuariosPage() {
  const { usuario } = useAuth()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'encargado'
  })
  const [exito, setExito] = useState('')
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      setExito('Usuario creado correctamente')
      setFormData({ nombre: '', email: '', contrasena: '', rol: 'encargado' })
      setMostrarFormulario(false)
      setTimeout(() => setExito(''), 3000)
    },
    onError: () => {
      setError('Error al crear el usuario. El email puede que ya exista.')
      setTimeout(() => setError(''), 3000)
    }
  })

  if (usuario?.rol !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="font-serif text-[#5C3D2E] text-2xl">No tienes permisos para ver esta página</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(formData)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-[#5C3D2E] text-4xl">Usuarios</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#C9922A] transition-colors"
        >
          <UserPlus size={16} />
          Nuevo usuario
        </button>
      </div>

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 mb-6">
          {exito}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* FORMULARIO */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-full max-w-md">
            <h2 className="font-serif text-[#5C3D2E] text-2xl mb-6">Nuevo usuario</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Nombre completo"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="email@artesaniaalbaicin.es"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Contraseña</label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A]"
                >
                  <option value="encargado">Encargado</option>
                  <option value="empleado">Empleado</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creando...' : 'Crear usuario'}
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

      {/* INFO */}
      <div className="bg-white border border-[#F0E0B8] p-6">
        <h2 className="font-serif text-[#5C3D2E] text-xl mb-4">Roles del sistema</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 p-4 border border-[#F0E0B8]">
            <span className="text-[#C9922A] text-xs uppercase tracking-widest w-24">Admin</span>
            <span className="text-[#8B7355] text-sm">Acceso completo — gestionar productos, categorías, ventas, mensajes y usuarios</span>
          </div>
          <div className="flex gap-4 p-4 border border-[#F0E0B8]">
            <span className="text-[#C9922A] text-xs uppercase tracking-widest w-24">Encargado</span>
            <span className="text-[#8B7355] text-sm">Acceso completo excepto gestionar usuarios</span>
          </div>
          <div className="flex gap-4 p-4 border border-[#F0E0B8]">
            <span className="text-[#C9922A] text-xs uppercase tracking-widest w-24">Empleado</span>
            <span className="text-[#8B7355] text-sm">Solo puede registrar ventas y cambiar estado de productos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsuariosPage