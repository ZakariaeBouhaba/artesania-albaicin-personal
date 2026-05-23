import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducto } from '../services/productos'
import { useLanguage } from '../context/LanguageContext'
import SEO from '../components/SEO'

function ProductoPage() {
  const { id } = useParams()
  const { t } = useLanguage()

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProducto(Number(id))
  })

  if (isLoading) {
    return (
      <main className="bg-[#FDF8F0] min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 gap-16">
          <div className="bg-[#F0E0B8] animate-pulse aspect-square" />
          <div className="flex flex-col gap-4">
            <div className="bg-[#F0E0B8] animate-pulse h-8 w-32" />
            <div className="bg-[#F0E0B8] animate-pulse h-16 w-full" />
            <div className="bg-[#F0E0B8] animate-pulse h-24 w-full" />
          </div>
        </section>
      </main>
    )
  }

  if (isError || !producto) {
    return (
      <main className="bg-[#FDF8F0] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-[#5C3D2E] text-3xl mb-4">{t.producto.no_encontrado}</p>
          <Link to="/catalogo" className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-8 py-4 hover:bg-[#C9922A] hover:text-white transition-colors">
            {t.producto.volver}
          </Link>
        </div>
      </main>
    )
  }

  const estadoTexto = producto.estado === 'disponible'
    ? t.producto.disponible
    : producto.estado === 'agotado'
    ? t.producto.agotado
    : t.producto.bajo_pedido

  const estadoClase = producto.estado === 'disponible'
    ? 'border-green-600 text-green-600'
    : producto.estado === 'agotado'
    ? 'border-red-600 text-red-600'
    : 'border-[#C9922A] text-[#C9922A]'

  return (
    <>
      <SEO
        titulo={`${producto.nombre} · Artesanía Albaicín Granada`}
        descripcion={producto.descripcion || `${producto.nombre} — artesanía hecha a mano en Granada. Origen: ${producto.origen}. Material: ${producto.material}.`}
        imagen={producto.imagen_url}
        url={`https://artesaniaalbaicin.es/producto/${producto.id}`}
        tipo="product"
      />
      <main className="bg-[#FDF8F0] min-h-screen">

        {/* MIGAS DE PAN */}
        <section className="bg-white border-b border-[#F0E0B8] px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B7355]">
            <Link to="/" className="hover:text-[#C9922A] transition-colors">{t.producto.inicio}</Link>
            <span>·</span>
            <Link to="/catalogo" className="hover:text-[#C9922A] transition-colors">{t.producto.catalogo}</Link>
            <span>·</span>
            <span className="text-[#5C3D2E]">{producto.nombre}</span>
          </div>
        </section>

        {/* DETALLE */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 gap-16 items-start">

          {/* IMAGEN */}
          <div className="sticky top-24">
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* INFO */}
          <div>
            <span className="text-[#C9922A] text-xs uppercase tracking-widest mb-3 block">
              {producto.categoria?.nombre}
            </span>
            <h1 className="font-serif text-[#5C3D2E] text-5xl leading-none mb-6">
              {producto.nombre}
            </h1>
            <div className="h-px bg-gradient-to-r from-[#C9922A] to-transparent mb-6" />
            <p className="text-[#8B7355] text-lg leading-relaxed mb-10">
              {producto.descripcion}
            </p>

            {/* DETALLES */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-4 py-4 border-b border-[#F0E0B8]">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest w-28">{t.producto.origen}</span>
                <span className="text-[#5C3D2E] text-sm">{producto.origen}</span>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-[#F0E0B8]">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest w-28">{t.producto.material}</span>
                <span className="text-[#5C3D2E] text-sm">{producto.material}</span>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-[#F0E0B8]">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest w-28">{t.producto.categoria}</span>
                <span className="text-[#5C3D2E] text-sm">{producto.categoria?.nombre}</span>
              </div>
              {producto.hecho_a_mano && (
                <div className="flex items-center gap-4 py-4 border-b border-[#F0E0B8]">
                  <span className="text-[#C9922A] text-xs uppercase tracking-widest w-28">{t.producto.elaboracion}</span>
                  <span className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-3 py-1">
                    {t.producto.hecho_a_mano}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4 py-4 border-b border-[#F0E0B8]">
                <span className="text-[#C9922A] text-xs uppercase tracking-widest w-28">{t.producto.estado}</span>
                <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${estadoClase}`}>
                  {estadoTexto}
                </span>
              </div>
            </div>

            {/* BOTONES */}
            <Link
              to="/contacto"
              className="inline-block bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#C9922A] transition-colors w-full text-center mb-4"
            >
              {t.producto.consultar}
            </Link>
            <Link
              to="/catalogo"
              className="inline-block border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors w-full text-center"
            >
              {t.producto.volver}
            </Link>
          </div>

        </section>

      </main>
    </>
  )
}

export default ProductoPage