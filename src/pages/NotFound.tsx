import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-grana-purple to-grana-cyan bg-clip-text text-transparent mb-4">
                404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Página no encontrada
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Lo sentimos, la página que buscás no existe o fue movida.
            </p>
            <div className="flex gap-4">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 bg-grana-purple text-white rounded-xl hover:bg-grana-purple/90 transition shadow-lg shadow-grana-purple/25"
                >
                    <Home className="w-5 h-5" />
                    Ir al Inicio
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </button>
            </div>
        </div>
    )
}
