import { Link } from 'react-router-dom'
import type { Producto } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  producto: Producto
}

function ProductoCard({ producto }: Props) {
  const { t } = useLanguage()

  return (
    <Link to={`/producto/${producto.id}`}>
      <div className="bg-white group cursor-pointer border border-[#F0E0B8] hover:border-[#C9922A] transition-all duration-300 hover:shadow-lg">

        {/* IMAGEN */}
        <div className="overflow-hidden aspect-square">
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* INFO */}
        <div className="p-5">
          <span className="text-[#C9922A] text-xs uppercase tracking-widest mb-2 block">
            {producto.categoria?.nombre}
          </span>
          <h3 className="font-serif text-[#5C3D2E] text-xl mb-2">
            {producto.nombre}
          </h3>
          <p className="text-[#8B7355] text-sm leading-relaxed mb-4">
            {producto.descripcion}
          </p>
          <div className="flex flex-col gap-2 border-t border-[#F0E0B8] pt-4">
            <div className="flex gap-2">
              <span className="text-[#C9922A] text-xs uppercase tracking-widest">{t.card.origen}</span>
              <span className="text-[#8B7355] text-xs">{producto.origen}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[#C9922A] text-xs uppercase tracking-widest">{t.card.material}</span>
              <span className="text-[#8B7355] text-xs">{producto.material}</span>
            </div>
            {producto.hecho_a_mano && (
              <span className="inline-block border border-[#C9922A] text-[#C9922A] text-xs uppercase tracking-widest px-3 py-1 mt-1 w-fit">
                {t.card.hecho_a_mano}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}

export default ProductoCard