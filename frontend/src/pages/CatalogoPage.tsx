import { useState } from 'react'
import { productos, categorias } from '../data/productos'
import ProductoCard from '../components/ProductoCard'

function CatalogoPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const productosFiltrados = categoriaActiva === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  return (
    <main className="bg-[#FDF8F0] min-h-screen">

      {/* CABECERA */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/anadluz.png" alt="Granada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#5C3D2E]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">✦ Nuestras creaciones</p>
          <h1 className="font-serif text-white text-5xl md:text-7xl leading-none">Catálogo</h1>
          <p className="text-white/60 mt-4 max-w-xl">Cada pieza ha sido seleccionada con cuidado y elaborada a mano por artesanos de Granada, Marruecos y Turquía.</p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="border-b border-[#F0E0B8] px-6 py-4 bg-white sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`text-xs uppercase tracking-widest px-5 py-2 border transition-colors ${
                categoriaActiva === cat
                  ? 'bg-[#5C3D2E] border-[#5C3D2E] text-white'
                  : 'border-[#C9922A] text-[#C9922A] hover:bg-[#C9922A] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-[#5C3D2E] text-2xl mb-2">No hay productos en esta categoría</p>
            <p className="text-[#8B7355] text-sm">Prueba con otra categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

    </main>
  )
}

export default CatalogoPage