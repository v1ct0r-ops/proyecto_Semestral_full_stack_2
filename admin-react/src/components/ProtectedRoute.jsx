import { useAuth } from '../hooks/useAuth'
import { useEffect, useRef, useState } from 'react'
import { guardarSesion, obtenerUsuarios } from '../services/storageService'
import { syncFromHTMLStorage, manualDataSync } from '../services/storageBridge'

function ProtectedRoute({ children }) {
  const { isAuthenticated, hasAdminAccess, loading } = useAuth()
  const redirected = useRef(false)
  const [syncReady, setSyncReady] = useState(!!window.__htmlSyncReady)

  useEffect(()=>{
    const ok = ()=> setSyncReady(true)
    window.addEventListener('html-sync-ready', ok)
    const t = setTimeout(()=> setSyncReady(true), 600) // fallback
    return ()=>{ window.removeEventListener('html-sync-ready', ok); clearTimeout(t) }
  },[])

  // Función para sincronizar desde HTML
  const syncFromHTML = async () => {
    console.log('🔄 Intentando sincronizar desde HTML...')
    const success = await syncFromHTMLStorage()
    if (success) {
      window.location.reload()
    } else {
      alert('No se pudo sincronizar. Asegúrate de estar logueado en la versión HTML primero.')
    }
  }

  // Función temporal para login de prueba
  const loginComoAdmin = () => {
    manualDataSync() // Asegurar que existen los usuarios
    const usuarios = obtenerUsuarios()
    const admin = usuarios.find(u => u.tipoUsuario === 'admin')
    if (admin) {
      guardarSesion(admin)
      window.location.reload()
    } else {
      alert('No se encontró usuario admin. Revisa la consola.')
    }
  }

  const loginComoVendedor = () => {
    manualDataSync() // Asegurar que existen los usuarios
    const usuarios = obtenerUsuarios()
    const vendedor = usuarios.find(u => u.tipoUsuario === 'vendedor')
    if (vendedor) {
      guardarSesion(vendedor)
      window.location.reload()
    } else {
      alert('No se encontró usuario vendedor. Revisa la consola.')
    }
  }

  if (loading || !syncReady) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  // Guard HTML-like: si no hay sesión => alerta + redirigir a index
  if (!isAuthenticated) {
    if (!redirected.current) {
      redirected.current = true
      alert('Acceso restringido.')
      window.location.href = 'http://localhost:5500/index.html'
    }
    return null
  }

  // Si hay sesión pero no es admin ni vendedor => alerta + index
  if (!hasAdminAccess) {
    if (!redirected.current) {
      redirected.current = true
      alert('Acceso no permitido para tu rol.')
      window.location.href = 'http://localhost:5500/index.html'
    }
    return null
  }

  return children
}

export default ProtectedRoute