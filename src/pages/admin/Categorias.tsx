import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Edit, Trash2, X, Save, FolderTree, Upload,
    ChevronRight, Eye, EyeOff, GripVertical
} from 'lucide-react'
import api from '../../api/client'

interface Categoria {
    id: string
    nombre: string
    slug: string
    descripcion: string
    imagen: string | null
    icono: string
    color: string
    orden: number
    activo: boolean
    _count?: { productos: number }
}

export default function Categorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)

    // Modal
    const [modalAbierto, setModalAbierto] = useState(false)
    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
    const [guardando, setGuardando] = useState(false)

    // Formulario
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        imagen: '',
        icono: 'Sparkles',
        color: 'from-purple-500 to-purple-600',
        orden: 0
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const iconos = ['Sparkles', 'Home', 'Gift', 'Star', 'Heart', 'Zap', 'Award', 'Package', 'Box', 'Puzzle']
    const colores = [
        { valor: 'from-purple-500 to-purple-600', nombre: 'Morado' },
        { valor: 'from-cyan-500 to-cyan-600', nombre: 'Cian' },
        { valor: 'from-orange-500 to-orange-600', nombre: 'Naranja' },
        { valor: 'from-pink-500 to-pink-600', nombre: 'Rosa' },
        { valor: 'from-green-500 to-green-600', nombre: 'Verde' },
        { valor: 'from-blue-500 to-blue-600', nombre: 'Azul' },
        { valor: 'from-red-500 to-red-600', nombre: 'Rojo' },
        { valor: 'from-yellow-500 to-yellow-600', nombre: 'Amarillo' },
    ]

    useEffect(() => {
        cargarCategorias()
    }, [])

    const cargarCategorias = async () => {
        try {
            const { data } = await api.get('/admin/categorias')
            setCategorias(data)
        } catch (error) {
            console.error('Error cargando categorías:', error)
        } finally {
            setLoading(false)
        }
    }

    const abrirModal = (categoria?: Categoria) => {
        if (categoria) {
            setCategoriaEditando(categoria)
            setForm({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion || '',
                imagen: categoria.imagen || '',
                icono: categoria.icono || 'Sparkles',
                color: categoria.color || 'from-purple-500 to-purple-600',
                orden: categoria.orden
            })
        } else {
            setCategoriaEditando(null)
            setForm({
                nombre: '',
                descripcion: '',
                imagen: '',
                icono: 'Sparkles',
                color: 'from-purple-500 to-purple-600',
                orden: categorias.length
            })
        }
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setCategoriaEditando(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setForm(prev => ({ ...prev, imagen: event.target?.result as string }))
        }
        reader.readAsDataURL(file)
    }

    const guardarCategoria = async () => {
        if (!form.nombre) {
            alert('El nombre es obligatorio')
            return
        }

        setGuardando(true)
        try {
            if (categoriaEditando) {
                await api.put(`/admin/categorias/${categoriaEditando.id}`, form)
            } else {
                await api.post('/admin/categorias', form)
            }
            await cargarCategorias()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando categoría:', error)
            alert('Error al guardar la categoría')
        } finally {
            setGuardando(false)
        }
    }

    const eliminarCategoria = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return

        try {
            await api.delete(`/admin/categorias/${id}`)
            await cargarCategorias()
        } catch (error) {
            console.error('Error eliminando categoría:', error)
            alert('No se puede eliminar una categoría con productos')
        }
    }

    const toggleActivo = async (categoria: Categoria) => {
        try {
            await api.put(`/admin/categorias/${categoria.id}`, { activo: !categoria.activo })
            await cargarCategorias()
        } catch (error) {
            console.error('Error actualizando categoría:', error)
        }
    }

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
                    <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
                    <p className="text-gray-500">{categorias.length} categorías en total</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </button>
            </div>

            {/* Lista de Categorías */}
            <div className="grid gap-4">
                {categorias.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
                        <FolderTree className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay categorías</h3>
                        <p className="text-gray-500">Crea tu primera categoría para organizar los productos</p>
                    </div>
                ) : (
                    categorias.map((categoria, index) => (
                        <motion.div
                            key={categoria.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
                        >
                            {/* Drag Handle */}
                            <button className="p-2 text-gray-300 hover:text-gray-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </button>

                            {/* Imagen/Icono */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoria.color} flex items-center justify-center text-white flex-shrink-0`}>
                                {categoria.imagen ? (
                                    <img src={categoria.imagen} alt={categoria.nombre} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <FolderTree className="w-7 h-7" />
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
                                    {!categoria.activo && (
                                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">Oculta</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{categoria.descripcion || 'Sin descripción'}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {categoria._count?.productos || 0} productos
                                </p>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleActivo(categoria)}
                                    className={`p-2 rounded-lg transition ${categoria.activo ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                        }`}
                                    title={categoria.activo ? 'Ocultar' : 'Mostrar'}
                                >
                                    {categoria.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => abrirModal(categoria)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                                    title="Editar"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => eliminarCategoria(categoria.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
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
                            className="bg-white rounded-2xl w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Imagen */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Imagen de la Categoría
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-20 h-20 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center overflow-hidden`}
                                        >
                                            {form.imagen ? (
                                                <img src={form.imagen} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <FolderTree className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                <Upload className="w-4 h-4 inline mr-2" />
                                                Subir Imagen
                                            </button>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 2MB</p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.nombre}
                                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                        placeholder="Ej: Figuras de Anime"
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={form.descripcion}
                                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple resize-none"
                                        placeholder="Descripción de la categoría..."
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Color de Fondo
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {colores.map((color) => (
                                            <button
                                                key={color.valor}
                                                onClick={() => setForm({ ...form, color: color.valor })}
                                                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.valor} transition-transform ${form.color === color.valor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                                                    }`}
                                                title={color.nombre}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Orden */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Orden de Visualización
                                    </label>
                                    <input
                                        type="number"
                                        value={form.orden}
                                        onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                                        className="w-24 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                                <button
                                    onClick={cerrarModal}
                                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={guardarCategoria}
                                    disabled={guardando}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {guardando ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
