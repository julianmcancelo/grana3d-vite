import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart, Search, Menu, X, User, Heart,
    Phone, Sun, Moon, LogOut, ChevronDown, Sparkles,
    Settings, Package, Mail, MapPin
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCarrito } from '../context/CarritoContext'
import { useUsuario } from '../context/UsuarioContext'
import api from '../api/client'

interface Categoria {
    id: string
    nombre: string
    slug: string
}

interface Config {
    nombre_tienda?: string
    eslogan?: string
    telefono?: string
    email?: string
    direccion?: string
    whatsapp?: string
    envio_gratis_minimo?: string
}

export default function Header() {
    const [menuMovil, setMenuMovil] = useState(false)
    const [busquedaAbierta, setBusquedaAbierta] = useState(false)
    const [submenuAbierto, setSubmenuAbierto] = useState<string | null>(null)
    const [userMenuAbierto, setUserMenuAbierto] = useState(false)
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [config, setConfig] = useState<Config>({})
    const [busqueda, setBusqueda] = useState('')

    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const { cantidadTotal, abrirCarrito } = useCarrito()
    const { usuario, estaAutenticado, esAdmin, abrirModal, cerrarSesion } = useUsuario()

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [catRes, configRes] = await Promise.all([
                    api.get('/categorias'),
                    api.get('/config')
                ])
                setCategorias(catRes.data)
                setConfig(configRes.data)
            } catch (error) {
                console.error('Error cargando datos del header:', error)
            }
        }
        cargarDatos()
    }, [])

    const esActivo = (href: string) => location.pathname === href

    const handleBuscar = (e: React.FormEvent) => {
        e.preventDefault()
        if (busqueda.trim()) {
            // TODO: Implementar búsqueda
            console.log('Buscar:', busqueda)
        }
    }

    const envioGratisMinimo = parseInt(config.envio_gratis_minimo || '50000')

    return (
        <>
            {/* Barra Superior */}
            <div className="bg-gray-900 dark:bg-black text-white text-sm hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {config.telefono && (
                            <a href={`tel:${config.telefono}`} className="flex items-center gap-2 hover:text-grana-cyan transition-colors">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{config.telefono}</span>
                            </a>
                        )}
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">
                            Envío gratis en compras +${envioGratisMinimo.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {estaAutenticado ? (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-300">Hola, {usuario?.nombre}</span>
                                {esAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-grana-cyan hover:text-grana-purple transition-colors flex items-center gap-1"
                                    >
                                        <Settings className="w-3.5 h-3.5" />
                                        Admin
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => abrirModal('login')} className="hover:text-grana-cyan transition-colors">
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Header Principal */}
            <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm dark:shadow-gray-800/20 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 shrink-0">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-grana-purple to-grana-cyan rounded-xl flex items-center justify-center shadow-lg shadow-grana-purple/20">
                                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl lg:text-2xl font-bold tracking-tight">
                                    <span className="text-grana-purple">{config.nombre_tienda?.split('3D')[0] || 'Grana'}</span>
                                    <span className="text-gray-900 dark:text-white">3D</span>
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 hidden lg:block">
                                    {config.eslogan || 'Productos Impresos en 3D'}
                                </p>
                            </div>
                        </Link>

                        {/* Navegación Desktop */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${esActivo('/')
                                    ? "text-grana-purple bg-grana-purple/5"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Inicio
                            </Link>
                            <Link
                                to="/tienda"
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${esActivo('/tienda')
                                    ? "text-grana-purple bg-grana-purple/5"
                                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                Tienda
                            </Link>

                            {/* Categorías Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setSubmenuAbierto('categorias')}
                                onMouseLeave={() => setSubmenuAbierto(null)}
                            >
                                <button className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Categorías
                                    <ChevronDown className={`w-4 h-4 transition-transform ${submenuAbierto === 'categorias' ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {submenuAbierto === 'categorias' && categorias.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden py-2"
                                        >
                                            {categorias.map((cat) => (
                                                <a
                                                    key={cat.id}
                                                    href={`/tienda#categoria-${cat.slug}`}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-grana-purple hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Package className="w-4 h-4" />
                                                    {cat.nombre}
                                                </a>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <a
                                href="/tienda#contacto"
                                className="px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Contacto
                            </a>
                        </nav>

                        {/* Búsqueda Desktop */}
                        <form onSubmit={handleBuscar} className="hidden md:flex flex-1 max-w-sm mx-6">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="¿Qué estás buscando?"
                                    className="w-full px-4 py-2.5 pl-11 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl focus:outline-none focus:border-grana-purple/30 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </form>

                        {/* Acciones */}
                        <div className="flex items-center gap-1">
                            {/* Búsqueda Móvil */}
                            <button
                                onClick={() => setBusquedaAbierta(!busquedaAbierta)}
                                className="md:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Tema */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Cambiar tema"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Usuario Desktop - Con Dropdown */}
                            <div
                                className="relative hidden lg:block"
                                onMouseEnter={() => setUserMenuAbierto(true)}
                                onMouseLeave={() => setUserMenuAbierto(false)}
                            >
                                <button
                                    onClick={() => !estaAutenticado && abrirModal('login')}
                                    className={`p-2.5 rounded-lg transition-colors ${estaAutenticado
                                        ? 'text-grana-purple bg-grana-purple/10'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {estaAutenticado && userMenuAbierto && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="font-medium text-gray-900 dark:text-white">{usuario?.nombre}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{usuario?.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <Package className="w-4 h-4" />
                                                    Mis Pedidos
                                                </a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <Heart className="w-4 h-4" />
                                                    Favoritos
                                                </a>
                                                {esAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-grana-purple hover:bg-grana-purple/5 transition-colors"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Panel Admin
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                                                <button
                                                    onClick={cerrarSesion}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Favoritos */}
                            <button className="hidden sm:flex p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>

                            {/* Carrito */}
                            <button
                                onClick={abrirCarrito}
                                className="relative p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cantidadTotal > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-grana-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                                    >
                                        {cantidadTotal > 9 ? '9+' : cantidadTotal}
                                    </motion.span>
                                )}
                            </button>

                            {/* Menú Móvil */}
                            <button
                                className="lg:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setMenuMovil(!menuMovil)}
                            >
                                {menuMovil ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Búsqueda Móvil Expandida */}
                <AnimatePresence>
                    {busquedaAbierta && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <form onSubmit={handleBuscar} className="p-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        placeholder="¿Qué estás buscando?"
                                        autoFocus
                                        className="w-full px-4 py-3 pl-11 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Menú Móvil */}
                <AnimatePresence>
                    {menuMovil && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <nav className="px-4 py-4 space-y-1 bg-white dark:bg-gray-900">
                                <Link
                                    to="/"
                                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${esActivo('/')
                                        ? "text-grana-purple bg-grana-purple/5"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={() => setMenuMovil(false)}
                                >
                                    Inicio
                                </Link>
                                <Link
                                    to="/tienda"
                                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${esActivo('/tienda')
                                        ? "text-grana-purple bg-grana-purple/5"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                    onClick={() => setMenuMovil(false)}
                                >
                                    Tienda
                                </Link>

                                {/* Categorías en móvil */}
                                <div className="px-4 py-2">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Categorías</p>
                                    <div className="space-y-1">
                                        {categorias.map((cat) => (
                                            <a
                                                key={cat.id}
                                                href={`/tienda#categoria-${cat.slug}`}
                                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-grana-purple rounded-lg"
                                                onClick={() => setMenuMovil(false)}
                                            >
                                                {cat.nombre}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href="/tienda#contacto"
                                    className="block px-4 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => setMenuMovil(false)}
                                >
                                    Contacto
                                </a>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {estaAutenticado ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="w-10 h-10 bg-grana-purple/10 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-grana-purple" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{usuario?.nombre}</p>
                                                    <p className="text-sm text-gray-500">{usuario?.email}</p>
                                                </div>
                                            </div>
                                            {esAdmin && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center gap-2 px-4 py-3 text-grana-purple font-medium bg-grana-purple/5 rounded-lg"
                                                    onClick={() => setMenuMovil(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Panel de Administración
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => { cerrarSesion(); setMenuMovil(false) }}
                                                className="flex items-center gap-2 px-4 py-3 text-red-500 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { abrirModal('login'); setMenuMovil(false) }}
                                            className="block w-full px-4 py-3 rounded-lg text-white font-medium text-center bg-grana-purple hover:bg-grana-purple/90"
                                        >
                                            Iniciar Sesión
                                        </button>
                                    )}
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    )
}
