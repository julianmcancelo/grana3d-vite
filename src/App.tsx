import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CarritoProvider } from './context/CarritoContext'
import { UsuarioProvider } from './context/UsuarioContext'
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import ProductoDetalle from './pages/ProductoDetalle'
import Checkout from './pages/Checkout'
import CheckoutExito from './pages/CheckoutExito'
import CheckoutFallido from './pages/CheckoutFallido'
import CheckoutWhatsApp from './pages/CheckoutWhatsApp'
import NotFound from './pages/NotFound'

// Admin
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Productos from './pages/admin/Productos'
import Categorias from './pages/admin/Categorias'
import Pedidos from './pages/admin/Pedidos'
import Configuracion from './pages/admin/Configuracion'
import AdminPlaceholder from './components/AdminPlaceholder'
import Banners from './pages/admin/Banners'

function App() {
  return (
    <ThemeProvider>
      <UsuarioProvider>
        <CarritoProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/producto/:slug" element={<ProductoDetalle />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/exito" element={<CheckoutExito />} />
              <Route path="/checkout/fallido" element={<CheckoutFallido />} />
              <Route path="/checkout/pendiente" element={<CheckoutExito />} />
              <Route path="/checkout/whatsapp" element={<CheckoutWhatsApp />} />

              {/* Rutas Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<Productos />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="config" element={<Configuracion />} />
                <Route path="config" element={<Configuracion />} />
                <Route path="banners" element={<Banners />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </UsuarioProvider>
    </ThemeProvider>
  )
}

export default App
