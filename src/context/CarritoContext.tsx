import { createContext, useContext, useState, type ReactNode } from 'react'

export interface ProductoCarrito {
    id: string
    nombre: string
    precio: number
    cantidad: number
    imagen?: string
}

interface CarritoContextType {
    items: ProductoCarrito[]
    cantidadTotal: number
    total: number
    agregarProducto: (producto: Omit<ProductoCarrito, 'cantidad'>) => void
    eliminarProducto: (id: string) => void
    actualizarCantidad: (id: string, cantidad: number) => void
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

    const agregarProducto = (producto: Omit<ProductoCarrito, 'cantidad'>) => {
        setItems(prev => {
            const existe = prev.find(item => item.id === producto.id)
            if (existe) {
                return prev.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            }
            return [...prev, { ...producto, cantidad: 1 }]
        })
        setEstaAbierto(true)
    }

    const eliminarProducto = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const actualizarCantidad = (id: string, cantidad: number) => {
        if (cantidad <= 0) {
            eliminarProducto(id)
            return
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, cantidad } : item
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
