import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart, Search, Menu, X, User, Heart, ChevronRight,
    Phone, Mail, MapPin, Truck, CreditCard, Shield,
    Printer, Package, Settings, Palette, Zap, Award, Headphones,
    Facebook, Instagram, MessageCircle, ArrowRight, Sun, Moon
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
    storeName: "Grana3D",
    tagline: "Impresión 3D Premium",
    contact: {
        email: "hola@grana3d.com.ar",
        phone: "+54 11 1234-5678",
        whatsapp: "5491112345678",
        location: "Buenos Aires, Argentina"
    },
    social: {
        facebook: "#",
        instagram: "#"
    }
}

const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Impresoras", href: "#" },
    { name: "Filamentos", href: "#" },
    { name: "Accesorios", href: "#" },
    { name: "Ofertas", href: "#", highlight: true },
]

const categories = [
    { name: "Filamentos", icon: Palette, href: "#", description: "PLA, PETG, ABS, TPU", color: "from-purple-500 to-purple-600", items: 45 },
    { name: "Impresoras 3D", icon: Printer, href: "#", description: "FDM y Resina", color: "from-cyan-500 to-cyan-600", items: 12 },
    { name: "Repuestos", icon: Settings, href: "#", description: "Boquillas, motores, correas", color: "from-orange-500 to-orange-600", items: 38 },
    { name: "Accesorios", icon: Package, href: "#", description: "Herramientas y más", color: "from-pink-500 to-pink-600", items: 24 },
]

const features = [
    { icon: Truck, title: "Envío Gratis", desc: "En compras +$50.000" },
    { icon: CreditCard, title: "12 Cuotas", desc: "Sin interés" },
    { icon: Shield, title: "Garantía", desc: "12 meses" },
    { icon: Headphones, title: "Soporte", desc: "Atención 24/7" },
]

// ============================================
// COMPONENTES
// ============================================

function FloatingWhatsApp() {
    return (
        <motion.a
            href={`https://wa.me/${CONFIG.contact.whatsapp}`}
            target="_blank"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
    )
}

function CountdownBanner() {
    const [time, setTime] = useState({ days: 3, hours: 12, minutes: 45, seconds: 30 })

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => {
                let { days, hours, minutes, seconds } = prev
                seconds--
                if (seconds < 0) { seconds = 59; minutes-- }
                if (minutes < 0) { minutes = 59; hours-- }
                if (hours < 0) { hours = 23; days-- }
                if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
                return { days, hours, minutes, seconds }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange text-white py-3">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">OFERTAS ESPECIALES</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Termina en:</span>
                    <div className="flex gap-1">
                        {[
                            { v: time.days, l: "d" },
                            { v: time.hours, l: "h" },
                            { v: time.minutes, l: "m" },
                            { v: time.seconds, l: "s" },
                        ].map((t, i) => (
                            <span key={i} className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                                {String(t.v).padStart(2, "0")}{t.l}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmptyProducts() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center"
        >
            <div className="w-24 h-24 bg-gradient-to-br from-grana-purple/10 to-grana-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-grana-purple" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Próximamente</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Estamos preparando productos increíbles para vos. ¡Volvé pronto!
            </p>
        </motion.div>
    )
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================

export default function Tienda() {
    const [mobileMenu, setMobileMenu] = useState(false)
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Countdown Banner */}
            <CountdownBanner />

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm dark:shadow-gray-800/30 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Mobile menu button */}
                        <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileMenu(!mobileMenu)}>
                            {mobileMenu ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-900 dark:text-white" />}
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-grana-purple to-grana-cyan rounded-xl flex items-center justify-center">
                                <Printer className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight hidden sm:block">
                                <span className="text-grana-purple">Grana</span>
                                <span className="text-gray-900 dark:text-white">3D</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${link.highlight
                                        ? "text-grana-purple bg-grana-purple/5 hover:bg-grana-purple/10"
                                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full px-4 py-2.5 pl-11 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 dark:focus:ring-grana-cyan/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link to="#" className="hidden sm:flex p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                            <Link to="#" className="hidden sm:flex p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Link to="#" className="relative p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-4 h-4 bg-grana-purple text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden border-t border-gray-100 dark:border-gray-800"
                        >
                            <nav className="px-4 py-4 space-y-1 bg-white dark:bg-gray-900">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="block px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setMobileMenu(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="absolute top-0 left-1/4 w-96 h-96 bg-grana-purple/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-grana-cyan/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-6">
                                <Award className="w-4 h-4 text-grana-orange" />
                                Tienda Oficial Argentina
                            </span>
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                                Todo para tu
                                <span className="block bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange bg-clip-text text-transparent">
                                    Impresión 3D
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-lg">
                                Impresoras, filamentos, accesorios y repuestos de las mejores marcas. Envío a todo el país.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#productos" className="inline-flex items-center gap-2 px-6 py-3 bg-grana-purple text-white font-medium rounded-xl hover:bg-grana-purple/90 transition-colors">
                                    Ver Productos
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                                    Contactar
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="aspect-square relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-grana-purple/20 to-grana-cyan/20 rounded-3xl" />
                                <div className="absolute inset-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                                    <Printer className="w-32 h-32 text-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-grana-purple/10 to-grana-cyan/10 dark:from-grana-purple/20 dark:to-grana-cyan/20 rounded-xl flex items-center justify-center shrink-0">
                                    <f.icon className="w-6 h-6 text-grana-purple" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{f.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 lg:py-16 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Categorías</h2>
                        <p className="text-gray-500 dark:text-gray-400">Explorá nuestra selección de productos</p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <a
                                    href={cat.href}
                                    className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all"
                                >
                                    <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <cat.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{cat.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{cat.description}</p>
                                    <span className="text-xs text-grana-purple font-medium">{cat.items} productos</span>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products */}
            <section id="productos" className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Productos Destacados</h2>
                            <p className="text-gray-500 dark:text-gray-400">Los favoritos de nuestros clientes</p>
                        </div>
                        <a href="#" className="hidden sm:flex items-center gap-2 text-grana-purple font-medium hover:underline">
                            Ver todos <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <EmptyProducts />
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative overflow-hidden bg-gradient-to-r from-grana-purple to-grana-cyan rounded-3xl p-8 lg:p-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-grana-orange/20 rounded-full blur-3xl" />

                        <div className="relative flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                    ¿Tenés dudas sobre qué comprar?
                                </h2>
                                <p className="text-white/80 text-lg mb-6">
                                    Nuestro equipo te asesora para elegir el producto ideal para tu proyecto.
                                </p>
                                <a
                                    href={`https://wa.me/${CONFIG.contact.whatsapp}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-grana-purple font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Contactar por WhatsApp
                                </a>
                            </div>
                            <div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Headphones className="w-20 h-20 text-white/40" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-black text-white py-12 lg:py-16 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 lg:col-span-1">
                            <Link to="/" className="inline-flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-grana-purple to-grana-cyan rounded-xl flex items-center justify-center">
                                    <Printer className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">
                                    <span className="text-grana-purple">Grana</span>3D
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm mb-4">{CONFIG.tagline}</p>
                            <div className="flex gap-3">
                                <a href={CONFIG.social.facebook} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href={CONFIG.social.instagram} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Tienda</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Impresoras</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Filamentos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Accesorios</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Ofertas</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Ayuda</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contacto</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contact.email}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contact.phone}
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contact.location}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} {CONFIG.storeName}. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* WhatsApp Float */}
            <FloatingWhatsApp />
        </div>
    )
}
