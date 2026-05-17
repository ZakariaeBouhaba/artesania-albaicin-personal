function HomePage() {
  return (
    <main>
      <section className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-[#1C1008]">
          <img
            src="/hero-alhambra.jpg"
            alt="Alhambra Granada"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1008] via-transparent to-transparent" />
        
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
          <a href="/catalogo" className="inline-block bg-[#C9922A] text-[#1C1008] text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-[#E8C46A] transition-colors">
            Explorar Catálogo
          </a>
        </div>
      </section>
    </main>
  )
}

export default HomePage