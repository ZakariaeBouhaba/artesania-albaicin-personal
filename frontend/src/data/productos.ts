import type { Producto } from '../types/index'

export const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Jarra Nazarí',
    descripcion: 'Decorada con motivos geométricos y caligrafía árabe, inspirada en las vasijas de la Alhambra.',
    origen: 'Granada, Albaicín',
    material: 'Arcilla y esmalte natural',
    hecho_a_mano: true,
    categoria: 'Ceramica',
    imagen_url: '/ceramica.png'
  },
  {
    id: 2,
    nombre: 'Plato Andalusí',
    descripcion: 'Plato decorativo pintado a mano con esmaltes tradicionales en azul cobalto y verde.',
    origen: 'Granada',
    material: 'Cerámica esmaltada',
    hecho_a_mano: true,
    categoria: 'Ceramica',
    imagen_url: '/ceramica.png'
  },
  {
    id: 3,
    nombre: 'Colgante Alhambra',
    descripcion: 'Plata de ley con filigrana granadina e incrustaciones de granate, piedra símbolo de Granada.',
    origen: 'Granada',
    material: 'Plata de ley y granate',
    hecho_a_mano: true,
    categoria: 'Joyeria',
    imagen_url: '/joyeria.jpg'
  },
  {
    id: 4,
    nombre: 'Pulsera Charm',
    descripcion: 'Pulsera de plata con charms árabes, símbolo de la mano de Fátima y estrella nazarí.',
    origen: 'Granada',
    material: 'Plata de ley',
    hecho_a_mano: true,
    categoria: 'Joyeria',
    imagen_url: '/joyeria.jpg'
  },
  {
    id: 5,
    nombre: 'Mochila Albaicín',
    descripcion: 'Mochila de cuero natural trabajada a mano con estampados arabescos y herrajes dorados.',
    origen: 'Marruecos',
    material: 'Cuero natural curtido',
    hecho_a_mano: true,
    categoria: 'Bolsos',
    imagen_url: '/bolsos.png'
  },
  {
    id: 6,
    nombre: 'Bolso de mano',
    descripcion: 'Bolso de cuero con grabados orientales y tachuelas doradas artesanales.',
    origen: 'Marruecos',
    material: 'Cuero natural',
    hecho_a_mano: true,
    categoria: 'Bolsos',
    imagen_url: '/bolsos.png'
  },
  {
    id: 7,
    nombre: 'Farol Árabe Dorado',
    descripcion: 'Farol árabe con cristales de colores y estructura dorada, ideal para decoración.',
    origen: 'Turquía',
    material: 'Metal dorado y cristal',
    hecho_a_mano: true,
    categoria: 'Iluminacion',
    imagen_url: '/iluminacion.jpg'
  },
  {
    id: 8,
    nombre: 'Lámpara Marroquí',
    descripcion: 'Lámpara de cobre grande con calados geométricos que proyectan sombras arabescos.',
    origen: 'Marruecos',
    material: 'Cobre artesanal',
    hecho_a_mano: true,
    categoria: 'Iluminacion',
    imagen_url: '/iluminacion.jpg'
  },
  {
    id: 9,
    nombre: 'Juego de Té Marroquí',
    descripcion: 'Juego completo con tetera, azucarero y bandeja plateada grabada a mano.',
    origen: 'Marruecos',
    material: 'Alpaca plateada',
    hecho_a_mano: true,
    categoria: 'Te',
    imagen_url: '/te.jpg'
  },
  {
    id: 10,
    nombre: 'Tetera de Hierro',
    descripcion: 'Tetera de hierro fundido japonesa, perfecta para el té verde y de menta.',
    origen: 'Marruecos',
    material: 'Hierro fundido',
    hecho_a_mano: true,
    categoria: 'Te',
    imagen_url: '/te.jpg'
  },
  {
    id: 11,
    nombre: 'Perfume Árabe',
    descripcion: 'Perfume árabe en botella de cristal tallada, fragancia de oud y rosa.',
    origen: 'Emiratos Árabes',
    material: 'Cristal y esencias naturales',
    hecho_a_mano: true,
    categoria: 'Perfumes',
    imagen_url: '/perfumes.png'
  },
  {
    id: 12,
    nombre: 'Pack de Incienso',
    descripcion: 'Pack variado de incienso árabe con soporte de madera torre tallada.',
    origen: 'Marruecos',
    material: 'Madera y resinas naturales',
    hecho_a_mano: true,
    categoria: 'Perfumes',
    imagen_url: '/perfumes.png'
  },
]

export const categorias = ['Todos', 'Ceramica', 'Joyeria', 'Bolsos', 'Iluminacion', 'Te', 'Perfumes']