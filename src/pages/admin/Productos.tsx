import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Search, Edit, Trash2, X, Save, Image as ImageIcon,
    Package, Filter, MoreVertical, Eye, EyeOff, Star, Upload
} from 'lucide-react'
import api from '../../api/client'

interface Categoria {
    id: string
    nombre: string
    slug: string
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
    activo: boolean
    categoriaId: string
    categoria: Categoria
    createdAt: string
}

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState('')

    // Modal
    const [modalAbierto, setModalAbierto] = useState(false)
    const [productoEditando, setProductoEditando] = useState<Producto | null>(null)
    const [guardando, setGuardando] = useState(false)

    // Formulario
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        descripcionCorta: '',
        precio: 0,
        precioOferta: 0,
        stock: 0,
        imagenes: [] as string[],
        destacado: false,
        nuevo: true,
        categoriaId: ''
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        cargarDatos()
    }, [])

    const cargarDatos = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/admin/productos'),
                api.get('/admin/categorias')
            ])
            setProductos(prodRes.data)
            setCategorias(catRes.data)
        } catch (error) {
            console.error('Error cargando datos:', error)
        } finally {
            setLoading(false)
        }
    }

    const abrirModal = (producto?: Producto) => {
        if (producto) {
            setProductoEditando(producto)
            setForm({
                nombre: producto.nombre,
                descripcion: producto.descripcion || '',
                descripcionCorta: producto.descripcionCorta || '',
                precio: producto.precio,
                precioOferta: producto.precioOferta || 0,
                stock: producto.stock,
                imagenes: producto.imagenes || [],
                destacado: producto.destacado,
                nuevo: producto.nuevo,
                categoriaId: producto.categoriaId
            })
        } else {
            setProductoEditando(null)
            setForm({
                nombre: '',
                descripcion: '',
                descripcionCorta: '',
                precio: 0,
                precioOferta: 0,
                stock: 0,
                imagenes: [],
                destacado: false,
                nuevo: true,
                categoriaId: categorias[0]?.id || ''
            })
        }
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setProductoEditando(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64 = event.target?.result as string
                setForm(prev => ({
                    ...prev,
                    imagenes: [...prev.imagenes, base64]
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    const eliminarImagen = (index: number) => {
        setForm(prev => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }))
    }

    const guardarProducto = async () => {
        if (!form.nombre || !form.precio || !form.categoriaId) {
            alert('Por favor completa los campos obligatorios')
            return
        }

        setGuardando(true)
        try {
            if (productoEditando) {
                await api.put(`/admin/productos/${productoEditando.id}`, form)
            } else {
                await api.post('/admin/productos', form)
            }
            await cargarDatos()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando producto:', error)
            alert('Error al guardar el producto')
        } finally {
            setGuardando(false)
        }
    }

    const eliminarProducto = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return

        try {
            await api.delete(`/admin/productos/${id}`)
            await cargarDatos()
        } catch (error) {
            console.error('Error eliminando producto:', error)
        }
    }

    const toggleActivo = async (producto: Producto) => {
        try {
            await api.put(`/admin/productos/${producto.id}`, { activo: !producto.activo })
            await cargarDatos()
        } catch (error) {
            console.error('Error actualizando producto:', error)
        }
    }

    const toggleDestacado = async (producto: Producto) => {
        try {
            await api.put(`/admin/productos/${producto.id}`, { destacado: !producto.destacado })
            await cargarDatos()
        } catch (error) {
            console.error('Error actualizando producto:', error)
        }
    }

    const productosFiltrados = productos.filter(p => {
        const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        const matchCategoria = !filtroCategoria || p.categoriaId === filtroCategoria
        return matchBusqueda && matchCategoria
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500">{productos.length} productos en total</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 appearance-none bg-white"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Lista de Productos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay productos</h3>
                        <p className="text-gray-500">Crea tu primer producto para empezar a vender</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Producto</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Categoría</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Precio</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Estado</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productosFiltrados.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    {producto.imagenes[0] ? (
                                                        <img src={producto.imagenes[0]} alt={producto.nombre} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{producto.descripcionCorta}</p>
                                                </div>
                                                {producto.destacado && (
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                {producto.categoria?.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">${producto.precio.toLocaleString()}</p>
                                                {producto.precioOferta && (
                                                    <p className="text-sm text-green-600">${producto.precioOferta.toLocaleString()}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${producto.stock > 10 ? 'bg-green-100 text-green-700' :
                                                    producto.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {producto.stock} unidades
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActivo(producto)}
                                                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition ${producto.activo
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {producto.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {producto.activo ? 'Activo' : 'Oculto'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleDestacado(producto)}
                                                    className={`p-2 rounded-lg transition ${producto.destacado ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-400'
                                                        }`}
                                                    title="Destacar"
                                                >
                                                    <Star className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => abrirModal(producto)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => eliminarProducto(producto.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Crear/Editar */}
            <AnimatePresence>
                {modalAbierto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={cerrarModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Imágenes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Imágenes del Producto
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {form.imagenes.map((img, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => eliminarImagen(i)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-grana-purple hover:text-grana-purple transition"
                                        >
                                            <Upload className="w-6 h-6" />
                                            <span className="text-xs mt-1">Subir</span>
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nombre}
                                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                        placeholder="Ej: Figura Dragon Ball Z - Goku"
                                    />
                                </div>

                                {/* Descripción Corta */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción Corta
                                    </label>
                                    <input
                                        type="text"
                                        value={form.descripcionCorta}
                                        onChange={(e) => setForm({ ...form, descripcionCorta: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                        placeholder="Breve descripción para la tarjeta del producto"
                                    />
                                </div>

                                {/* Descripción Completa */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción Completa
                                    </label>
                                    <textarea
                                        value={form.descripcion}
                                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple resize-none"
                                        placeholder="Descripción detallada del producto..."
                                    />
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría *
                                    </label>
                                    <select
                                        value={form.categoriaId}
                                        onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 appearance-none bg-white"
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Precios */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio *
                                        </label>
                                        <input
                                            type="number"
                                            value={form.precio}
                                            onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio Oferta
                                        </label>
                                        <input
                                            type="number"
                                            value={form.precioOferta}
                                            onChange={(e) => setForm({ ...form, precioOferta: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Disponible
                                    </label>
                                    <input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Opciones */}
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.destacado}
                                            onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-grana-purple focus:ring-grana-purple"
                                        />
                                        <span className="text-sm text-gray-700">Producto Destacado</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.nuevo}
                                            onChange={(e) => setForm({ ...form, nuevo: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-grana-purple focus:ring-grana-purple"
                                        />
                                        <span className="text-sm text-gray-700">Marcar como Nuevo</span>
                                    </label>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={cerrarModal}
                                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarProducto}
                                    disabled={guardando}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {guardando ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
