import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Filter, ShoppingBag, Eye, X, Check, Truck,
    CreditCard, Banknote, Calendar, ChevronDown
} from 'lucide-react'
import api from '../../api/client'

// Interfaces (simplified)
interface Pedido {
    id: string
    numero: number
    nombreCliente: string
    apellidoCliente?: string
    emailCliente?: string
    telefonoCliente?: string
    dniCliente?: string
    direccionEnvio?: string
    ciudadEnvio?: string
    provinciaEnvio?: string
    codigoPostalEnvio?: string
    total: number
    estado: 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO'
    metodoPago: 'MERCADOPAGO' | 'TRANSFERENCIA' | 'EFECTIVO' | 'TARJETA'
    metodoEnvio: 'RETIRO' | 'CORREO_ARGENTINO' | 'ANDREANI' | 'ENVIO_PROPIO'
    createdAt: string
    items: any[]
}

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)
    const [filtroEstado, setFiltroEstado] = useState('TODOS')
    const [busqueda, setBusqueda] = useState('')
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null)

    useEffect(() => {
        cargarPedidos()
    }, [])

    const cargarPedidos = async () => {
        try {
            const { data } = await api.get('/admin/pedidos')
            setPedidos(data)
        } catch (error) {
            console.error('Error cargando pedidos:', error)
        } finally {
            setLoading(false)
        }
    }

    const cambiarEstado = async (id: string, nuevoEstado: string) => {
        if (!confirm(`¿Cambiar estado a ${nuevoEstado}?`)) return
        try {
            await api.put(`/admin/pedidos/${id}`, { estado: nuevoEstado })
            cargarPedidos() // Recargar
            setPedidoSeleccionado(null)
        } catch (error) {
            alert('Error al actualizar estado')
        }
    }

    const pedidosFiltrados = pedidos.filter(p => {
        const coincideEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado
        const coincideBusqueda =
            p.nombreCliente?.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.numero.toString().includes(busqueda)
        return coincideEstado && coincideBusqueda
    })

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'CONFIRMADO': return 'bg-green-100 text-green-700'
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-700'
            case 'ENVIADO': return 'bg-blue-100 text-blue-700'
            case 'CANCELADO': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                    <p className="text-gray-500">Administra las órdenes de compra</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente o número..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20"
                    />
                </div>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-grana-purple/20 bg-white"
                >
                    <option value="TODOS">Todos los estados</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="ENVIADO">Enviado</option>
                    <option value="ENTREGADO">Entregado</option>
                    <option value="CANCELADO">Cancelado</option>
                </select>
            </div>

            {/* Lista */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold"># Pedido</th>
                                <th className="px-6 py-4 font-semibold">Cliente</th>
                                <th className="px-6 py-4 font-semibold">Fecha</th>
                                <th className="px-6 py-4 font-semibold">Estado</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pedidosFiltrados.map(pedido => (
                                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">#{pedido.numero}</td>
                                    <td className="px-6 py-4">{pedido.nombreCliente || 'Anónimo'}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(pedido.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pedido.estado)}`}>
                                            {pedido.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ${pedido.total?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setPedidoSeleccionado(pedido)}
                                            className="text-grana-purple hover:bg-purple-50 p-2 rounded-lg transition"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detalle */}
            <AnimatePresence>
                {pedidoSeleccionado && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPedidoSeleccionado(null)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Pedido #{pedidoSeleccionado.numero}</h2>
                                        <p className="text-sm text-gray-500">
                                            {new Date(pedidoSeleccionado.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button onClick={() => setPedidoSeleccionado(null)}>
                                        <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-grana-purple" />
                                            Cliente
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                                            <p><span className="text-gray-500">Nombre:</span> {pedidoSeleccionado.nombreCliente}</p>
                                            <p><span className="text-gray-500">Email:</span> {pedidoSeleccionado.emailCliente}</p>
                                            <p><span className="text-gray-500">Tel:</span> {pedidoSeleccionado.telefonoCliente}</p>
                                            <p><span className="text-gray-500">DNI:</span> {pedidoSeleccionado.dniCliente}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-grana-purple" />
                                            Envío y Pago
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                                            <p><span className="text-gray-500">Método Envío:</span> {pedidoSeleccionado.metodoEnvio || '-'}</p>
                                            <p><span className="text-gray-500">Dirección:</span> {pedidoSeleccionado.direccionEnvio}, {pedidoSeleccionado.ciudadEnvio} ({pedidoSeleccionado.codigoPostalEnvio})</p>
                                            <p><span className="text-gray-500">Método Pago:</span> {pedidoSeleccionado.metodoPago}</p>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-4">Productos</h3>
                                <div className="space-y-3 mb-6">
                                    {pedidoSeleccionado.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.nombre}</p>
                                                <p className="text-sm text-gray-500">x{item.cantidad}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">${item.precio.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cambiar Estado</label>
                                        <div className="flex gap-2">
                                            {['CONFIRMADO', 'ENVIADO', 'ENTREGADO'].map(estado => (
                                                <button
                                                    key={estado}
                                                    onClick={() => cambiarEstado(pedidoSeleccionado.id, estado)}
                                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50"
                                                >
                                                    {estado}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="text-2xl font-bold text-grana-purple">
                                            ${pedidoSeleccionado.total?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
