import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ShoppingBag, Users, ShoppingCart, AlertCircle, TrendingUp,
    Package, Plus, Eye, ArrowRight, Clock
} from 'lucide-react'
import api from '../../api/client'

interface Stats {
    totalProductos: number
    totalCategorias: number
    totalPedidos: number
    pedidosPendientes: number
    totalUsuarios: number
}

interface Pedido {
    id: string
    numero: number
    nombreCliente: string
    total: number
    estado: string
    createdAt: string
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats>({
        totalProductos: 0,
        totalCategorias: 0,
        totalPedidos: 0,
        pedidosPendientes: 0,
        totalUsuarios: 0
    })
    const [pedidosRecientes, setPedidosRecientes] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [statsRes, pedidosRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/pedidos')
                ])
                setStats(statsRes.data)
                setPedidosRecientes(pedidosRes.data.slice(0, 5))
            } catch (error) {
                console.error('Error cargando dashboard:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    const estadoColor: Record<string, string> = {
        PENDIENTE: 'bg-yellow-100 text-yellow-700',
        CONFIRMADO: 'bg-blue-100 text-blue-700',
        EN_PROCESO: 'bg-purple-100 text-purple-700',
        ENVIADO: 'bg-cyan-100 text-cyan-700',
        ENTREGADO: 'bg-green-100 text-green-700',
        CANCELADO: 'bg-red-100 text-red-700'
    }

    const cards = [
        {
            label: 'Productos Activos',
            value: stats.totalProductos,
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            href: '/admin/productos'
        },
        {
            label: 'Pedidos Pendientes',
            value: stats.pedidosPendientes,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            href: '/admin/pedidos'
        },
        {
            label: 'Total Pedidos',
            value: stats.totalPedidos,
            icon: ShoppingCart,
            color: 'text-green-500',
            bg: 'bg-green-50',
            href: '/admin/pedidos'
        },
        {
            label: 'Clientes',
            value: stats.totalUsuarios,
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            href: '/admin/usuarios'
        },
    ]

    const accionesRapidas = [
        { label: 'Nuevo Producto', icon: Plus, href: '/admin/productos/nuevo', color: 'bg-grana-purple' },
        { label: 'Ver Pedidos', icon: Eye, href: '/admin/pedidos', color: 'bg-grana-cyan' },
        { label: 'Ver Tienda', icon: ShoppingBag, href: '/tienda', color: 'bg-grana-orange', external: true },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grana-purple"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Bienvenido al panel de administración de Grana3D</p>
                </div>
                <Link
                    to="/tienda"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-grana-purple text-white rounded-lg hover:bg-grana-purple/90 transition"
                >
                    <Eye className="w-4 h-4" />
                    Ver Tienda
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link
                            to={card.href}
                            className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                                    <card.icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* Pedidos Recientes */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
                        <Link to="/admin/pedidos" className="text-grana-purple text-sm font-medium hover:underline flex items-center gap-1">
                            Ver todos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {pedidosRecientes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No hay pedidos todavía</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pedidosRecientes.map((pedido) => (
                                <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-grana-purple/10 rounded-lg flex items-center justify-center">
                                            <Package className="w-5 h-5 text-grana-purple" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Pedido #{pedido.numero}</p>
                                            <p className="text-sm text-gray-500">{pedido.nombreCliente || 'Cliente anónimo'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${pedido.total.toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${estadoColor[pedido.estado] || 'bg-gray-100 text-gray-600'}`}>
                                            {pedido.estado.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
                    <div className="space-y-3">
                        {accionesRapidas.map((accion) => (
                            <Link
                                key={accion.label}
                                to={accion.href}
                                target={accion.external ? '_blank' : undefined}
                                className={`flex items-center gap-3 p-4 rounded-xl text-white ${accion.color} hover:opacity-90 transition`}
                            >
                                <accion.icon className="w-5 h-5" />
                                <span className="font-medium">{accion.label}</span>
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </Link>
                        ))}
                    </div>

                    {/* Info Card */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-grana-cyan" />
                            <span className="text-sm font-medium">Última actualización</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            {new Date().toLocaleString('es-AR', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
