import { Link } from 'react-router-dom'

const categorias = [
  { nombre: 'Cerámica', imagen: '/ceramica.png', descripcion: 'Tazas, platos y azulejos' },
  { nombre: 'Joyería', imagen: '/joyeria.jpg', descripcion: 'Pulseras, collares y pendientes' },
  { nombre: 'Bolsos y Cuero', imagen: '/bolsos.png', descripcion: 'Mochilas, bolsos y carteras' },
  { nombre: 'Iluminación', imagen: '/iluminacion.jpg', descripcion: 'Faroles y lámparas árabes' },
  { nombre: 'Mundo del Té', imagen: '/te.jpg', descripcion: 'Teteras y juegos de té' },
  { nombre: 'Perfumes', imagen: '/perfumes.png', descripcion: 'Incienso, aceites y perfumes' },
]

function CatalogoPage() {
  return (
    <main className="bg-[#FAF3E0] min-h-screen">

      {/* CABECERA */}
      <section className="bg-[#1C1008] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">✦ Nuestras creaciones</p>
          <h1 className="font-serif text-white text-5xl md:text-7xl leading-none">Catálogo</h1>
          <p className="text-white/60 mt-4 max-w-xl">Cada categoría es el resultado de años de tradición artesanal traída desde los talleres del Albaicín.</p>
        </div>
      </section>

      {/* CATEGORÍAS MOSAICO */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-2">— El Bazar</p>
        <h2 className="font-serif text-4xl text-[#1C1008] mb-12">Categorías<br />de la tienda</h2>

        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px]">

          {/* Grande izquierda */}
          <div className="row-span-2 relative overflow-hidden cursor-pointer group">
            <img src={categorias[0].imagen} alt={categorias[0].nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-[#E8C46A] text-xs uppercase tracking-widest mb-1">✦ Artesanía</p>
              <h3 className="font-serif text-white text-2xl">{categorias[0].nombre}</h3>
            </div>
          </div>

          {/* Arriba centro */}
          <div className="relative overflow-hidden cursor-pointer group">
            <img src={categorias[1].imagen} alt={categorias[1].nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">{categorias[1].nombre}</h3>
            </div>
          </div>

          {/* Arriba derecha */}
          <div className="relative overflow-hidden cursor-pointer group">
            <img src={categorias[2].imagen} alt={categorias[2].nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">{categorias[2].nombre}</h3>
            </div>
          </div>

          {/* Centro centro */}
          <div className="relative overflow-hidden cursor-pointer group">
            <img src={categorias[3].imagen} alt={categorias[3].nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">{categorias[3].nombre}</h3>
            </div>
          </div>

          {/* Centro derecha */}
          <div className="relative overflow-hidden cursor-pointer group">
            <img src={categorias[4].imagen} alt={categorias[4].nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-serif text-white text-xl">{categorias[4].nombre}</h3>
            </div>
          </div>

          {/* Abajo - ancho completo */}
          <div className="col-span-3 relative overflow-hidden cursor-pointer group">
            <img src={categorias[5].imagen} alt={categorias[5].nombre} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <h3 className="font-serif text-white text-2xl">{categorias[5].nombre}</h3>
              <p className="text-white/70 text-sm">{categorias[5].descripcion}</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}

export default CatalogoPage