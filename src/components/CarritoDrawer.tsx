import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function CarritoDrawer() {
    const navigate = useNavigate()
    const { items, cantidadTotal, total, estaAbierto, cerrarCarrito, actualizarCantidad, eliminarProducto, vaciarCarrito } = useCarrito()

    const irACheckout = () => {
        cerrarCarrito()
        navigate('/checkout')
    }

    return (
        <AnimatePresence>
            {estaAbierto && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cerrarCarrito}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-grana-purple" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Mi Carrito ({cantidadTotal})
                                </h2>
                            </div>
                            <button
                                onClick={cerrarCarrito}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">Tu carrito está vacío</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        Agregá productos para comenzar
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                        >
                                            {/* Imagen */}
                                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                                                {item.imagen ? (
                                                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {item.nombre}
                                                </h3>
                                                {item.variante && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.variante}
                                                    </p>
                                                )}
                                                <p className="text-grana-purple font-bold mt-1">
                                                    ${item.precio.toLocaleString('es-AR')}
                                                </p>

                                                {/* Controles cantidad */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1, item.variante)}
                                                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                                        {item.cantidad}
                                                    </span>
                                                    <button
                                                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1, item.variante)}
                                                        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => eliminarProducto(item.id, item.variante)}
                                                        className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${total.toLocaleString('es-AR')}
                                    </span>
                                </div>

                                <button
                                    onClick={irACheckout}
                                    className="w-full py-3 bg-grana-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-grana-purple/90 transition-colors"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Finalizar Compra
                                </button>

                                <button
                                    onClick={vaciarCarrito}
                                    className="w-full py-2 text-red-500 text-sm hover:underline"
                                >
                                    Vaciar carrito
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
