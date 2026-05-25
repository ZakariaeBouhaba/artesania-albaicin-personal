import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import type { Idioma } from '../translations'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const idiomas: { code: Idioma; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

function Header() {
  const { t, idioma, setIdioma } = useLanguage()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="bg-[#5C3D2E] border-b border-[#C9922A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2">

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-3 items-center">
          <nav className="flex gap-8">
            <Link to="/" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
              {t.nav.inicio}
            </Link>
            <Link to="/catalogo" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
              {t.nav.catalogo}
            </Link>
          </nav>

          <Link to="/" className="flex justify-center">
            <img src="/gran.png" alt="Artesanía Albaicín" className="h-24 object-contain" />
          </Link>

          <nav className="flex gap-6 justify-end items-center">
            <Link to="/nosotros" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
              {t.nav.nosotros}
            </Link>
            <Link to="/contacto" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
              {t.nav.contacto}
            </Link>
            <div className="flex items-center border border-[#C9922A]/40 divide-x divide-[#C9922A]/40">
              {idiomas.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setIdioma(code)}
                  className={`px-2 py-1 text-xs tracking-widest transition-colors ${
                    idioma === code ? 'bg-[#C9922A] text-white' : 'text-[#F0E0B8] hover:text-[#E8C46A]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* MÓVIL */}
        <div className="flex md:hidden items-center justify-between py-2">
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-[#F0E0B8]">
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex justify-center">
            <img src="/gran.png" alt="Artesanía Albaicín" className="h-16 object-contain" />
          </Link>

          <div className="flex items-center border border-[#C9922A]/40 divide-x divide-[#C9922A]/40">
            {idiomas.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setIdioma(code)}
                className={`px-2 py-1 text-xs tracking-widest transition-colors ${
                  idioma === code ? 'bg-[#C9922A] text-white' : 'text-[#F0E0B8]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {menuAbierto && (
          <div className="md:hidden border-t border-[#C9922A]/30 py-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setMenuAbierto(false)} className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors px-2">
              {t.nav.inicio}
            </Link>
            <Link to="/catalogo" onClick={() => setMenuAbierto(false)} className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors px-2">
              {t.nav.catalogo}
            </Link>
            <Link to="/nosotros" onClick={() => setMenuAbierto(false)} className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors px-2">
              {t.nav.nosotros}
            </Link>
            <Link to="/contacto" onClick={() => setMenuAbierto(false)} className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors px-2">
              {t.nav.contacto}
            </Link>
          </div>
        )}

      </div>
    </header>
  )
}

export default Header