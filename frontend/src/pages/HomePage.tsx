import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { getProductos } from '../services/productos'
import SEO from '../components/SEO'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { MapPin, Clock, HandMetal, Award, Users } from 'lucide-react'

function HomePage() {
  const { t } = useLanguage()

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: 'ease-out'
    })
  }, [])

  const { data: productos = [] } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos
  })

  const productosDestacados = productos
    .filter(p => p.estado === 'disponible' && p.imagen_url)
    .slice(0, 3)

  return (
    <>
      <SEO
        titulo="Artesanía Albaicín · Tienda Artesanal en Granada"
        descripcion="Tienda de artesanía auténtica en el corazón del Albaicín. Cerámica, joyería árabe, bolsos de cuero marroquí, perfumes y más. Hecho a mano."
      />
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
            <p data-aos="fade-up" data-aos-delay="100" className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">
              {t.home.hero_tag}
            </p>
            <h1 data-aos="fade-up" data-aos-delay="200" className="font-serif text-white text-6xl md:text-8xl leading-none mb-6">
              {t.home.hero_title1}<br />
              <span className="text-[#E8C46A] italic">{t.home.hero_title2}</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay="300" className="text-white/70 text-lg max-w-xl mb-8">
              {t.home.hero_desc}
            </p>
            <div data-aos="fade-up" data-aos-delay="400">
              <Link to="/catalogo" className="inline-block bg-[#C9922A] text-white text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-[#E8C46A] transition-colors">
                {t.home.hero_btn}
              </Link>
            </div>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA */}
        <section className="bg-[#5C3D2E] border-t border-[#C9922A] border-b">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '45+', label: t.home.stats_years },
              { value: '200+', label: t.home.stats_products },
              { value: '100%', label: t.home.stats_handmade },
              { value: '★★★★★', label: t.home.stats_location },
            ].map((stat, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100} className={`text-center ${i < 3 ? 'border-r border-[#C9922A]/30' : ''}`}>
                <p className="font-serif text-[#E8C46A] text-4xl mb-1">{stat.value}</p>
                <p className="text-white/60 text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-10">
          <p data-aos="fade-up" className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">{t.home.categories_tag}</p>
          <h2 data-aos="fade-up" data-aos-delay="100" className="font-serif text-4xl text-[#5C3D2E] mb-8 whitespace-pre-line">{t.home.categories_title}</h2>
          <div data-aos="fade-up" data-aos-delay="200" className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px]">
            <div className="row-span-2 relative overflow-hidden cursor-pointer group">
              <img src="/ceramica.png" alt={t.home.ceramics} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-[#E8C46A] text-xs uppercase tracking-widest mb-1">✦ Artesanía</p>
                <h3 className="font-serif text-white text-2xl">{t.home.ceramics}</h3>
              </div>
            </div>
            <div className="relative overflow-hidden cursor-pointer group">
              <img src="/joyeria.jpg" alt={t.home.jewelry} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-xl">{t.home.jewelry}</h3>
              </div>
            </div>
            <div className="relative overflow-hidden cursor-pointer group">
              <img src="/bolsos.png" alt={t.home.bags} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-xl">{t.home.bags}</h3>
              </div>
            </div>
            <div className="relative overflow-hidden cursor-pointer group">
              <img src="/iluminacion.jpg" alt={t.home.lighting} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-xl">{t.home.lighting}</h3>
              </div>
            </div>
            <div className="relative overflow-hidden cursor-pointer group">
              <img src="/te.jpg" alt={t.home.tea} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-serif text-white text-xl">{t.home.tea}</h3>
              </div>
            </div>
            <div className="col-span-3 relative overflow-hidden cursor-pointer group">
              <img src="/perfumes.png" alt={t.home.perfumes} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-serif text-white text-2xl">{t.home.perfumes}</h3>
                <p className="text-white/70 text-sm">{t.home.perfumes_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FRASE IMPACTANTE */}
        <section className="bg-[#5C3D2E] py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p data-aos="fade-up" className="text-[#C9922A] text-xs uppercase tracking-[6px] mb-8">✦ Nuestra esencia</p>
            <h2 data-aos="fade-up" data-aos-delay="100" className="font-serif text-white text-4xl md:text-5xl leading-tight italic">
              "Cada pieza cuenta una historia.<br />La nuestra lleva 45 años escribiéndose<br />en el corazón del Albaicín"
            </h2>
            <div data-aos="fade-up" data-aos-delay="200" className="h-px bg-gradient-to-r from-transparent via-[#C9922A] to-transparent mt-12" />
          </div>
        </section>

        {/* PRODUCTOS DESTACADOS */}
        {productosDestacados.length > 0 && (
          <section className="bg-[#FDF8F0] border-t border-[#F0E0B8] py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <p data-aos="fade-up" className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">{t.home.featured_tag}</p>
              <h2 data-aos="fade-up" data-aos-delay="100" className="font-serif text-4xl text-[#5C3D2E] mb-10 whitespace-pre-line">{t.home.featured_title}</h2>
              <div className="grid grid-cols-3 gap-8">
                {productosDestacados.map((producto, i) => (
                  <Link key={producto.id} to={`/producto/${producto.id}`} className="group" data-aos="fade-up" data-aos-delay={i * 150}>
                    <div className="overflow-hidden mb-4">
                      <img
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{producto.categoria.nombre}</p>
                    <h3 className="font-serif text-[#5C3D2E] text-xl mb-3">{producto.nombre}</h3>
                    <span className="text-[#5C3D2E] text-xs uppercase tracking-widest border-b border-[#C9922A] pb-1 group-hover:text-[#C9922A] transition-colors">
                      {t.home.featured_btn} →
                    </span>
                  </Link>
                ))}
              </div>
              <div data-aos="fade-up" className="text-center mt-10">
                <Link
                  to="/catalogo"
                  className="inline-block border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors"
                >
                  {t.home.featured_all}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* POR QUÉ ELEGIRNOS */}
        <section className="bg-[#FDF8F0] border-t border-[#F0E0B8] py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <p data-aos="fade-up" className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2 text-center">— Por qué elegirnos</p>
            <h2 data-aos="fade-up" data-aos-delay="100" className="font-serif text-4xl text-[#5C3D2E] mb-12 text-center">La diferencia artesanal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div data-aos="fade-up" data-aos-delay="100" className="text-center">
                <div className="w-16 h-16 border border-[#C9922A] flex items-center justify-center mx-auto mb-6">
                  <HandMetal size={28} className="text-[#C9922A]" />
                </div>
                <h3 className="font-serif text-[#5C3D2E] text-xl mb-3">100% Hecho a mano</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">Cada pieza es única, elaborada artesanalmente con técnicas transmitidas de generación en generación.</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="200" className="text-center">
                <div className="w-16 h-16 border border-[#C9922A] flex items-center justify-center mx-auto mb-6">
                  <Users size={28} className="text-[#C9922A]" />
                </div>
                <h3 className="font-serif text-[#5C3D2E] text-xl mb-3">Artesanos locales</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">Trabajamos directamente con artesanos de Granada, Marruecos y Turquía. Sin intermediarios.</p>
              </div>
              <div data-aos="fade-up" data-aos-delay="300" className="text-center">
                <div className="w-16 h-16 border border-[#C9922A] flex items-center justify-center mx-auto mb-6">
                  <Award size={28} className="text-[#C9922A]" />
                </div>
                <h3 className="font-serif text-[#5C3D2E] text-xl mb-3">45 años de tradición</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">Desde 1980 en el corazón del Albaicín, preservando el arte nazarí para el mundo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* NUESTRA HISTORIA */}
        <section className="bg-[#FDF8F0] border-t border-[#F0E0B8] max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">{t.home.about_tag}</p>
            <h2 className="font-serif text-4xl text-[#5C3D2E] mb-6 whitespace-pre-line">{t.home.about_title}</h2>
            <p className="text-[#8B7355] text-lg leading-relaxed mb-6">{t.home.about_desc1}</p>
            <p className="text-[#8B7355] text-lg leading-relaxed mb-8">{t.home.about_desc2}</p>
            <Link to="/nosotros" className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9922A] hover:text-white transition-colors">
              {t.home.about_btn}
            </Link>
          </div>
          <div data-aos="fade-left" className="relative">
            <img src="/hero-alhambra.jpg" alt="Albaicín Granada" className="w-full h-[500px] object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-[#C9922A] text-white p-6">
              <p className="font-serif text-3xl font-bold">45+</p>
              <p className="text-xs uppercase tracking-widest">{t.home.stats_years}</p>
            </div>
          </div>
        </section>

        {/* BANNER UBICACIÓN */}
        <section className="bg-[#5C3D2E] border-t border-[#C9922A]/30 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div data-aos="fade-right" className="flex items-center gap-6">
              <div className="w-12 h-12 border border-[#C9922A]/40 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#E8C46A]" />
              </div>
              <div>
                <p className="text-[#E8C46A] text-xs uppercase tracking-widest mb-1">Dónde estamos</p>
                <p className="text-white font-serif text-lg">Calle Calderería Nueva, Albaicín</p>
                <p className="text-white/50 text-sm">Granada, España</p>
              </div>
            </div>
            <div data-aos="fade-up" className="flex items-center gap-6">
              <div className="w-12 h-12 border border-[#C9922A]/40 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-[#E8C46A]" />
              </div>
              <div>
                <p className="text-[#E8C46A] text-xs uppercase tracking-widest mb-1">Horario</p>
                <p className="text-white font-serif text-lg">Lunes — Domingo</p>
                <p className="text-white/50 text-sm">9:30 — 00:00</p>
              </div>
            </div>
            <div data-aos="fade-left">
              <a
                href="https://maps.google.com/?q=Calle+Calderería+Nueva+Granada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#E8C46A] text-[#E8C46A] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#E8C46A] hover:text-[#5C3D2E] transition-colors"
              >
                Cómo llegar →
              </a>
            </div>
          </div>
        </section>

        {/* BOTÓN WHATSAPP FLOTANTE */}
        <a
          href="https://wa.me/34958000000"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors"
          title="WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.83L.057 23.998l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.732.979 1-3.645-.235-.374A9.818 9.818 0 1112 21.818z"/>
          </svg>
        </a>

      </main>
    </>
  )
}

export default HomePage