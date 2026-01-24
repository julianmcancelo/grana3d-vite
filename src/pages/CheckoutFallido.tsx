import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw, ArrowRight } from 'lucide-react'
import Header from '../components/Header'

export default function CheckoutFallido() {
    const [searchParams] = useSearchParams()
    const pedidoId = searchParams.get('pedido')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-16 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <XCircle className="w-12 h-12 text-red-600" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    El pago no pudo completarse
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                >
                    Hubo un problema al procesar tu pago. No te preocupes, no se realizó ningún cobro.
                    Podés intentar nuevamente o elegir otro método de pago.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        to="/checkout"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-grana-purple text-white rounded-xl font-semibold hover:bg-grana-purple/90 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Intentar de nuevo
                    </Link>
                    <Link
                        to="/tienda"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-grana-purple hover:text-grana-purple transition-all"
                    >
                        Volver a la tienda
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </main>
        </div>
    )
}
