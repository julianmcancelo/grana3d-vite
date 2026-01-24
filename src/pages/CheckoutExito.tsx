import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'
import Header from '../components/Header'
import api from '../api/client'

export default function CheckoutExito() {
    const [searchParams] = useSearchParams()
    const pedidoId = searchParams.get('pedido')
    const [pedido, setPedido] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarPedido = async () => {
            if (!pedidoId) {
                setLoading(false)
                return
            }

            try {
                const { data } = await api.get(`/pagos/estado/${pedidoId}`)
                setPedido(data)
            } catch (error) {
                console.error('Error cargando pedido:', error)
            } finally {
                setLoading(false)
            }
        }

        cargarPedido()
    }, [pedidoId])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    ¡Gracias por tu compra!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                >
                    Tu pago fue procesado exitosamente. En breve recibirás un email con los detalles de tu pedido.
                </motion.p>

                {loading ? (
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cargando detalles...
                    </div>
                ) : pedido ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-8"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Package className="w-6 h-6 text-grana-purple" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Pedido #{pedido.numero}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p>Estado: <span className="font-medium text-green-600">{pedido.estado === 'CONFIRMADO' ? 'Confirmado' : pedido.estado}</span></p>
                            <p>Total: <span className="font-medium text-gray-900 dark:text-white">${pedido.total?.toLocaleString()}</span></p>
                        </div>
                    </motion.div>
                ) : null}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        to="/tienda"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-grana-purple text-white rounded-xl font-semibold hover:bg-grana-purple/90 transition-all"
                    >
                        Seguir comprando
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </main>
        </div>
    )
}
