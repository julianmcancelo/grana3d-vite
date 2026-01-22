import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Usuario {
    id: string
    nombre: string
    email: string
}

interface UsuarioContextType {
    usuario: Usuario | null
    estaAutenticado: boolean
    iniciandoSesion: boolean
    iniciarSesion: (email: string, password: string) => Promise<boolean>
    registrarse: (nombre: string, email: string, password: string) => Promise<boolean>
    cerrarSesion: () => void
    modalAbierto: boolean
    abrirModal: (modo?: 'login' | 'registro') => void
    cerrarModal: () => void
    modoModal: 'login' | 'registro'
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined)

export function UsuarioProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [iniciandoSesion, setIniciandoSesion] = useState(false)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [modoModal, setModoModal] = useState<'login' | 'registro'>('login')

    // Cargar usuario guardado
    useEffect(() => {
        const guardado = localStorage.getItem('grana3d_usuario')
        if (guardado) {
            try {
                setUsuario(JSON.parse(guardado))
            } catch (e) {
                localStorage.removeItem('grana3d_usuario')
            }
        }
    }, [])

    const iniciarSesion = async (email: string, _password: string): Promise<boolean> => {
        setIniciandoSesion(true)
        // Simulación - en producción conectar con API
        await new Promise(resolve => setTimeout(resolve, 1000))

        const nuevoUsuario: Usuario = {
            id: crypto.randomUUID(),
            nombre: email.split('@')[0],
            email
        }

        setUsuario(nuevoUsuario)
        localStorage.setItem('grana3d_usuario', JSON.stringify(nuevoUsuario))
        setIniciandoSesion(false)
        setModalAbierto(false)
        return true
    }

    const registrarse = async (nombre: string, email: string, _password: string): Promise<boolean> => {
        setIniciandoSesion(true)
        await new Promise(resolve => setTimeout(resolve, 1000))

        const nuevoUsuario: Usuario = {
            id: crypto.randomUUID(),
            nombre,
            email
        }

        setUsuario(nuevoUsuario)
        localStorage.setItem('grana3d_usuario', JSON.stringify(nuevoUsuario))
        setIniciandoSesion(false)
        setModalAbierto(false)
        return true
    }

    const cerrarSesion = () => {
        setUsuario(null)
        localStorage.removeItem('grana3d_usuario')
    }

    const abrirModal = (modo: 'login' | 'registro' = 'login') => {
        setModoModal(modo)
        setModalAbierto(true)
    }

    const cerrarModal = () => setModalAbierto(false)

    return (
        <UsuarioContext.Provider value={{
            usuario,
            estaAutenticado: !!usuario,
            iniciandoSesion,
            iniciarSesion,
            registrarse,
            cerrarSesion,
            modalAbierto,
            abrirModal,
            cerrarModal,
            modoModal
        }}>
            {children}
        </UsuarioContext.Provider>
    )
}

export function useUsuario() {
    const context = useContext(UsuarioContext)
    if (!context) {
        throw new Error('useUsuario debe usarse dentro de UsuarioProvider')
    }
    return context
}
