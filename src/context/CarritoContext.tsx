import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ProductoCarrito {
    id: string
    nombre: string
    precio: number
    cantidad: number
    imagen?: string
    variante?: string
}

interface CarritoContextType {
    items: ProductoCarrito[]
    cantidadTotal: number
    total: number
    agregarProducto: (producto: Omit<ProductoCarrito, 'cantidad'> & { cantidad?: number }) => void
    eliminarProducto: (id: string, variante?: string) => void
    actualizarCantidad: (id: string, cantidad: number, variante?: string) => void
    vaciarCarrito: () => void
    estaAbierto: boolean
    abrirCarrito: () => void
    cerrarCarrito: () => void
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ProductoCarrito[]>([])
    const [estaAbierto, setEstaAbierto] = useState(false)

    const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)
    const total = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

    const agregarProducto = (producto: Omit<ProductoCarrito, 'cantidad'> & { cantidad?: number }) => {
        const cant = producto.cantidad || 1
        setItems(prev => {
            // Buscamos si existe el mismo producto con la misma variante
            const existeIndex = prev.findIndex(item =>
                item.id === producto.id && item.variante === producto.variante
            )

            if (existeIndex >= 0) {
                const newItems = [...prev]
                newItems[existeIndex].cantidad += cant
                return newItems
            }
            return [...prev, { ...producto, cantidad: cant }]
        })
        setEstaAbierto(true)
    }

    const eliminarProducto = (id: string, variante?: string) => {
        setItems(prev => prev.filter(item => !(item.id === id && item.variante === variante)))
    }

    const actualizarCantidad = (id: string, cantidad: number, variante?: string) => {
        if (cantidad <= 0) {
            eliminarProducto(id, variante)
            return
        }
        setItems(prev =>
            prev.map(item =>
                (item.id === id && item.variante === variante) ? { ...item, cantidad } : item
            )
        )
    }

    const vaciarCarrito = () => {
        setItems([])
    }

    const abrirCarrito = () => setEstaAbierto(true)
    const cerrarCarrito = () => setEstaAbierto(false)

    return (
        <CarritoContext.Provider value={{
            items,
            cantidadTotal,
            total,
            agregarProducto,
            eliminarProducto,
            actualizarCantidad,
            vaciarCarrito,
            estaAbierto,
            abrirCarrito,
            cerrarCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    )
}

export function useCarrito() {
    const context = useContext(CarritoContext)
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de CarritoProvider')
    }
    return context
}
