import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { getProductos } from '../services/productos'
import SEO from '../components/SEO'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function HomePage() {
  const { t } = useLanguage()

  const { data: productos = [] } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos
  })

  const productosDestacados = productos
    .filter(p => p.estado === 'disponible' && p.imagen_url)
    .slice(0, 3)

  const statsRef = useScrollAnimation()
  const categoriesRef = useScrollAnimation()
  const featuredRef = useScrollAnimation()
  const aboutLeftRef = useScrollAnimation()
  const aboutRightRef = useScrollAnimation()

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
            <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">
              {t.home.hero_tag}
            </p>
            <h1 className="font-serif text-white text-6xl md:text-8xl leading-none mb-6">
              {t.home.hero_title1}<br />
              <span className="text-[#E8C46A] italic">{t.home.hero_title2}</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">
              {t.home.hero_desc}
            </p>
            <Link to="/catalogo" className="inline-block bg-[#C9922A] text-white text-xs uppercase tracking-widest font-bold px-8 py-4 hover:bg-[#E8C46A] transition-colors">
              {t.home.hero_btn}
            </Link>
          </div>
        </section>

        {/* FRANJA DE CONFIANZA */}
        <div
          ref={statsRef.ref}
          className={`bg-[#5C3D2E] border-t border-[#C9922A] border-b fade-up ${statsRef.visible ? 'visible' : ''}`}
        >
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-4 gap-4">
            <div className="text-center border-r border-[#C9922A]/30">
              <p className="font-serif text-[#E8C46A] text-4xl mb-1">45+</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">{t.home.stats_years}</p>
            </div>
            <div className="text-center border-r border-[#C9922A]/30">
              <p className="font-serif text-[#E8C46A] text-4xl mb-1">200+</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">{t.home.stats_products}</p>
            </div>
            <div className="text-center border-r border-[#C9922A]/30">
              <p className="font-serif text-[#E8C46A] text-4xl mb-1">100%</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">{t.home.stats_handmade}</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-[#E8C46A] text-4xl mb-1">★★★★★</p>
              <p className="text-white/60 text-xs uppercase tracking-widest">{t.home.stats_location}</p>
            </div>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div
          ref={categoriesRef.ref}
          className={`max-w-6xl mx-auto px-6 pt-8 pb-16 fade-up ${categoriesRef.visible ? 'visible' : ''}`}
        >
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">{t.home.categories_tag}</p>
          <h2 className="font-serif text-4xl text-[#5C3D2E] mb-8 whitespace-pre-line">{t.home.categories_title}</h2>
          <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px]">
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
        </div>

        {/* PRODUCTOS DESTACADOS */}
        {productosDestacados.length > 0 && (
          <div
            ref={featuredRef.ref}
            className={`bg-[#FDF8F0] border-t border-[#F0E0B8] py-20 px-6 fade-up ${featuredRef.visible ? 'visible' : ''}`}
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">{t.home.featured_tag}</p>
              <h2 className="font-serif text-4xl text-[#5C3D2E] mb-12 whitespace-pre-line">{t.home.featured_title}</h2>
              <div className="grid grid-cols-3 gap-8">
                {productosDestacados.map((producto, i) => (
                  <Link
                    key={producto.id}
                    to={`/producto/${producto.id}`}
                    className={`group fade-up ${featuredRef.visible ? 'visible' : ''} delay-${(i + 1) * 100}`}
                  >
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
              <div className="text-center mt-12">
                <Link
                  to="/catalogo"
                  className="inline-block border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors"
                >
                  {t.home.featured_all}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* NUESTRA HISTORIA */}
        <div className="bg-[#FDF8F0] max-w-6xl mx-auto px-6 py-24 grid grid-cols-2 gap-16 items-center">
          <div
            ref={aboutLeftRef.ref}
            className={`fade-left ${aboutLeftRef.visible ? 'visible' : ''}`}
          >
            <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-4">{t.home.about_tag}</p>
            <h2 className="font-serif text-4xl text-[#5C3D2E] mb-6 whitespace-pre-line">{t.home.about_title}</h2>
            <p className="text-[#8B7355] text-lg leading-relaxed mb-6">{t.home.about_desc1}</p>
            <p className="text-[#8B7355] text-lg leading-relaxed mb-8">{t.home.about_desc2}</p>
            <Link to="/nosotros" className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9922A] hover:text-white transition-colors">
              {t.home.about_btn}
            </Link>
          </div>
          <div
            ref={aboutRightRef.ref}
            className={`relative fade-right ${aboutRightRef.visible ? 'visible' : ''}`}
          >
            <img src="/hero-alhambra.jpg" alt="Albaicín Granada" className="w-full h-[500px] object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-[#C9922A] text-white p-6">
              <p className="font-serif text-3xl font-bold">45+</p>
              <p className="text-xs uppercase tracking-widest">{t.home.stats_years}</p>
            </div>
          </div>
        </div>

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