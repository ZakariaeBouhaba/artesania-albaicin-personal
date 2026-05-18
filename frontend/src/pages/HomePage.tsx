function HomePage() {
  return (
    <main className="bg-[#FDF8F0]">
      {/* HERO */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#5C3D2E]">
          <img
            src="/hero-alhambra.jpg"
            alt="Alhambra Granada"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#5C3D2E] via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">
            Artesanía de Granada · Albaicín
          </p>
          <h1 className="font-serif text-white text-6xl md:text-8xl leading-none mb-6">
            Artesanía<br />
            <span className="text-[#E8C46A] italic">Albaicín</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mb-8">
            Piezas únicas que guardan el alma de la Alhambra y la magia del arte nazarí
          </p>
          <a href="/catalogo" className="inline-block bg-[#C9922A] text-white text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-[#E8C46A] transition-colors">
            Explorar Catálogo
          </a>
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <section className="bg-[#5C3D2E] border-t border-[#C9922A] border-b">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-4 gap-4">
          <div className="text-center border-r border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-4xl mb-1">45+</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Años de tradición</p>
          </div>
          <div className="text-center border-r border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-4xl mb-1">200+</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Productos únicos</p>
          </div>
          <div className="text-center border-r border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-4xl mb-1">100%</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Hecho a mano</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-[#E8C46A] text-4xl mb-1">★★★★★</p>
            <p className="text-white/60 text-xs uppercase tracking-widest">Granada, Albaicín</p>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-6xl mx-auto px-6 pt-8 pb-16">
        <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">— El Bazar</p>
        <h2 className="font-serif text-4xl text-[#5C3D2E] mb-8">Categorías<br />de la tienda</h2>
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px]">
          <div className="row-span-2 relative overflow-hidden cursor-pointer group">
            <img src="/ceramica.png" alt="Cerámica" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-[#E8C46A] text-xs uppercase tracking-widest mb-1">✦ Artesanía</p>
              <h3 className="font-serif text-white text-2xl">Cerámica</h3>
            </div>
          </div>
          <div className="relative overflow-hidden cursor-pointer group">
            <img src="/joyeria.jpg" alt="Joyería" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">Joyería</h3>
            </div>
          </div>
          <div className="relative overflow-hidden cursor-pointer group">
            <img src="/bolsos.png" alt="Bolsos y Cuero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">Bolsos y Cuero</h3>
            </div>
          </div>
          <div className="relative overflow-hidden cursor-pointer group">
            <img src="/iluminacion.jpg" alt="Iluminación" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">Iluminación</h3>
            </div>
          </div>
          <div className="relative overflow-hidden cursor-pointer group">
            <img src="/te.jpg" alt="Mundo del Té" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">Mundo del Té</h3>
            </div>
          </div>
          <div className="col-span-3 relative overflow-hidden cursor-pointer group">
            <img src="/perfumes.png" alt="Perfumes" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <h3 className="font-serif text-white text-2xl">Perfumes</h3>
              <p className="text-white/70 text-sm">Incienso, aceites y perfumes árabes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FRASE IMPACTANTE */}
      <section className="bg-[#5C3D2E] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9922A] text-xs uppercase tracking-[6px] mb-8">✦ Nuestra esencia</p>
          <h2 className="font-serif text-white text-4xl md:text-5xl leading-tight italic">
            "Cada pieza cuenta una historia.<br />La nuestra lleva 45 años escribiéndose<br />en el corazón del Albaicín"
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9922A] to-transparent mt-12" />
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section className="bg-[#FDF8F0] max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">— Sobre nosotros</p>
          <h2 className="font-serif text-4xl text-[#5C3D2E] mb-6">Arte que nace<br />del alma</h2>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-6">
            Somos una tienda familiar ubicada en el corazón del Albaicín, el barrio más auténtico de Granada. Llevamos más de 45 años preservando y compartiendo las técnicas artesanales que florecieron bajo el esplendor nazarí.
          </p>
          <p className="text-[#8B7355] text-lg leading-relaxed mb-8">
            Cada producto que encontrarás en nuestra tienda ha sido seleccionado con cuidado, elaborado a mano por artesanos de Granada, Marruecos y Turquía, usando materiales naturales y métodos transmitidos de generación en generación.
          </p>
          <a href="/nosotros" className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9922A] hover:text-white transition-colors">
            Conoce nuestra historia
          </a>
        </div>
        <div className="relative">
          <img src="/hero-alhambra.jpg" alt="Albaicín Granada" className="w-full h-[500px] object-cover" />
          <div className="absolute -bottom-6 -left-6 bg-[#C9922A] text-white p-6">
            <p className="font-serif text-3xl font-bold">45+</p>
            <p className="text-xs uppercase tracking-widest">Años de tradición</p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default HomePage