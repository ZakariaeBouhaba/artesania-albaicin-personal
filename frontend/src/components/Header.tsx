import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-[#5C3D2E] border-b border-[#C9922A] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2 grid grid-cols-3 items-center">
        
        <nav className="flex gap-8">
          <Link to="/" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Inicio
          </Link>
          <Link to="/catalogo" className="text-[#F0E0B8] text-xs uppercase tracking-widest hover:text-[#E8C46A] transition-colors">
            Catálogo
          </Link>
        </nav>

        <Link to="/" className="flex justify-center">
          <img src="/GRANADA.png" alt="Artesanía Albaicín" className="h-16 object-contain" />
        </Link>

        <nav className="flex gap-8 justify-end">
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