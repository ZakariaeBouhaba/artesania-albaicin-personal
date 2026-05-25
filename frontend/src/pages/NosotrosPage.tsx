import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

function NosotrosPage() {
  const { t } = useLanguage()

  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 80 })
  }, [])

  return (
    <main className="bg-[#FDF8F0] min-h-screen">

      {/* CABECERA */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/anadluz.png" alt="Granada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#5C3D2E]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">{t.nosotros.tag}</p>
          <h1 className="font-serif text-white text-4xl md:text-7xl leading-none whitespace-pre-line">{t.nosotros.title}</h1>
        </div>
      </section>

      {/* HISTORIA PRINCIPAL */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div data-aos="fade-right">
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">{t.nosotros.origins_tag}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#5C3D2E] mb-6 whitespace-pre-line">{t.nosotros.origins_title}</h2>
          <p className="text-[#8B7355] text-base md:text-lg leading-relaxed mb-6">{t.nosotros.origins_p1}</p>
          <p className="text-[#8B7355] text-base md:text-lg leading-relaxed mb-6">{t.nosotros.origins_p2}</p>
          <p className="text-[#8B7355] text-base md:text-lg leading-relaxed">{t.nosotros.origins_p3}</p>
        </div>
        <div data-aos="fade-left" className="relative mt-8 md:mt-0">
          <img src="/hero-alhambra.jpg" alt="Albaicín Granada" className="w-full h-64 md:h-[500px] object-cover" />
          <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-[#C9922A] text-white p-4 md:p-6">
            <p className="font-serif text-2xl md:text-3xl font-bold">45+</p>
            <p className="text-xs uppercase tracking-widest">{t.nosotros.stats_years}</p>
          </div>
        </div>
      </section>

      {/* FRANJA DE VALORES */}
      <section className="bg-[#5C3D2E] py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div data-aos="fade-up" className="text-center py-6 md:py-0 border-b md:border-b-0 border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">200+</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">{t.nosotros.stats_products}</p>
            <p className="text-white/50 text-sm">{t.nosotros.stats_products_desc}</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100" className="text-center py-6 md:py-0 border-b md:border-b-0 md:border-x border-[#C9922A]/30">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">45+</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">{t.nosotros.stats_years}</p>
            <p className="text-white/50 text-sm">{t.nosotros.stats_years_desc}</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200" className="text-center py-6 md:py-0">
            <p className="font-serif text-[#E8C46A] text-5xl mb-4">100%</p>
            <p className="text-white text-sm uppercase tracking-widest mb-2">{t.nosotros.stats_handmade}</p>
            <p className="text-white/50 text-sm">{t.nosotros.stats_handmade_desc}</p>
          </div>
        </div>
      </section>

      {/* NUESTRA MISIÓN */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div data-aos="fade-right" className="relative order-2 md:order-1">
          <img src="/iluminacion.jpg" alt="Artesanía" className="w-full h-64 md:h-[400px] object-cover" />
        </div>
        <div data-aos="fade-left" className="order-1 md:order-2">
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">{t.nosotros.mission_tag}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#5C3D2E] mb-6 whitespace-pre-line">{t.nosotros.mission_title}</h2>
          <p className="text-[#8B7355] text-base md:text-lg leading-relaxed mb-6">{t.nosotros.mission_p1}</p>
          <p className="text-[#8B7355] text-base md:text-lg leading-relaxed mb-8">{t.nosotros.mission_p2}</p>
          <Link to="/catalogo" className="inline-block bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-8 md:px-10 py-4 hover:bg-[#C9922A] transition-colors">
            {t.nosotros.mission_btn}
          </Link>
        </div>
      </section>

      {/* FRASE FINAL */}
      <section className="bg-[#5C3D2E] py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9922A] text-xs uppercase tracking-[6px] mb-8">✦</p>
          <h2 data-aos="fade-up" className="font-serif text-white text-2xl md:text-5xl leading-tight italic whitespace-pre-line">
            {t.nosotros.quote}
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9922A] to-transparent mt-12 mb-12" />
          <Link to="/contacto" className="inline-block border border-[#E8C46A] text-[#E8C46A] text-xs uppercase tracking-widest px-8 md:px-10 py-4 hover:bg-[#E8C46A] hover:text-[#5C3D2E] transition-colors">
            {t.nosotros.quote_btn}
          </Link>
        </div>
      </section>

    </main>
  )
}

export default NosotrosPage