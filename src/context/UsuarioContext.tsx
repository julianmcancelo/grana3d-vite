import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api/client'

interface Usuario {
    id: string
    nombre: string
    email: string
    rol: 'ADMIN' | 'CLIENTE'
}

interface UsuarioContextType {
    usuario: Usuario | null
    estaAutenticado: boolean
    esAdmin: boolean
    iniciandoSesion: boolean
    iniciarSesion: (email: string, password: string) => Promise<boolean>
    registrarse: (nombre: string, email: string, password: string, telefono?: string) => Promise<boolean>
    cerrarSesion: () => void
    modalAbierto: boolean
    abrirModal: (modo?: 'login' | 'registro') => void
    cerrarModal: () => void
    modoModal: 'login' | 'registro'
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined)

export function UsuarioProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [iniciandoSesion, setIniciandoSesion] = useState(true) // Empezamos cargando
    const [modalAbierto, setModalAbierto] = useState(false)
    const [modoModal, setModoModal] = useState<'login' | 'registro'>('login')

    // Cargar sesión inicial
    useEffect(() => {
        const cargarSesion = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setIniciandoSesion(false)
                return
            }

            try {
                const { data } = await api.get('/auth/me')
                setUsuario(data.usuario)
            } catch (error) {
                localStorage.removeItem('token')
                setUsuario(null)
            } finally {
                setIniciandoSesion(false)
            }
        }
        cargarSesion()
    }, [])

    const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
        setIniciandoSesion(true)
        try {
            const { data } = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', data.token)
            setUsuario(data.usuario)
            setModalAbierto(false)
            return true
        } catch (error) {
            console.error(error)
            return false
        } finally {
            setIniciandoSesion(false)
        }
    }

    const registrarse = async (nombre: string, email: string, password: string, telefono?: string): Promise<boolean> => {
        setIniciandoSesion(true)
        try {
            const { data } = await api.post('/auth/registro', { nombre, email, password, telefono })
            localStorage.setItem('token', data.token)
            setUsuario(data.usuario)
            setModalAbierto(false)
            return true
        } catch (error) {
            console.error(error)
            return false
        } finally {
            setIniciandoSesion(false)
        }
    }

    const cerrarSesion = () => {
        localStorage.removeItem('token')
        setUsuario(null)
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
            esAdmin: usuario?.rol === 'ADMIN',
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
