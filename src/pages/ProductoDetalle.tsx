import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart, Heart, ArrowLeft, Truck, Shield, Share2,
    Check, ChevronRight, Star, Minus, Plus, Box
} from 'lucide-react'
import Header from '../components/Header'
import CarritoDrawer from '../components/CarritoDrawer'
import { useCarrito } from '../context/CarritoContext'
import api from '../api/client'

interface Producto {
    id: string
    nombre: string
    slug: string
    descripcion: string | null
    descripcionCorta: string | null
    precio: number
    precioOferta: number | null
    stock: number
    imagenes: string[]
    categoria: { nombre: string; slug: string }
    dimensiones: string | null
    material: string | null
    color: string | null
    peso: number | null
}

const COLORES_DISPONIBLES = [
    { nombre: 'Blanco', valor: '#ffffff', clase: 'bg-white border-gray-200' },
    { nombre: 'Negro', valor: '#000000', clase: 'bg-black border-black' },
    { nombre: 'Rojo', valor: '#ef4444', clase: 'bg-red-500 border-red-500' },
    { nombre: 'Azul', valor: '#3b82f6', clase: 'bg-blue-500 border-blue-500' },
    { nombre: 'Gris', valor: '#6b7280', clase: 'bg-gray-500 border-gray-500' },
    { nombre: 'Verde', valor: '#22c55e', clase: 'bg-green-500 border-green-500' },
    { nombre: 'Naranja', valor: '#f97316', clase: 'bg-orange-500 border-orange-500' }
]

export default function ProductoDetalle() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [producto, setProducto] = useState<Producto | null>(null)
    const [loading, setLoading] = useState(true)
    const [imagenActiva, setImagenActiva] = useState(0)
    const [cantidad, setCantidad] = useState(1)
    const [colorSeleccionado, setColorSeleccionado] = useState(COLORES_DISPONIBLES[0])
    const { agregarProducto, abrirCarrito } = useCarrito()

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const { data } = await api.get(`/productos/slug/${slug}`)
                setProducto(data)
            } catch (error) {
                console.error('Error cargando producto:', error)
                // navigate('/tienda') // Opcional: redirigir si falla
            } finally {
                setLoading(false)
            }
        }
        cargarProducto()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
            </div>
        )
    }

    if (!producto) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Producto no encontrado</h2>
                <Link to="/tienda" className="text-grana-purple hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la tienda
                </Link>
            </div>
        )
    }

    const precio = producto.precioOferta || producto.precio
    const porcentajeDescuento = producto.precioOferta ? Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100) : 0

    const handleAgregar = () => {
        agregarProducto({
            id: producto.id,
            nombre: producto.nombre,
            precio: precio,
            imagen: producto.imagenes[0] || '',
            cantidad: cantidad,
            variante: colorSeleccionado.nombre // Hack: pasamos color como variante si el contexto lo soporta, sino solo informativo
        })
        abrirCarrito()
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
            <Header />
            <br className="hidden lg:block" />

            <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <Link to="/tienda" className="inline-flex items-center gap-2 text-gray-500 hover:text-grana-purple mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Tienda
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Galería de Imágenes */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden relative group">
                            {producto.imagenes[imagenActiva] ? (
                                <img
                                    src={producto.imagenes[imagenActiva]}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Box className="w-20 h-20 text-gray-300" />
                                </div>
                            )}
                            {porcentajeDescuento > 0 && (
                                <div className="absolute top-4 left-4 bg-grana-orange text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    -{porcentajeDescuento}% OFF
                                </div>
                            )}
                            <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {producto.imagenes.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {producto.imagenes.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImagenActiva(i)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${imagenActiva === i ? 'border-grana-purple' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del Producto */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-grana-purple font-medium text-sm bg-grana-purple/5 px-2 py-1 rounded-md">
                                {producto.categoria.nombre}
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {producto.nombre}
                        </h1>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                ${precio.toLocaleString()}
                            </span>
                            {producto.precioOferta && (
                                <span className="text-xl text-gray-400 line-through mb-1">
                                    ${producto.precio.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                            {producto.descripcionCorta || producto.descripcion}
                        </p>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-8" />

                        {/* Selección de Color */}
                        <div className="mb-8">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                                Color Seleccionado: <span className="text-gray-500 dark:text-gray-400 font-normal">{colorSeleccionado.nombre}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {COLORES_DISPONIBLES.map((color) => (
                                    <button
                                        key={color.nombre}
                                        onClick={() => setColorSeleccionado(color)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-110 ${colorSeleccionado.nombre === color.nombre ? 'ring-2 ring-offset-2 ring-grana-purple border-transparent' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color.valor }}
                                        title={color.nombre}
                                    >
                                        {colorSeleccionado.nombre === color.nombre && (
                                            <Check className={`w-5 h-5 ${color.nombre === 'Blanco' ? 'text-black' : 'text-white'}`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cantidad y Agregar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl">
                                <button
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    className="p-3 hover:text-grana-purple transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{cantidad}</span>
                                <button
                                    onClick={() => setCantidad(Math.min(10, cantidad + 1))}
                                    className="p-3 hover:text-grana-purple transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleAgregar}
                                className="flex-1 bg-grana-purple text-white py-3 px-8 rounded-xl font-bold text-lg hover:bg-grana-purple/90 transition-all shadow-lg shadow-grana-purple/25 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                Agregar al Carrito
                            </button>
                        </div>

                        {/* Características Extra */}
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Truck className="w-5 h-5 text-grana-purple" />
                                <span>Envío a todo el país</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Shield className="w-5 h-5 text-grana-cyan" />
                                <span>Garantía de calidad</span>
                            </div>
                        </div>

                        {/* Descripción Completa y Especificaciones */}
                        <div className="space-y-6">
                            {(producto.descripcion || producto.dimensiones || producto.material) && (
                                <div className="prose prose-gray dark:prose-invert max-w-none">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Descripción Detallada</h3>
                                    <p className="whitespace-pre-line leading-relaxed">
                                        {producto.descripcion || producto.descripcionCorta}
                                    </p>

                                    {(producto.dimensiones || producto.material) && (
                                        <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Especificaciones Técnicas</h4>
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                                                {producto.dimensiones && (
                                                    <div>
                                                        <dt className="text-xs uppercase tracking-wider text-gray-500 mb-1">Dimensiones</dt>
                                                        <dd className="font-medium text-gray-900 dark:text-white">{producto.dimensiones}</dd>
                                                    </div>
                                                )}
                                                {producto.material && (
                                                    <div>
                                                        <dt className="text-xs uppercase tracking-wider text-gray-500 mb-1">Material</dt>
                                                        <dd className="font-medium text-gray-900 dark:text-white">{producto.material}</dd>
                                                    </div>
                                                )}
                                                {producto.peso && (
                                                    <div>
                                                        <dt className="text-xs uppercase tracking-wider text-gray-500 mb-1">Peso</dt>
                                                        <dd className="font-medium text-gray-900 dark:text-white">{producto.peso} gr</dd>
                                                    </div>
                                                )}
                                            </dl>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <CarritoDrawer />
        </div>
    )
}
