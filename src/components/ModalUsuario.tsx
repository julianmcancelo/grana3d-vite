import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useUsuario } from '../context/UsuarioContext'

export default function ModalUsuario() {
    const { modalAbierto, cerrarModal, modoModal, iniciarSesion, registrarse, iniciandoSesion } = useUsuario()
    const [modo, setModo] = useState<'login' | 'registro'>(modoModal)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Completá todos los campos')
            return
        }

        if (modo === 'registro' && !nombre) {
            setError('Ingresá tu nombre')
            return
        }

        try {
            if (modo === 'login') {
                await iniciarSesion(email, password)
            } else {
                await registrarse(nombre, email, password)
            }
        } catch {
            setError('Error al procesar. Intentá de nuevo.')
        }
    }

    const toggleModo = () => {
        setModo(modo === 'login' ? 'registro' : 'login')
        setError('')
    }

    return (
        <AnimatePresence>
            {modalAbierto && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cerrarModal}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                </h2>
                                <button
                                    onClick={cerrarModal}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {modo === 'registro' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Tu nombre"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-grana-purple/30"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-grana-purple/30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-grana-purple/30"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={iniciandoSesion}
                                    className="w-full py-3 bg-grana-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-grana-purple/90 transition-colors disabled:opacity-50"
                                >
                                    {iniciandoSesion ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        modo === 'login' ? 'Ingresar' : 'Crear cuenta'
                                    )}
                                </button>
                            </form>

                            {/* Toggle */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {modo === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
                                    <button
                                        onClick={toggleModo}
                                        className="text-grana-purple font-medium hover:underline"
                                    >
                                        {modo === 'login' ? 'Registrate' : 'Iniciá sesión'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
