import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/auth'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { loginContext } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const data = await login(email, contrasena)
      const usuario = JSON.parse(atob(data.access_token.split('.')[1]))
      loginContext(data.access_token, {
        id: usuario.id,
        nombre: usuario.sub.split('@')[0],
        email: usuario.sub,
        rol: usuario.rol
      })
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-10">
          <img src="/Logo.png" alt="Artesanía Albaicín" className="h-32 object-contain mx-auto mb-4" />
          <p className="text-[#C9922A] text-xs uppercase tracking-widest">Panel de gestión</p>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white border border-[#F0E0B8] p-8">
          <h1 className="font-serif text-[#5C3D2E] text-3xl mb-8 text-center">Iniciar sesión</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[#C9922A] text-xs uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#C9922A] text-xs uppercase tracking-widest">Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="••••••••"
                className="border border-[#F0E0B8] px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default LoginPage