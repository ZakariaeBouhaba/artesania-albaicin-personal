import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Usuario } from '../types'

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  isAuthenticated: boolean
  loginContext: (token: string, usuario: Usuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUsuario = localStorage.getItem('usuario')
    if (savedToken && savedUsuario) {
      setToken(savedToken)
      setUsuario(JSON.parse(savedUsuario))
    }
  }, [])

  const loginContext = (token: string, usuario: Usuario) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    setToken(token)
    setUsuario(usuario)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      isAuthenticated: !!token,
      loginContext,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}