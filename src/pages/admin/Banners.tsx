import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Edit, Trash2, X, Save, Image as ImageIcon,
    Upload, Eye, EyeOff, GripVertical, Link as LinkIcon
} from 'lucide-react'
import api from '../../api/client'

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
    orden: number
    activo: boolean
}

export default function Banners() {
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [bannerEditando, setBannerEditando] = useState<Banner | null>(null)
    const [guardando, setGuardando] = useState(false)

    // Formulario
    const [form, setForm] = useState({
        titulo: '',
        subtitulo: '',
        descripcion: '',
        imagen: '',
        imagenMovil: '',
        textoBoton: 'Ver Productos',
        linkBoton: '/tienda',
        textoBoton2: '',
        linkBoton2: '',
        colorFondo: '#000000',
        colorTexto: '#ffffff',
        overlay: true,
        orden: 0,
        activo: true
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const fileInputMovilRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        cargarBanners()
    }, [])

    const cargarBanners = async () => {
        try {
            setError(null)
            const { data } = await api.get('/admin/banners')
            setBanners(data)
        } catch (error: any) {
            console.error('Error cargando banners:', error)
            setError(error.message || 'Error desconocido al cargar banners')
        } finally {
            setLoading(false)
        }
    }

    const abrirModal = (banner?: Banner) => {
        if (banner) {
            setBannerEditando(banner)
            setForm({
                titulo: banner.titulo || '',
                subtitulo: banner.subtitulo || '',
                descripcion: banner.descripcion || '',
                imagen: banner.imagen || '',
                imagenMovil: banner.imagenMovil || '',
                textoBoton: banner.textoBoton || '',
                linkBoton: banner.linkBoton || '',
                textoBoton2: banner.textoBoton2 || '',
                linkBoton2: banner.linkBoton2 || '',
                colorFondo: banner.colorFondo || '#000000',
                colorTexto: banner.colorTexto || '#ffffff',
                overlay: banner.overlay,
                orden: banner.orden,
                activo: banner.activo
            })
        } else {
            setBannerEditando(null)
            setForm({
                titulo: '',
                subtitulo: '',
                descripcion: '',
                imagen: '',
                imagenMovil: '',
                textoBoton: 'Ver Productos',
                linkBoton: '/tienda',
                textoBoton2: '',
                linkBoton2: '',
                colorFondo: '#000000',
                colorTexto: '#ffffff',
                overlay: true,
                orden: banners.length,
                activo: true
            })
        }
        setModalAbierto(true)
    }

    const cerrarModal = () => {
        setModalAbierto(false)
        setBannerEditando(null)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'desktop' | 'movil') => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const base64 = event.target?.result as string
            setForm(prev => ({
                ...prev,
                [tipo === 'desktop' ? 'imagen' : 'imagenMovil']: base64
            }))
        }
        reader.readAsDataURL(file)
    }

    const guardarBanner = async () => {
        if (!form.imagen) {
            alert('La imagen principal es obligatoria')
            return
        }

        setGuardando(true)
        try {
            if (bannerEditando) {
                await api.put(`/admin/banners/${bannerEditando.id}`, form)
            } else {
                await api.post('/admin/banners', form)
            }
            await cargarBanners()
            cerrarModal()
        } catch (error) {
            console.error('Error guardando banner:', error)
            alert('Error al guardar el banner')
        } finally {
            setGuardando(false)
        }
    }

    const eliminarBanner = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este banner?')) return

        try {
            await api.delete(`/admin/banners/${id}`)
            await cargarBanners()
        } catch (error) {
            console.error('Error eliminando banner:', error)
        }
    }

    const toggleActivo = async (banner: Banner) => {
        try {
            await api.put(`/admin/banners/${banner.id}`, { activo: !banner.activo })
            await cargarBanners()
        } catch (error) {
            console.error('Error actualizando banner:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                Error: {error}
                <button onClick={cargarBanners} className="ml-4 underline">Reintentar</button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Banners / Sliders</h1>
                    <p className="text-gray-500">Gestiona los banners de la página principal</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Banner
                </button>
            </div>

            <div className="grid gap-4">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition ${!banner.activo ? 'opacity-60' : ''}`}
                    >
                        {/* Preview Imagen */}
                        <div className="w-full md:w-64 h-32 bg-gray-100 rounded-lg overflow-hidden relative group">
                            <img src={banner.imagen} alt="" className="w-full h-full object-cover" />
                            {banner.imagenMovil && (
                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                                    + Móvil
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900">{banner.titulo || '(Sin título)'}</h3>
                                    <p className="text-sm text-gray-500">{banner.descripcion || '(Sin descripción)'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActivo(banner)}
                                        className={`p-2 rounded-lg transition ${banner.activo ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title={banner.activo ? 'Desactivar' : 'Activar'}
                                    >
                                        {banner.activo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => abrirModal(banner)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                        title="Editar"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => eliminarBanner(banner.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                                {banner.textoBoton && (
                                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" />
                                        {banner.textoBoton} ({banner.linkBoton})
                                    </span>
                                )}
                                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                                    Orden: {banner.orden}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No hay banners creados</p>
                    </div>
                )}
            </div>

            {/* Modal */}
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
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {bannerEditando ? 'Editar Banner' : 'Nuevo Banner'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Imágenes */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Imagen Desktop (Horizontal) *
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden hover:border-grana-purple cursor-pointer transition flex items-center justify-center group"
                                        >
                                            {form.imagen ? (
                                                <>
                                                    <img src={form.imagen} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                        <span className="text-white text-sm font-medium">Cambiar imagen</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-400">
                                                    <Upload className="w-8 h-8 mx-auto mb-2" />
                                                    <span className="text-xs">Click para subir</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'desktop')}
                                            className="hidden"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Imagen Móvil (Vertical) - Opcional
                                        </label>
                                        <div
                                            onClick={() => fileInputMovilRef.current?.click()}
                                            className="relative aspect-[9/16] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden hover:border-grana-purple cursor-pointer transition flex items-center justify-center group w-1/2 mx-auto"
                                        >
                                            {form.imagenMovil ? (
                                                <>
                                                    <img src={form.imagenMovil} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                                        <span className="text-white text-xs font-medium">Cambiar</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-400">
                                                    <Upload className="w-6 h-6 mx-auto mb-2" />
                                                    <span className="text-xs">Subir</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputMovilRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'movil')}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* Textos */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                        <input
                                            type="text"
                                            value={form.titulo}
                                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                            placeholder="Título principal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (opcional)</label>
                                        <input
                                            type="text"
                                            value={form.subtitulo}
                                            onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                            placeholder="Texto encima del título"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                                        <textarea
                                            value={form.descripcion}
                                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple resize-none"
                                            placeholder="Texto descriptivo..."
                                        />
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900 text-sm">Botón Principal</h4>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Texto</label>
                                            <input
                                                type="text"
                                                value={form.textoBoton}
                                                onChange={(e) => setForm({ ...form, textoBoton: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                                placeholder="Ej: Ver Productos"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Enlace</label>
                                            <input
                                                type="text"
                                                value={form.linkBoton}
                                                onChange={(e) => setForm({ ...form, linkBoton: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                                placeholder="Ej: /tienda"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900 text-sm">Botón Secundario (Opcional)</h4>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Texto</label>
                                            <input
                                                type="text"
                                                value={form.textoBoton2}
                                                onChange={(e) => setForm({ ...form, textoBoton2: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                                placeholder="Ej: Contacto"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Enlace</label>
                                            <input
                                                type="text"
                                                value={form.linkBoton2}
                                                onChange={(e) => setForm({ ...form, linkBoton2: e.target.value })}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                                placeholder="Ej: #contacto"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Opciones */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                                        <input
                                            type="number"
                                            value={form.orden}
                                            onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="overlay"
                                            checked={form.overlay}
                                            onChange={(e) => setForm({ ...form, overlay: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-grana-purple focus:ring-grana-purple"
                                        />
                                        <label htmlFor="overlay" className="text-sm text-gray-700">
                                            Oscurecer imagen (Overlay)
                                        </label>
                                    </div>

                                    <div className="col-span-2">
                                        <h4 className="font-medium text-gray-900 text-sm mb-2">Colores de Texto</h4>
                                        <div className="flex gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Color Texto</label>
                                                <input
                                                    type="color"
                                                    value={form.colorTexto}
                                                    onChange={(e) => setForm({ ...form, colorTexto: e.target.value })}
                                                    className="h-8 w-16"
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                    onClick={guardarBanner}
                                    disabled={guardando}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {guardando ? 'Guardando...' : 'Guardar Banner'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
