import { Helmet } from 'react-helmet-async'

interface SEOProps {
  titulo?: string
  descripcion?: string
  imagen?: string
  url?: string
  tipo?: string
}

function SEO({
  titulo = 'Artesanía Albaicín · Granada',
  descripcion = 'Tienda de artesanía auténtica en el corazón del Albaicín, Granada. Cerámica, joyería, bolsos de cuero, perfumes árabes y mucho más. Hecho a mano por artesanos de Granada, Marruecos y Turquía.',
  imagen = '/grana.png',
  url = 'https://artesaniaalbaicin.es',
  tipo = 'website'
}: SEOProps) {
  const tituloCompleto = titulo.includes('Artesanía Albaicín')
    ? titulo
    : `${titulo} · Artesanía Albaicín Granada`

  return (
    <Helmet>
      {/* Básico */}
      <title>{tituloCompleto}</title>
      <meta name="description" content={descripcion} />
      <meta name="keywords" content="artesanía granada, albaicín, cerámica granadina, joyería árabe, bolsos cuero marroquí, perfumes árabes, souvenirs granada, tienda artesanal, alhambra" />
      <meta name="author" content="Artesanía Albaicín" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content={tipo} />
      <meta property="og:title" content={tituloCompleto} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:image" content={imagen} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Artesanía Albaicín" />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tituloCompleto} />
      <meta name="twitter:description" content={descripcion} />
      <meta name="twitter:image" content={imagen} />

      {/* Geolocalización */}
      <meta name="geo.region" content="ES-GR" />
      <meta name="geo.placename" content="Granada, Albaicín" />
      <meta name="geo.position" content="37.177896;-3.599409" />
      <meta name="ICBM" content="37.177896, -3.599409" />
    </Helmet>
  )
}

export default SEO