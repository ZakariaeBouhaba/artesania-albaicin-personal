function Footer() {
  return (
    <footer className="bg-[#5C3D2E] border-t border-[#C9922A]/30 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-12 mb-12">

        {/* LOGO Y DESCRIPCIÓN */}
        <div>
          <img src="/Logo.png" alt="Artesanía Albaicín" className="h-24 object-contain mb-4" />
          <p className="text-white/50 text-sm leading-relaxed">
            Artesanía tradicional del Albaicín. Granada, España.
          </p>
        </div>

        {/* NAVEGACIÓN */}
        <div>
          <h4 className="text-[#E8C46A] text-xs uppercase tracking-widest mb-6">Navegación</h4>
          <ul className="flex flex-col gap-3">
            <li><a href="/" className="text-white/50 text-sm hover:text-white transition-colors">Inicio</a></li>
            <li><a href="/catalogo" className="text-white/50 text-sm hover:text-white transition-colors">Catálogo</a></li>
            <li><a href="/nosotros" className="text-white/50 text-sm hover:text-white transition-colors">Nosotros</a></li>
            <li><a href="/contacto" className="text-white/50 text-sm hover:text-white transition-colors">Contacto</a></li>
          </ul>
        </div>

        {/* UBICACIÓN Y HORARIO */}
        <div>
          <h4 className="text-[#E8C46A] text-xs uppercase tracking-widest mb-6">Visítanos</h4>
          <ul className="flex flex-col gap-4">
            <li>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Dirección</p>
              <p className="text-white/70 text-sm">Calle Calderería Nueva<br />Albaicín, Granada, España</p>
            </li>
            <li>
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Horario</p>
              <p className="text-white/70 text-sm">Lunes — Domingo<br />9:30 — 00:00</p>
            </li>
          </ul>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-[#C9922A]/20 text-center">
        <p className="text-white/30 text-xs">© 2025 Artesanía Albaicín · Todos los derechos reservados · Granada, España</p>
      </div>
    </footer>
  )
}

export default Footer