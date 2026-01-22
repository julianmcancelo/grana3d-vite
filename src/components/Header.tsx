import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart, Search, Menu, X, User, Heart,
    Phone, Sun, Moon, LogOut, ChevronDown, Sparkles
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useCarrito } from '../context/CarritoContext'
import { useUsuario } from '../context/UsuarioContext'

const navegacion = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Tienda", href: "/tienda" },
    {
        nombre: "Categorías",
        href: "#",
        submenu: [
            { nombre: "Figuras", href: "/categoria/figuras" },
            { nombre: "Decoración", href: "/categoria/decoracion" },
            { nombre: "Regalos", href: "/categoria/regalos" },
            { nombre: "Accesorios", href: "/categoria/accesorios" },
        ]
    },
    { nombre: "Contacto", href: "#contacto" },
]

export default function Header() {
    const [menuMovil, setMenuMovil] = useState(false)
    const [busquedaAbierta, setBusquedaAbierta] = useState(false)
    const [submenuAbierto, setSubmenuAbierto] = useState<string | null>(null)
    const location = useLocation()
    const { theme, toggleTheme } = useTheme()
    const { cantidadTotal, abrirCarrito } = useCarrito()
    const { usuario, estaAutenticado, abrirModal, cerrarSesion } = useUsuario()

    const esActivo = (href: string) => location.pathname === href

    return (
        <>
            {/* Barra Superior */}
            <div className="bg-gray-900 dark:bg-black text-white text-sm hidden lg:block">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a href="tel:+5491112345678" className="flex items-center gap-2 hover:text-grana-cyan transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                            <span>+54 11 1234-5678</span>
                        </a>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400">Envío gratis en compras +$50.000</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {estaAutenticado ? (
                            <span className="text-gray-300">Hola, {usuario?.nombre}</span>
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
                                    <span className="text-grana-purple">Grana</span>
                                    <span className="text-gray-900 dark:text-white">3D</span>
                                </span>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 hidden lg:block">
                                    Productos Impresos en 3D
                                </p>
                            </div>
                        </Link>

                        {/* Navegación Desktop */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navegacion.map((link) => (
                                <div
                                    key={link.nombre}
                                    className="relative"
                                    onMouseEnter={() => link.submenu && setSubmenuAbierto(link.nombre)}
                                    onMouseLeave={() => setSubmenuAbierto(null)}
                                >
                                    <Link
                                        to={link.href}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${esActivo(link.href)
                                                ? "text-grana-purple bg-grana-purple/5"
                                                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }`}
                                    >
                                        {link.nombre}
                                        {link.submenu && <ChevronDown className="w-4 h-4" />}
                                    </Link>

                                    {/* Submenu */}
                                    <AnimatePresence>
                                        {link.submenu && submenuAbierto === link.nombre && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden py-2"
                                            >
                                                {link.submenu.map((sub) => (
                                                    <Link
                                                        key={sub.nombre}
                                                        to={sub.href}
                                                        className="block px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-grana-purple hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {sub.nombre}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>

                        {/* Búsqueda Desktop */}
                        <div className="hidden md:flex flex-1 max-w-sm mx-6">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="¿Qué estás buscando?"
                                    className="w-full px-4 py-2.5 pl-11 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl focus:outline-none focus:border-grana-purple/30 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

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

                            {/* Usuario Desktop */}
                            {estaAutenticado ? (
                                <button
                                    onClick={cerrarSesion}
                                    className="hidden lg:flex p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => abrirModal('login')}
                                    className="hidden lg:flex p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                </button>
                            )}

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
                            <div className="p-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="¿Qué estás buscando?"
                                        autoFocus
                                        className="w-full px-4 py-3 pl-11 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
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
                                {navegacion.map((link) => (
                                    <div key={link.nombre}>
                                        <Link
                                            to={link.href}
                                            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${esActivo(link.href)
                                                    ? "text-grana-purple bg-grana-purple/5"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                }`}
                                            onClick={() => !link.submenu && setMenuMovil(false)}
                                        >
                                            {link.nombre}
                                        </Link>
                                        {link.submenu && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {link.submenu.map((sub) => (
                                                    <Link
                                                        key={sub.nombre}
                                                        to={sub.href}
                                                        className="block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-grana-purple"
                                                        onClick={() => setMenuMovil(false)}
                                                    >
                                                        {sub.nombre}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {estaAutenticado ? (
                                        <div className="flex items-center justify-between px-4 py-3">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Hola, {usuario?.nombre}
                                            </span>
                                            <button
                                                onClick={() => { cerrarSesion(); setMenuMovil(false) }}
                                                className="text-red-500 text-sm"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { abrirModal('login'); setMenuMovil(false) }}
                                            className="block w-full px-4 py-3 rounded-lg text-grana-purple font-medium text-center bg-grana-purple/5"
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
