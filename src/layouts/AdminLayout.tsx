import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard, ShoppingBag, FolderTree, ShoppingCart, Settings,
    LogOut, Menu, X, ChevronRight, User, Image
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUsuario } from '../context/UsuarioContext'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { usuario, esAdmin, iniciandoSesion, cerrarSesion } = useUsuario()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!iniciandoSesion && !esAdmin) {
            navigate('/tienda')
        }
    }, [iniciandoSesion, esAdmin, navigate])

    if (iniciandoSesion) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
    if (!esAdmin) return null

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Banners', href: '/admin/banners', icon: Image },
        { name: 'Productos', href: '/admin/productos', icon: ShoppingBag },
        { name: 'Categorías', href: '/admin/categorias', icon: FolderTree },
        { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
        { name: 'Configuración', href: '/admin/config', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: sidebarOpen ? 260 : 80 }}
                className="bg-white border-r border-gray-200 sticky top-0 h-screen z-30 transition-all duration-300 hidden md:block"
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                    {sidebarOpen ? (
                        <span className="text-xl font-bold bg-gradient-to-r from-grana-purple to-grana-cyan bg-clip-text text-transparent">
                            Grana3D
                        </span>
                    ) : (
                        <span className="text-xl font-bold text-grana-purple">G</span>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? 'bg-grana-purple/5 text-grana-purple font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span>{item.name}</span>}
                                {sidebarOpen && isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={cerrarSesion}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-colors ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-grana-purple/10 flex items-center justify-center text-grana-purple">
                            <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{usuario?.nombre}</span>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
