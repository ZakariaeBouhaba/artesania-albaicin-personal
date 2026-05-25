import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProductos, getProductosByCategoria } from '../services/productos'
import { getCategorias } from '../services/categorias'
import ProductoCard from '../components/ProductoCard'
import { useLanguage } from '../context/LanguageContext'
import SEO from '../components/SEO'

function CatalogoPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null)
  const { t } = useLanguage()

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias
  })

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos', categoriaActiva],
    queryFn: () => categoriaActiva ? getProductosByCategoria(categoriaActiva) : getProductos()
  })

  const categoriaActivaNombre = categorias.find(c => c.id === categoriaActiva)?.nombre

  return (
    <>
      <SEO
        titulo={categoriaActivaNombre ? `${categoriaActivaNombre} · Catálogo Artesanía Albaicín` : 'Catálogo · Artesanía Albaicín Granada'}
        descripcion="Descubre nuestra colección de artesanía auténtica: cerámica granadina, joyería árabe, bolsos de cuero marroquí, perfumes, iluminación y mucho más."
        url="https://artesaniaalbaicin.es/catalogo"
      />
      <main className="bg-[#FDF8F0] min-h-screen">

        {/* CABECERA */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <img src="/anadluz.png" alt="Granada" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#5C3D2E]/80" />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">{t.catalogo.tag}</p>
            <h1 className="font-serif text-white text-5xl md:text-7xl leading-none">{t.catalogo.title}</h1>
            <p className="text-white/60 mt-4 max-w-xl">{t.catalogo.desc}</p>
          </div>
        </section>

        {/* FILTROS */}
        <section className="border-b border-[#F0E0B8] px-6 py-4 bg-white sticky top-[88px] z-40">
          <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
            <button
              onClick={() => setCategoriaActiva(null)}
              className={`text-xs uppercase tracking-widest px-5 py-2 border transition-colors ${
                categoriaActiva === null
                  ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white'
                  : 'border-[#C9922A] text-[#C9922A] hover:bg-[#C9922A] hover:text-white'
              }`}
            >
              {t.catalogo.todos}
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`text-xs uppercase tracking-widest px-5 py-2 border transition-colors ${
                  categoriaActiva === cat.id
                    ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white'
                    : 'border-[#C9922A] text-[#C9922A] hover:bg-[#C9922A] hover:text-white'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#F0E0B8] animate-pulse h-96" />
              ))}
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-[#5C3D2E] text-2xl mb-2">{t.catalogo.vacio_titulo}</p>
              <p className="text-[#8B7355] text-sm">{t.catalogo.vacio_desc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>

      </main>
    </>
  )
}

export default CatalogoPage