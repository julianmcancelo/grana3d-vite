import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Save, Settings, Store, Phone, Mail, MapPin,
    Instagram, Facebook, Truck, CreditCard, Palette, Banknote, MessageCircle
} from 'lucide-react'
import api from '../../api/client'

interface Config {
    nombre_tienda: string
    eslogan: string
    descripcion: string
    email: string
    telefono: string
    whatsapp: string
    direccion: string
    instagram: string
    facebook: string
    envio_gratis_minimo: string
    costo_envio: string
    color_primario: string
    color_secundario: string
    // Checkout / Bank
    banco_nombre: string
    banco_titular: string
    banco_cbu: string
    banco_alias: string
    banco_cuit: string
    whatsapp_checkout: string
    // Shipping
    envio_retiro_activo: string
    envio_correo_activo: string
    envio_correo_precio: string
    envio_andreani_activo: string
    envio_andreani_precio: string
}

export default function Configuracion() {
    const [config, setConfig] = useState<Config>({
        nombre_tienda: '',
        eslogan: '',
        descripcion: '',
        email: '',
        telefono: '',
        whatsapp: '',
        direccion: '',
        instagram: '',
        facebook: '',
        envio_gratis_minimo: '50000',
        costo_envio: '5000',
        color_primario: '#8B5CF6',
        color_secundario: '#06B6D4',
        // Checkout
        banco_nombre: '',
        banco_titular: '',
        banco_cbu: '',
        banco_alias: '',
        banco_cuit: '',
        whatsapp_checkout: '',
        // Shipping methods
        envio_retiro_activo: 'true',
        envio_correo_activo: 'true',
        envio_correo_precio: '3500',
        envio_andreani_activo: 'true',
        envio_andreani_precio: '5000'
    })
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [guardadoExitoso, setGuardadoExitoso] = useState(false)

    useEffect(() => {
        cargarConfig()
    }, [])

    const cargarConfig = async () => {
        try {
            const { data } = await api.get('/admin/config')
            const configObj: Record<string, string> = {}
            data.forEach((c: { clave: string; valor: string }) => {
                configObj[c.clave] = c.valor
            })
            setConfig(prev => ({ ...prev, ...configObj }))
        } catch (error) {
            console.error('Error cargando configuración:', error)
        } finally {
            setLoading(false)
        }
    }

    const guardarConfig = async () => {
        setGuardando(true)
        try {
            const configs = Object.entries(config).map(([clave, valor]) => ({ clave, valor }))
            await api.put('/admin/config', { configs })
            setGuardadoExitoso(true)
            setTimeout(() => setGuardadoExitoso(false), 3000)
        } catch (error) {
            console.error('Error guardando configuración:', error)
            alert('Error al guardar la configuración')
        } finally {
            setGuardando(false)
        }
    }

    const handleChange = (key: keyof Config, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                    <p className="text-gray-500">Personaliza la información de tu tienda</p>
                </div>
                <button
                    onClick={guardarConfig}
                    disabled={guardando}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition ${guardadoExitoso
                        ? 'bg-green-500 text-white'
                        : 'bg-grana-purple text-white hover:bg-grana-purple/90'
                        } disabled:opacity-50`}
                >
                    <Save className="w-4 h-4" />
                    {guardando ? 'Guardando...' : guardadoExitoso ? '¡Guardado!' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Secciones */}
            <div className="space-y-6">

                {/* Info de la Tienda */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Store className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Información de la Tienda</h2>
                    </div>

                    <div className="grid gap-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Tienda
                                </label>
                                <input
                                    type="text"
                                    value={config.nombre_tienda}
                                    onChange={(e) => handleChange('nombre_tienda', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                    placeholder="Grana3D"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Eslogan
                                </label>
                                <input
                                    type="text"
                                    value={config.eslogan}
                                    onChange={(e) => handleChange('eslogan', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                    placeholder="Productos Impresos en 3D"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={config.descripcion}
                                onChange={(e) => handleChange('descripcion', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple resize-none"
                                placeholder="Describe tu tienda..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contacto */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-cyan-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Información de Contacto</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-1" /> Email
                            </label>
                            <input
                                type="email"
                                value={config.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="hola@grana3d.com.ar"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-1" /> Teléfono
                            </label>
                            <input
                                type="tel"
                                value={config.telefono}
                                onChange={(e) => handleChange('telefono', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="+54 11 1234-5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp (solo número)
                            </label>
                            <input
                                type="text"
                                value={config.whatsapp}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="5491112345678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" /> Dirección
                            </label>
                            <input
                                type="text"
                                value={config.direccion}
                                onChange={(e) => handleChange('direccion', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="Buenos Aires, Argentina"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Redes Sociales */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-pink-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Redes Sociales</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Instagram className="w-4 h-4 inline mr-1" /> Instagram
                            </label>
                            <input
                                type="url"
                                value={config.instagram}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="https://instagram.com/grana3d"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Facebook className="w-4 h-4 inline mr-1" /> Facebook
                            </label>
                            <input
                                type="url"
                                value={config.facebook}
                                onChange={(e) => handleChange('facebook', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="https://facebook.com/grana3d"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Envíos */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Configuración de Envíos</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Envío Gratis desde ($)
                            </label>
                            <input
                                type="number"
                                value={config.envio_gratis_minimo}
                                onChange={(e) => handleChange('envio_gratis_minimo', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="50000"
                            />
                            <p className="text-xs text-gray-400 mt-1">Monto mínimo para envío gratis</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Costo de Envío ($)
                            </label>
                            <input
                                type="number"
                                value={config.costo_envio}
                                onChange={(e) => handleChange('costo_envio', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="5000"
                            />
                            <p className="text-xs text-gray-400 mt-1">Costo si no alcanza el mínimo</p>
                        </div>
                    </div>
                </motion.div>

                {/* Datos Bancarios / Checkout */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Datos para Transferencia</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Banco</label>
                            <input
                                type="text"
                                value={config.banco_nombre}
                                onChange={(e) => handleChange('banco_nombre', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="Banco Galicia"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Titular de la Cuenta</label>
                            <input
                                type="text"
                                value={config.banco_titular}
                                onChange={(e) => handleChange('banco_titular', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="GRANA 3D SRL"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CBU</label>
                            <input
                                type="text"
                                value={config.banco_cbu}
                                onChange={(e) => handleChange('banco_cbu', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple font-mono"
                                placeholder="0070999030004123456789"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
                            <input
                                type="text"
                                value={config.banco_alias}
                                onChange={(e) => handleChange('banco_alias', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="GRANA3D.TIENDA"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CUIT</label>
                            <input
                                type="text"
                                value={config.banco_cuit}
                                onChange={(e) => handleChange('banco_cuit', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="30-12345678-9"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp para Checkout
                            </label>
                            <input
                                type="text"
                                value={config.whatsapp_checkout}
                                onChange={(e) => handleChange('whatsapp_checkout', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple"
                                placeholder="5491112345678"
                            />
                            <p className="text-xs text-gray-400 mt-1">Número con código de país, sin +</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
