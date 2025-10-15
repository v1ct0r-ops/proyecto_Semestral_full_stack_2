import { useState, useEffect } from 'react'
import { 
  usuarioActual, 
  esAdmin, 
  esVendedor, 
  estaSesionActiva, 
  cerrarSesion,
  StorageService
} from '../services/storageService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = usuarioActual()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (correo, password) => {
    // Buscar usuario
    const usuarios = StorageService.obtenerUsuarios();
    const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
    
    if (!usuario) {
      throw new Error("No existe el usuario.");
    }
    
    if (usuario.pass !== password) {
      throw new Error("Contraseña incorrecta.");
    }

    // Verificar que sea admin o vendedor
    if (usuario.tipoUsuario !== 'admin' && usuario.tipoUsuario !== 'vendedor') {
      throw new Error("No tienes permisos de administrador.");
    }

    // Login exitoso
    StorageService.guardarSesion(usuario);
    setUser(usuario);
    return usuario;
  };

  const logout = () => {
    cerrarSesion()
    setUser(null)
    // Redirigir al login HTML del proyecto principal
    window.location.href = '/login.html'
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: estaSesionActiva(),
    isAdmin: esAdmin(),
    isVendedor: esVendedor(),
    hasAdminAccess: esAdmin() || esVendedor()
  }
}