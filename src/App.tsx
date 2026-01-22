import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { CarritoProvider } from './context/CarritoContext'
import { UsuarioProvider } from './context/UsuarioContext'
import Home from './pages/Home'
import Tienda from './pages/Tienda'

function App() {
  return (
    <ThemeProvider>
      <UsuarioProvider>
        <CarritoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </UsuarioProvider>
    </ThemeProvider>
  )
}

export default App
