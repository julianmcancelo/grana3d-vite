import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, ChevronRight, ArrowRight, Sparkles, Award, MessageCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/client'

interface Banner {
    id: string
    titulo: string
    subtitulo: string
    descripcion: string
    imagen: string
    imagenMovil: string
    textoBoton: string
    linkBoton: string
    textoBoton2: string
    linkBoton2: string
    colorFondo: string
    colorTexto: string
    overlay: boolean
}

interface HeroSliderProps {
    config?: any
}

export default function HeroSlider({ config = {} }: HeroSliderProps) {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const cargarBanners = async () => {
            try {
                const { data } = await api.get('/banners')
                setBanners(data)
            } catch (error) {
                console.error('Error cargando banners:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarBanners()
    }, [])

    useEffect(() => {
        if (banners.length <= 1) return
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [banners.length])

    const next = () => setCurrent(prev => (prev + 1) % banners.length)
    const prev = () => setCurrent(prev => (prev - 1 + banners.length) % banners.length)

    if (loading) return <div className="h-[500px] bg-gray-100 dark:bg-gray-900 animate-pulse" />

    // FALLBACK: Si no hay banners, mostrar Hero estático
    if (banners.length === 0) {
        return (
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
                                {config.eslogan || 'Creaciones únicas'}
                                <span className="block bg-gradient-to-r from-grana-purple via-grana-cyan to-grana-orange bg-clip-text text-transparent">
                                    Impresas en 3D
                                </span>
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-lg">
                                {config.descripcion || 'Figuras, decoración, regalos personalizados y accesorios únicos. Diseños exclusivos impresos con la mejor calidad.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#productos" className="inline-flex items-center gap-2 px-6 py-3 bg-grana-purple text-white font-medium rounded-xl hover:bg-grana-purple/90 transition-colors">
                                    Ver Productos
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <a href={`https://wa.me/${config.whatsapp || '5491112345678'}`} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
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
        )
    }

    return (
        <div className="relative h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0">
                        <img
                            src={window.innerWidth < 768 && banners[current].imagenMovil ? banners[current].imagenMovil : banners[current].imagen}
                            alt={banners[current].titulo}
                            className="w-full h-full object-cover"
                        />
                        {banners[current].overlay && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
                        <div className="max-w-xl text-white">
                            {banners[current].subtitulo && (
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium mb-4"
                                >
                                    {banners[current].subtitulo}
                                </motion.span>
                            )}

                            <motion.h1
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-4xl lg:text-6xl font-bold leading-tight mb-4"
                                style={{ color: banners[current].colorTexto || '#ffffff' }}
                            >
                                {banners[current].titulo}
                            </motion.h1>

                            {banners[current].descripcion && (
                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-lg text-gray-200 mb-8 max-w-lg"
                                >
                                    {banners[current].descripcion}
                                </motion.p>
                            )}

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                {banners[current].textoBoton && (
                                    <Link
                                        to={banners[current].linkBoton}
                                        className="px-8 py-4 bg-grana-purple text-white font-bold rounded-xl hover:bg-grana-purple/90 transition shadow-lg shadow-grana-purple/25 flex items-center gap-2"
                                    >
                                        {banners[current].textoBoton}
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                                {banners[current].textoBoton2 && (
                                    <Link
                                        to={banners[current].linkBoton2}
                                        className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition backdrop-blur-md"
                                    >
                                        {banners[current].textoBoton2}
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controles Navigation */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
