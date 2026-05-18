import { Link } from 'react-router-dom'

function NosotrosPage() {
  return (
    <main className="bg-[#FDF8F0] min-h-screen">

      {/* CABECERA */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/anadluz.png" alt="Granada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#5C3D2E]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">✦ Quiénes somos</p>
          <h1 className="font-serif text-white text-5xl md:text-7xl leading-none">Nuestra<br />Historia</h1>
        </div>
      </section>

      {/* HISTORIA PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">— Nuestros orígenes</p>
          <h2 className="font-serif text-4xl text-[#5C3D2E] mb-6">Arte que nace<br />del alma</h2>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-6">
            Somos una tienda familiar ubicada en el corazón del Albaicín, el barrio más auténtico y pintoresco de Granada. Nuestra historia comenzó hace más de 45 años con una pasión por preservar y compartir las técnicas artesanales que florecieron bajo el esplendor nazarí.
          </p>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-6">
            Cada producto que encontrarás en nuestra tienda ha sido seleccionado con cuidado, elaborado a mano por artesanos de Granada, Marruecos y Turquía, usando materiales naturales y métodos transmitidos de generación en generación.
          </p>
          <p className="text-[#8B7355] text-lg leading-relaxed">
            Nuestro objetivo es simple: llevar la magia del arte árabe y andaluz a cada persona que nos visita, ya sea un turista que descubre Granada por primera vez o un cliente fiel que vuelve cada temporada.
          </p>
        </div>
        <div className="relative">
          <img src="/hero-alhambra.jpg" alt="Albaicín Granada" className="w-full h-[500px] object-cover" />
          <div className="absolute -bottom-6 -left-6 bg-[#C9922A] text-white p-6">
            <p className="font-serif text-3xl font-bold">45+</p>
            <p className="text-xs uppercase tracking-widest">Años de tradición</p>
          </div>
        </div>
      </section>

      {/* FRANJA DE VALORES */}
      <section className="bg-[#5C3D2E] py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-12">
          <div className="text-center">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">200+</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">Productos únicos</p>
            <p className="text-white/50 text-sm">Cada pieza seleccionada con cuidado y elaborada a mano</p>
          </div>
          <div className="text-center border-x border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">45+</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">Años de tradición</p>
            <p className="text-white/50 text-sm">Preservando el arte nazarí desde el corazón del Albaicín</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">100%</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">Hecho a mano</p>
            <p className="text-white/50 text-sm">Artesanos de Granada, Marruecos y Turquía</p>
          </div>
        </div>
      </section>

      {/* NUESTRA MISIÓN */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src="/iluminacion.jpg" alt="Artesanía" className="w-full h-[400px] object-cover" />
        </div>
        <div>
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">— Nuestra misión</p>
          <h2 className="font-serif text-4xl text-[#5C3D2E] mb-6">Preservar la tradición<br />artesanal</h2>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-6">
            En Artesanía Albaicín creemos que cada pieza artesanal cuenta una historia. Una historia de manos expertas, de técnicas ancestrales, de colores que evocan los mosaicos de la Alhambra y los zocos de Marrakech.
          </p>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-8">
            Trabajamos directamente con artesanos locales y del norte de África para garantizar que cada producto sea auténtico, de calidad y elaborado con respeto por las tradiciones.
          </p>
          <Link
            to="/catalogo"
            className="inline-block bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#C9922A] transition-colors"
          >
            Ver nuestro catálogo
          </Link>
        </div>
      </section>

      {/* FRASE FINAL */}
      <section className="bg-[#5C3D2E] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9922A] text-xs uppercase tracking-[6px] mb-8">✦ Nuestra esencia</p>
          <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight italic">
            "Cada pieza cuenta una historia.<br />La nuestra lleva 45 años escribiéndose<br />en el corazón del Albaicín"
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9922A] to-transparent mt-12 mb-12" />
          <Link
            to="/contacto"
            className="inline-block border border-[#E8C46A] text-[#E8C46A] text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#E8C46A] hover:text-[#5C3D2E] transition-colors"
          >
            Visítanos en Granada
          </Link>
        </div>
      </section>

    </main>
  )
}

export default NosotrosPage