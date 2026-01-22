import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ChevronRight, Phone, Mail, MapPin, Truck, CreditCard, Shield,
    Package, Zap, Award, Headphones, Sparkles, Star,
    Facebook, Instagram, MessageCircle, ArrowRight, ShoppingCart, Image as ImageIcon
} from 'lucide-react'
import Header from '../components/Header'
import HeroSlider from '../components/HeroSlider'
import CarritoDrawer from '../components/CarritoDrawer'
import ModalUsuario from '../components/ModalUsuario'
import { useCarrito } from '../context/CarritoContext'
import api from '../api/client'

// ============================================
// TIPOS
// ============================================

interface Categoria {
    id: string
    nombre: string
    slug: string
    descripcion: string
    imagen: string | null
    color: string
    _count?: { productos: number }
}

interface Producto {
    id: string
    nombre: string
    slug: string
    descripcion: string
    descripcionCorta: string
    precio: number
    precioOferta: number | null
    stock: number
    imagenes: string[]
    destacado: boolean
    nuevo: boolean
    categoria: { id: string; nombre: string }
}

interface Config {
    nombre_tienda?: string
    eslogan?: string
    descripcion?: string
    email?: string
    telefono?: string
    whatsapp?: string
    direccion?: string
    instagram?: string
    facebook?: string
    envio_gratis_minimo?: string
}

// ============================================
// COMPONENTES
// ============================================

const caracteristicas = [
    { icono: Truck, titulo: "Envío a Todo el País", desc: "Llegamos a donde estés" },
    { icono: CreditCard, titulo: "Pagos Seguros", desc: "Múltiples medios de pago" },
    { icono: Shield, titulo: "Garantía", desc: "Productos de calidad" },
    { icono: Headphones, titulo: "Atención Personalizada", desc: "Te asesoramos" },
]

function BotonWhatsApp({ whatsapp }: { whatsapp: string }) {
    return (
        <motion.a
            href={`https://wa.me/${whatsapp}`}
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

function BannerOfertas({ minimo }: { minimo: string }) {
    return (
        <div className="bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange text-white py-2.5">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                <span className="font-medium">¡Envío gratis en compras mayores a ${parseInt(minimo || '50000').toLocaleString()}!</span>
            </div>
        </div>
    )
}

function ProductCard({ producto }: { producto: Producto }) {
    const { agregarProducto } = useCarrito()

    const precio = producto.precioOferta || producto.precio
    const tieneOferta = producto.precioOferta && producto.precioOferta < producto.precio

    const handleAgregar = (e: React.MouseEvent) => {
        e.preventDefault() // Evitar navegación al hacer click en agregar
        agregarProducto({
            id: producto.id,
            nombre: producto.nombre,
            precio: precio,
            imagen: producto.imagenes[0] || ''
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
            <Link to={`/producto/${producto.slug}`} className="block">
                {/* Imagen */}
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {producto.imagenes[0] ? (
                        <img
                            src={producto.imagenes[0]}
                            alt={producto.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-300" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {producto.nuevo && (
                            <span className="px-2 py-1 bg-grana-cyan text-white text-xs font-medium rounded-full">
                                Nuevo
                            </span>
                        )}
                        {tieneOferta && (
                            <span className="px-2 py-1 bg-grana-orange text-white text-xs font-medium rounded-full">
                                Oferta
                            </span>
                        )}
                    </div>

                    {producto.destacado && (
                        <div className="absolute top-3 right-3">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                    )}

                    {/* Quick Add */}
                    <button
                        onClick={handleAgregar}
                        className="absolute bottom-3 right-3 w-10 h-10 bg-grana-purple text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:bg-grana-purple/90 z-10"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>

                {/* Info */}
                <div className="p-4">
                    <span className="text-xs text-grana-purple font-medium">{producto.categoria?.nombre}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-2">{producto.nombre}</h3>
                    {producto.descripcionCorta && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{producto.descripcionCorta}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${precio.toLocaleString()}
                        </span>
                        {tieneOferta && (
                            <span className="text-sm text-gray-400 line-through">
                                ${producto.precio.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAgregar}
                        className="w-full mt-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-grana-purple hover:text-white transition-colors"
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </Link>
        </motion.div>
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
    const [config, setConfig] = useState<Config>({})
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [productosDestacados, setProductosDestacados] = useState<Producto[]>([])
    const [todosProductos, setTodosProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [configRes, catRes, destRes, prodRes] = await Promise.all([
                    api.get('/config'),
                    api.get('/categorias'),
                    api.get('/productos?destacados=true&limite=4'),
                    api.get('/productos?limite=8')
                ])
                setConfig(configRes.data)
                setCategorias(catRes.data)
                setProductosDestacados(destRes.data)
                setTodosProductos(prodRes.data)
            } catch (error) {
                console.error('Error cargando datos:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    const whatsapp = config.whatsapp || '5491112345678'

    const iconosCategorias: Record<string, any> = {
        'figuras': Sparkles,
        'decoracion': Package,
        'regalos': Star,
        'accesorios': Zap
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Banner Ofertas */}
            <BannerOfertas minimo={config.envio_gratis_minimo || '50000'} />

            {/* Header */}
            <Header />

            {/* Hero / Slider */}
            <HeroSlider config={config} />

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
                        {categorias.map((cat, i) => {
                            const Icono = iconosCategorias[cat.slug] || Sparkles
                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <a
                                        href={`#productos-${cat.slug}`}
                                        className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all"
                                    >
                                        <div className={`w-14 h-14 bg-gradient-to-br ${cat.color || 'from-purple-500 to-purple-600'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden`}>
                                            {cat.imagen ? (
                                                <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover" />
                                            ) : (
                                                <Icono className="w-7 h-7 text-white" />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{cat.nombre}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{cat.descripcion || `${cat._count?.productos || 0} productos`}</p>
                                    </a>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Productos Destacados */}
            {productosDestacados.length > 0 && (
                <section className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">⭐ Productos Destacados</h2>
                                <p className="text-gray-500 dark:text-gray-400">Los favoritos de nuestros clientes</p>
                            </div>
                            <a href="#productos" className="hidden sm:flex items-center gap-2 text-grana-purple font-medium hover:underline">
                                Ver todos <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            {productosDestacados.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Todos los Productos */}
            <section id="productos" className="py-12 lg:py-16 bg-white dark:bg-gray-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Todos los Productos</h2>
                            <p className="text-gray-500 dark:text-gray-400">Explorá nuestro catálogo completo</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
                            </div>
                        ) : todosProductos.length > 0 ? (
                            todosProductos.map((producto) => (
                                <ProductCard key={producto.id} producto={producto} />
                            ))
                        ) : (
                            <ProductosVacios />
                        )}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="contacto" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
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
                                    href={`https://wa.me/${whatsapp}`}
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
                                    <span className="text-grana-purple">{config.nombre_tienda?.split('3D')[0] || 'Grana'}</span>3D
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm mb-4">{config.descripcion || 'Productos impresos en 3D'}</p>
                            <div className="flex gap-3">
                                {config.facebook && (
                                    <a href={config.facebook} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {config.instagram && (
                                    <a href={config.instagram} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Categorías</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                {categorias.slice(0, 4).map(cat => (
                                    <li key={cat.id}><a href={`#productos-${cat.slug}`} className="hover:text-white transition-colors">{cat.nombre}</a></li>
                                ))}
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
                                {config.email && (
                                    <li className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-grana-cyan" />
                                        {config.email}
                                    </li>
                                )}
                                {config.telefono && (
                                    <li className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-grana-cyan" />
                                        {config.telefono}
                                    </li>
                                )}
                                {config.direccion && (
                                    <li className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-grana-cyan" />
                                        {config.direccion}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} {config.nombre_tienda || 'Grana3D'}. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* Componentes Flotantes */}
            <BotonWhatsApp whatsapp={whatsapp} />
            <CarritoDrawer />
            <ModalUsuario />
        </div>
    )
}
