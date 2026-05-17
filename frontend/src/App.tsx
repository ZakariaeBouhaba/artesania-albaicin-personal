import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header.tsx'
import HomePage from './pages/HomePage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<div>Catálogo</div>} />
          <Route path="/producto/:id" element={<div>Detalle producto</div>} />
          <Route path="/nosotros" element={<div>Nosotros</div>} />
          <Route path="/contacto" element={<div>Contacto</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App