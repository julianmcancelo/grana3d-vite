import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingBag, User, MapPin, CreditCard, ArrowLeft, Truck,
    Loader2, AlertCircle, Store, Package, MessageCircle, Banknote,
    ChevronRight, Check
} from 'lucide-react'
import Header from '../components/Header'
import { useCarrito } from '../context/CarritoContext'
import api from '../api/client'

const METODOS_ENVIO = [
    { id: 'RETIRO_LOCAL', nombre: 'Retiro en Local', descripcion: 'Retirás gratis en nuestro local', precio: 0, icon: Store },
    { id: 'CORREO_ARGENTINO', nombre: 'Correo Argentino', descripcion: 'Envío a domicilio (3-5 días)', precio: 3500, icon: Package },
    { id: 'ANDREANI', nombre: 'Andreani', descripcion: 'Envío express (1-3 días)', precio: 5000, icon: Truck },
]

const METODOS_PAGO = [
    { id: 'MERCADOPAGO', nombre: 'MercadoPago', descripcion: 'Tarjeta, Dinero en Cuenta, QR', icon: CreditCard },
    { id: 'TRANSFERENCIA', nombre: 'Transferencia Bancaria', descripcion: 'Transferí y envianos el comprobante', icon: Banknote },
]

export default function Checkout() {
    const navigate = useNavigate()
    const { items, total, vaciarCarrito } = useCarrito()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [paso, setPaso] = useState(1)

    const [metodoEnvio, setMetodoEnvio] = useState('')
    const [metodoPago, setMetodoPago] = useState('')

    const [form, setForm] = useState({
        nombreCliente: '',
        apellidoCliente: '',
        emailCliente: '',
        telefonoCliente: '',
        dniCliente: '',
        direccionEnvio: '',
        ciudadEnvio: '',
        provinciaEnvio: '',
        codigoPostalEnvio: '',
        notas: ''
    })

    useEffect(() => {
        if (items.length === 0) {
            navigate('/tienda')
        }
    }, [items, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const envioSeleccionado = METODOS_ENVIO.find(m => m.id === metodoEnvio)
    const costoEnvio = envioSeleccionado?.precio || 0
    const totalFinal = total + costoEnvio

    const validarPaso1 = () => {
        if (!form.nombreCliente || !form.apellidoCliente || !form.emailCliente || !form.telefonoCliente) {
            setError('Por favor completá todos los campos obligatorios')
            return false
        }
        setError('')
        return true
    }

    const validarPaso2 = () => {
        if (metodoEnvio !== 'RETIRO_LOCAL' && (!form.direccionEnvio || !form.ciudadEnvio || !form.provinciaEnvio)) {
            setError('Por favor completá la dirección de envío')
            return false
        }
        if (!metodoEnvio) {
            setError('Seleccioná un método de envío')
            return false
        }
        setError('')
        return true
    }

    const validarPaso3 = () => {
        if (!metodoPago) {
            setError('Seleccioná un método de pago')
            return false
        }
        setError('')
        return true
    }

    const handleSubmit = async () => {
        if (!validarPaso3()) return

        setLoading(true)
        setError('')

        const itemsPayload = items.map(item => ({
            productoId: item.id,
            cantidad: item.cantidad,
            variante: item.variante
        }))

        const payload = {
            items: itemsPayload,
            ...form,
            metodoEnvio,
            metodoPago,
            costoEnvio
        }

        try {
            if (metodoPago === 'MERCADOPAGO') {
                // Flujo MercadoPago
                const { data } = await api.post('/pagos/crear-preferencia', payload)
                vaciarCarrito()
                window.location.href = data.init_point
            } else {
                // Flujo WhatsApp/Transferencia
                const { data } = await api.post('/pedidos/whatsapp', payload)
                vaciarCarrito()
                navigate(`/checkout/whatsapp?pedido=${data.pedidoId}&numero=${data.numero}`)
            }
        } catch (err: any) {
            console.error('Error en checkout:', err)
            setError(err.response?.data?.error || 'Error al procesar el pedido')
            setLoading(false)
        }
    }

    const siguientePaso = () => {
        if (paso === 1 && validarPaso1()) setPaso(2)
        else if (paso === 2 && validarPaso2()) setPaso(3)
        else if (paso === 3) handleSubmit()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
                <button
                    onClick={() => paso > 1 ? setPaso(paso - 1) : navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-grana-purple mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {paso > 1 ? 'Paso anterior' : 'Volver'}
                </button>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${paso >= n ? 'bg-grana-purple text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}>
                                {paso > n ? <Check className="w-4 h-4" /> : n}
                            </div>
                            {n < 3 && <div className={`w-12 h-1 rounded ${paso > n ? 'bg-grana-purple' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {/* PASO 1: Datos Personales */}
                                {paso === 1 && (
                                    <motion.div
                                        key="paso1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <User className="w-5 h-5 text-grana-purple" />
                                            Datos Personales
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <input type="text" name="nombreCliente" value={form.nombreCliente} onChange={handleChange} placeholder="Nombre *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                            <input type="text" name="apellidoCliente" value={form.apellidoCliente} onChange={handleChange} placeholder="Apellido *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                            <input type="email" name="emailCliente" value={form.emailCliente} onChange={handleChange} placeholder="Email *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                            <input type="tel" name="telefonoCliente" value={form.telefonoCliente} onChange={handleChange} placeholder="Teléfono/WhatsApp *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                            <input type="text" name="dniCliente" value={form.dniCliente} onChange={handleChange} placeholder="DNI (para facturación)" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* PASO 2: Envío */}
                                {paso === 2 && (
                                    <motion.div
                                        key="paso2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <Truck className="w-5 h-5 text-grana-purple" />
                                            Método de Envío
                                        </h2>
                                        <div className="space-y-3 mb-6">
                                            {METODOS_ENVIO.map(metodo => (
                                                <button
                                                    key={metodo.id}
                                                    type="button"
                                                    onClick={() => setMetodoEnvio(metodo.id)}
                                                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${metodoEnvio === metodo.id
                                                            ? 'border-grana-purple bg-purple-50 dark:bg-purple-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <metodo.icon className={`w-6 h-6 ${metodoEnvio === metodo.id ? 'text-grana-purple' : 'text-gray-400'}`} />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white">{metodo.nombre}</p>
                                                        <p className="text-sm text-gray-500">{metodo.descripcion}</p>
                                                    </div>
                                                    <span className={`font-bold ${metodo.precio === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                                        {metodo.precio === 0 ? 'Gratis' : `$${metodo.precio.toLocaleString()}`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {metodoEnvio && metodoEnvio !== 'RETIRO_LOCAL' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="space-y-4"
                                            >
                                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-grana-orange" />
                                                    Dirección de Envío
                                                </h3>
                                                <input type="text" name="direccionEnvio" value={form.direccionEnvio} onChange={handleChange} placeholder="Dirección (calle, número, piso) *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                                <div className="grid sm:grid-cols-3 gap-4">
                                                    <input type="text" name="ciudadEnvio" value={form.ciudadEnvio} onChange={handleChange} placeholder="Ciudad *" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                                    <select name="provinciaEnvio" value={form.provinciaEnvio} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple appearance-none">
                                                        <option value="">Provincia *</option>
                                                        <option value="Buenos Aires">Buenos Aires</option>
                                                        <option value="CABA">CABA</option>
                                                        <option value="Catamarca">Catamarca</option>
                                                        <option value="Chaco">Chaco</option>
                                                        <option value="Chubut">Chubut</option>
                                                        <option value="Córdoba">Córdoba</option>
                                                        <option value="Corrientes">Corrientes</option>
                                                        <option value="Entre Ríos">Entre Ríos</option>
                                                        <option value="Formosa">Formosa</option>
                                                        <option value="Jujuy">Jujuy</option>
                                                        <option value="La Pampa">La Pampa</option>
                                                        <option value="La Rioja">La Rioja</option>
                                                        <option value="Mendoza">Mendoza</option>
                                                        <option value="Misiones">Misiones</option>
                                                        <option value="Neuquén">Neuquén</option>
                                                        <option value="Río Negro">Río Negro</option>
                                                        <option value="Salta">Salta</option>
                                                        <option value="San Juan">San Juan</option>
                                                        <option value="San Luis">San Luis</option>
                                                        <option value="Santa Cruz">Santa Cruz</option>
                                                        <option value="Santa Fe">Santa Fe</option>
                                                        <option value="Santiago del Estero">Santiago del Estero</option>
                                                        <option value="Tierra del Fuego">Tierra del Fuego</option>
                                                        <option value="Tucumán">Tucumán</option>
                                                    </select>
                                                    <input type="text" name="codigoPostalEnvio" value={form.codigoPostalEnvio} onChange={handleChange} placeholder="Código Postal" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {/* PASO 3: Pago */}
                                {paso === 3 && (
                                    <motion.div
                                        key="paso3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-grana-purple" />
                                            Método de Pago
                                        </h2>
                                        <div className="space-y-3 mb-6">
                                            {METODOS_PAGO.map(metodo => (
                                                <button
                                                    key={metodo.id}
                                                    type="button"
                                                    onClick={() => setMetodoPago(metodo.id)}
                                                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${metodoPago === metodo.id
                                                            ? 'border-grana-purple bg-purple-50 dark:bg-purple-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <metodo.icon className={`w-6 h-6 ${metodoPago === metodo.id ? 'text-grana-purple' : 'text-gray-400'}`} />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white">{metodo.nombre}</p>
                                                        <p className="text-sm text-gray-500">{metodo.descripcion}</p>
                                                    </div>
                                                    {metodoPago === metodo.id && <Check className="w-5 h-5 text-grana-purple" />}
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            name="notas"
                                            value={form.notas}
                                            onChange={handleChange}
                                            placeholder="Notas adicionales (opcional)"
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-grana-purple/20 focus:border-grana-purple resize-none"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Botón Continuar */}
                            <button
                                type="button"
                                onClick={siguientePaso}
                                disabled={loading}
                                className="w-full mt-6 bg-grana-purple text-white py-4 rounded-xl font-bold text-lg hover:bg-grana-purple/90 transition-all shadow-lg shadow-grana-purple/25 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : paso < 3 ? (
                                    <>
                                        Continuar
                                        <ChevronRight className="w-5 h-5" />
                                    </>
                                ) : metodoPago === 'MERCADOPAGO' ? (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pagar con MercadoPago
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" />
                                        Confirmar y Enviar WhatsApp
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-grana-purple" />
                                Resumen del Pedido
                            </h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                            {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.nombre}</p>
                                            {item.variante && <p className="text-xs text-gray-500">{item.variante}</p>}
                                            <p className="text-sm text-gray-500">x{item.cantidad}</p>
                                        </div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">${(item.precio * item.cantidad).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Envío</span>
                                    <span className={costoEnvio === 0 ? 'text-green-600 font-medium' : 'text-gray-900 dark:text-white'}>
                                        {!metodoEnvio ? 'Seleccioná método' : costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-grana-purple">${totalFinal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
