import { useState, useEffect } from 'react'
import { usuarioActual, esAdmin, esVendedor, estaSesionActiva, cerrarSesion } from '../services/storageService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let settled = false
    const maybeSettle = (reason) => {
      if (!settled) {
        settled = true
        setLoading(false)
      }
    }

    // Primera lectura (no cierra loading aún)
    const currentUser = usuarioActual()
    setUser(currentUser)

    // Escuchar cambios y cerrar loading cuando llegue sesión/usuarios o timeout
    const handler = (e) => {
      const evKey = e?.detail?.key
      const next = usuarioActual()
      setUser(next)
      if (evKey === 'sesion' || evKey === 'usuarios') {
        maybeSettle('event')
      }
    }
    window.addEventListener('storage-sync', handler)
    window.addEventListener('storage', handler)

    const t = setTimeout(()=> maybeSettle('timeout'), 700)

    return () => {
      clearTimeout(t)
      window.removeEventListener('storage-sync', handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const logout = () => {
    cerrarSesion()
    setUser(null)
    // Redirigir al login HTML
    window.location.href = 'http://localhost:5500/login.html'
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    isAdmin: !!(user && user.tipoUsuario === 'admin'),
    isVendedor: !!(user && user.tipoUsuario === 'vendedor'),
    hasAdminAccess: !!(user && (user.tipoUsuario === 'admin' || user.tipoUsuario === 'vendedor'))
  }
}