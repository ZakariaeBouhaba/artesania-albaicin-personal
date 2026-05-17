import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-[#1C1008] border-b border-[#C9922A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="font-serif text-[#E8C46A] text-lg tracking-widest">
          ✦ Artesanía Albaicín
        </div>

        <nav className="flex gap-8">
          <Link to="/" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Inicio
          </Link>
          <Link to="/catalogo" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Catálogo
          </Link>
          <Link to="/nosotros" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Nosotros
          </Link>
          <Link to="/contacto" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Contacto
          </Link>
        </nav>

      </div>
    </header>
  )
}

export default Header