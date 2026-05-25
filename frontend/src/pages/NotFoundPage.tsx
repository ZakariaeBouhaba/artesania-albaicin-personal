import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="bg-[#FDF8F0] min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        
        <p className="text-[#C9922A] text-xs uppercase tracking-[6px] mb-6">✦ Error 404</p>
        
        <h1 className="font-serif text-[#5C3D2E] text-8xl md:text-[150px] leading-none mb-4">
          404
        </h1>
        
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9922A] to-transparent mb-8 max-w-xs mx-auto" />
        
        <h2 className="font-serif text-[#5C3D2E] text-3xl mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-[#8B7355] text-lg max-w-md mx-auto mb-12">
          La página que buscas no existe o ha sido movida. Vuelve al inicio para seguir explorando nuestra artesanía.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-[#5C3D2E] text-white text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#C9922A] transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            to="/catalogo"
            className="inline-block border border-[#5C3D2E] text-[#5C3D2E] text-xs uppercase tracking-widest px-10 py-4 hover:bg-[#5C3D2E] hover:text-white transition-colors"
          >
            Ver catálogo
          </Link>
        </div>

      </div>
    </main>
  )
}

export default NotFoundPage