import { motion } from 'framer-motion'
import { Printer, Mail, Instagram, Facebook, MessageCircle, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Home() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col">
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-grana-purple to-grana-cyan rounded-2xl flex items-center justify-center shadow-lg shadow-grana-purple/20">
                            <Printer className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* Brand */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-4"
                    >
                        <span className="text-grana-purple">Grana</span>
                        <span className="text-gray-900 dark:text-white">3D</span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-500 dark:text-gray-400 mb-12"
                    >
                        Impresión 3D Premium
                    </motion.p>

                    {/* Coming Soon Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="inline-block mb-12"
                    >
                        <span className="px-6 py-3 bg-gradient-to-r from-grana-purple to-grana-cyan text-white font-semibold rounded-full text-lg">
                            🚀 Próximamente
                        </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-lg mx-auto"
                    >
                        Estamos preparando algo increíble. Muy pronto vas a encontrar
                        impresoras, filamentos, accesorios y mucho más.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <a
                            href="https://wa.me/5491112345678"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Contactanos
                        </a>
                        <Link
                            to="/tienda"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Ver Preview de Tienda
                        </Link>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <a
                            href="#"
                            className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-grana-purple hover:text-white transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-grana-purple hover:text-white transition-colors"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="mailto:hola@grana3d.com.ar"
                            className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-grana-purple hover:text-white transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                © {new Date().getFullYear()} Grana3D. Todos los derechos reservados.
            </footer>

            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-grana-purple/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-grana-cyan/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-grana-orange/5 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
