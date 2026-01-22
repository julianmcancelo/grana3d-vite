import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Users, ShoppingCart, AlertCircle } from 'lucide-react'
import api from '../../api/client'

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProductos: 0,
        totalCategorias: 0,
        totalPedidos: 0,
        pedidosPendientes: 0,
        totalUsuarios: 0
    })

    useEffect(() => {
        api.get('/admin/stats')
            .then(({ data }) => setStats(data))
            .catch(console.error)
    }, [])

    const cards = [
        { label: 'Ingresos Totales', value: '$0', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Pedidos Pendientes', value: stats.pedidosPendientes, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Total Productos', value: stats.totalProductos, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Clientes', value: stats.totalUsuarios, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    ]

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
