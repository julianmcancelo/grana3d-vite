import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ChevronRight, Phone, Mail, MapPin, Truck, CreditCard, Shield,
    Package, Zap, Award, Headphones, Sparkles, Gift, Home as HomeIcon, Star,
    Facebook, Instagram, MessageCircle, ArrowRight
} from 'lucide-react'
import Header from '../components/Header'
import CarritoDrawer from '../components/CarritoDrawer'
import ModalUsuario from '../components/ModalUsuario'

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
    nombreTienda: "Grana3D",
    eslogan: "Productos Impresos en 3D",
    descripcion: "Figuras, decoración y accesorios únicos impresos en 3D",
    contacto: {
        email: "hola@grana3d.com.ar",
        telefono: "+54 11 1234-5678",
        whatsapp: "5491112345678",
        ubicacion: "Buenos Aires, Argentina"
    },
    social: {
        facebook: "#",
        instagram: "#"
    }
}

const categorias = [
    { nombre: "Figuras", icono: Sparkles, href: "#", descripcion: "Personajes y coleccionables", color: "from-purple-500 to-purple-600" },
    { nombre: "Decoración", icono: HomeIcon, href: "#", descripcion: "Para tu hogar u oficina", color: "from-cyan-500 to-cyan-600" },
    { nombre: "Regalos", icono: Gift, href: "#", descripcion: "Personalizados y únicos", color: "from-orange-500 to-orange-600" },
    { nombre: "Accesorios", icono: Star, href: "#", descripcion: "Llaveros, soportes y más", color: "from-pink-500 to-pink-600" },
]

const caracteristicas = [
    { icono: Truck, titulo: "Envío a Todo el País", desc: "Llegamos a donde estés" },
    { icono: CreditCard, titulo: "Pagos Seguros", desc: "Múltiples medios de pago" },
    { icono: Shield, titulo: "Garantía", desc: "Productos de calidad" },
    { icono: Headphones, titulo: "Atención Personalizada", desc: "Te asesoramos" },
]

// ============================================
// COMPONENTES
// ============================================

function BotonWhatsApp() {
    return (
        <motion.a
            href={`https://wa.me/${CONFIG.contacto.whatsapp}`}
            target="_blank"
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
    )
}

function BannerOfertas() {
    return (
        <div className="bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange text-white py-2.5">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                <span className="font-medium">¡Envío gratis en compras mayores a $50.000!</span>
            </div>
        </div>
    )
}

function ProductosVacios() {
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
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Banner Ofertas */}
            <BannerOfertas />

            {/* Header */}
            <Header />

            {/* Hero */}
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
                                Productos Únicos Hechos en Argentina
                            </span>
                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                                Creaciones únicas
                                <span className="block bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange bg-clip-text text-transparent">
                                    Impresas en 3D
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-lg">
                                Figuras, decoración, regalos personalizados y accesorios únicos. Diseños exclusivos impresos con la mejor calidad.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#categorias" className="inline-flex items-center gap-2 px-6 py-3 bg-grana-purple text-white font-medium rounded-xl hover:bg-grana-purple/90 transition-colors">
                                    Ver Productos
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <a href={`https://wa.me/${CONFIG.contacto.whatsapp}`} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                                    <MessageCircle className="w-4 h-4" />
                                    Contactanos
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
                                    <Sparkles className="w-32 h-32 text-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Características */}
            <section className="py-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                        {caracteristicas.map((c, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-grana-purple/10 to-grana-cyan/10 dark:from-grana-purple/20 dark:to-grana-cyan/20 rounded-xl flex items-center justify-center shrink-0">
                                    <c.icono className="w-6 h-6 text-grana-purple" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{c.titulo}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categorías */}
            <section id="categorias" className="py-12 lg:py-16 bg-white dark:bg-gray-950 transition-colors">
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
                        {categorias.map((cat, i) => (
                            <motion.div
                                key={cat.nombre}
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
                                        <cat.icono className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{cat.nombre}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.descripcion}</p>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Productos */}
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
                        <ProductosVacios />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="contacto" className="py-16 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative overflow-hidden bg-gradient-to-r from-grana-purple to-grana-cyan rounded-3xl p-8 lg:p-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-grana-orange/20 rounded-full blur-3xl" />

                        <div className="relative flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex-1 text-center lg:text-left">
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                    ¿Querés algo personalizado?
                                </h2>
                                <p className="text-white/80 text-lg mb-6">
                                    Diseñamos e imprimimos lo que necesites. Contanos tu idea y la hacemos realidad.
                                </p>
                                <a
                                    href={`https://wa.me/${CONFIG.contacto.whatsapp}`}
                                    target="_blank"
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
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">
                                    <span className="text-grana-purple">Grana</span>3D
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm mb-4">{CONFIG.descripcion}</p>
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
                            <h4 className="font-semibold mb-4">Categorías</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Figuras</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Decoración</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Regalos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Accesorios</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Información</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Envíos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contacto</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contacto.email}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contacto.telefono}
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-grana-cyan" />
                                    {CONFIG.contacto.ubicacion}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} {CONFIG.nombreTienda}. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* Componentes Flotantes */}
            <BotonWhatsApp />
            <CarritoDrawer />
            <ModalUsuario />
        </div>
    )
}
