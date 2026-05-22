import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import type { Idioma } from '../translations'

const idiomas: { code: Idioma; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

function Header() {
  const { t, idioma, setIdioma } = useLanguage()

  return (
    <header className="bg-[#5C3D2E] border-b border-[#C9922A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2 grid grid-cols-3 items-center">

        {/* NAV IZQUIERDA */}
        <nav className="flex gap-8">
          <Link to="/" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            {t.nav.inicio}
          </Link>
          <Link to="/catalogo" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            {t.nav.catalogo}
          </Link>
        </nav>

        {/* LOGO CENTRO */}
        <Link to="/" className="flex justify-center">
          <img src="/gran.png" alt="Artesanía Albaicín" className="h-24 object-contain" />
        </Link>

        {/* NAV DERECHA + SELECTOR IDIOMA */}
        <nav className="flex gap-6 justify-end items-center">
          <Link to="/nosotros" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            {t.nav.nosotros}
          </Link>
          <Link to="/contacto" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            {t.nav.contacto}
          </Link>

          {/* SELECTOR IDIOMA */}
          <div className="flex items-center border border-[#C9922A]/40 divide-x divide-[#C9922A]/40">
            {idiomas.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setIdioma(code)}
                className={`px-2 py-1 text-xs tracking-widest transition-colors ${
                  idioma === code
                    ? 'bg-[#C9922A] text-white'
                    : 'text-[#F0E0B8] hover:text-[#E8C46A]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

      </div>
    </header>
  )
}

export default Header