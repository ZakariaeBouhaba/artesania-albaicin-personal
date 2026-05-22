import { createContext, useContext, useState, type ReactNode } from 'react'
import { traducciones, type Idioma } from '../translations'

interface LanguageContextType {
  idioma: Idioma
  setIdioma: (idioma: Idioma) => void
  t: typeof traducciones.es
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('es')
  const t = traducciones[idioma]
  return (
    <LanguageContext.Provider value={{ idioma, setIdioma, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}