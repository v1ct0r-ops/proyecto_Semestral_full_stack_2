import { useState, useEffect } from 'react'
import { usuarioActual, esAdmin, esVendedor, estaSesionActiva, cerrarSesion } from '../services/storageService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = usuarioActual()
    console.log('=== DEBUG AUTH ===')
    console.log('Current user:', currentUser)
    console.log('Session data:', localStorage.getItem('sesion'))
    console.log('Users data:', localStorage.getItem('usuarios'))
    console.log('Is authenticated:', estaSesionActiva())
    console.log('Is admin:', esAdmin())
    console.log('Is vendedor:', esVendedor())
    console.log('=================')
    
    setUser(currentUser)
    setLoading(false)
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
    isAuthenticated: estaSesionActiva(),
    isAdmin: esAdmin(),
    isVendedor: esVendedor(),
    hasAdminAccess: esAdmin() || esVendedor()
  }
}