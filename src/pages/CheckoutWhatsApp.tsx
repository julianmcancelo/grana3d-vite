import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Package, Copy, Check, ArrowRight, Banknote, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import api from '../api/client'

interface ConfigData {
    banco_nombre: string
    banco_titular: string
    banco_cbu: string
    banco_alias: string
    banco_cuit: string
    whatsapp_checkout: string
}

export default function CheckoutWhatsApp() {
    const [searchParams] = useSearchParams()
    const pedidoId = searchParams.get('pedido')
    const numeroPedido = searchParams.get('numero')
    const [copied, setCopied] = useState<string | null>(null)
    const [config, setConfig] = useState<ConfigData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarConfig = async () => {
            try {
                const { data } = await api.get('/config')
                const configObj: Record<string, string> = {}
                data.forEach((c: { clave: string; valor: string }) => {
                    configObj[c.clave] = c.valor
                })
                setConfig({
                    banco_nombre: configObj.banco_nombre || 'Sin configurar',
                    banco_titular: configObj.banco_titular || 'Sin configurar',
                    banco_cbu: configObj.banco_cbu || 'Sin configurar',
                    banco_alias: configObj.banco_alias || 'Sin configurar',
                    banco_cuit: configObj.banco_cuit || 'Sin configurar',
                    whatsapp_checkout: configObj.whatsapp_checkout || configObj.whatsapp || '5491100000000'
                })
            } catch (error) {
                console.error('Error cargando config:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarConfig()
    }, [])

    const copiar = (texto: string, campo: string) => {
        navigator.clipboard.writeText(texto)
        setCopied(campo)
        setTimeout(() => setCopied(null), 2000)
    }

    const mensajeWhatsApp = `¡Hola! Acabo de realizar el pedido #${numeroPedido} y quiero coordinar el pago y envío.`
    const urlWhatsApp = config ? `https://wa.me/${config.whatsapp_checkout}?text=${encodeURIComponent(mensajeWhatsApp)}` : '#'

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-grana-purple" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <Package className="w-10 h-10 text-green-600" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center"
                >
                    ¡Pedido Registrado!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center"
                >
                    Tu pedido <strong className="text-grana-purple">#{numeroPedido}</strong> fue registrado correctamente.
                    Para completar la compra, realizá la transferencia y envianos el comprobante.
                </motion.p>

                {/* Datos Bancarios */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-grana-purple" />
                        Datos para Transferencia
                    </h2>

                    <div className="space-y-4">
                        {config && [
                            { label: 'Banco', value: config.banco_nombre, copyable: false },
                            { label: 'Titular', value: config.banco_titular, copyable: false },
                            { label: 'CBU', value: config.banco_cbu, copyable: true },
                            { label: 'Alias', value: config.banco_alias, copyable: true },
                            { label: 'CUIT', value: config.banco_cuit, copyable: true },
                        ].map(dato => (
                            <div key={dato.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div>
                                    <p className="text-sm text-gray-500">{dato.label}</p>
                                    <p className="font-mono font-medium text-gray-900 dark:text-white">{dato.value}</p>
                                </div>
                                {dato.copyable && (
                                    <button
                                        onClick={() => copiar(dato.value, dato.label)}
                                        className="p-2 text-gray-400 hover:text-grana-purple transition-colors"
                                        title="Copiar"
                                    >
                                        {copied === dato.label ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Botón WhatsApp */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <a
                        href={urlWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Enviar Comprobante por WhatsApp
                    </a>

                    <p className="text-sm text-gray-500 text-center">
                        Una vez que recibamos el comprobante, confirmaremos tu pedido y coordinaremos el envío.
                    </p>

                    <Link
                        to="/tienda"
                        className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl flex items-center justify-center gap-2 hover:border-grana-purple hover:text-grana-purple transition-colors"
                    >
                        Seguir comprando
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </main>
        </div>
    )
}
