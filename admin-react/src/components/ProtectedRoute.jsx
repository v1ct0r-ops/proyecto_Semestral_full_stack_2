import { useAuth } from '../hooks/useAuth'
import { guardarSesion, obtenerUsuarios } from '../services/storageService'
import { syncFromHTMLStorage, manualDataSync } from '../services/storageBridge'

function ProtectedRoute({ children }) {
  const { isAuthenticated, hasAdminAccess, loading } = useAuth()

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

  if (loading) {
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

  if (!isAuthenticated) {
    return (
      <div className="access-denied" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            🔒 Acceso Requerido
          </h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Debes iniciar sesión para acceder al panel de administración.
          </p>
          
          {/* Botones temporales para prueba */}
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '1rem' }}>🔄 Sincronización:</h4>
            <button 
              onClick={syncFromHTML}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Sincronizar desde HTML
            </button>
            <br />
            <small style={{ color: '#666' }}>
              Usa este botón si ya te logueaste en localhost:5500
            </small>
          </div>
          
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
            <h4 style={{ marginBottom: '1rem' }}>🧪 Pruebas rápidas (Temporal):</h4>
            <button 
              onClick={loginComoAdmin}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Login como Admin
            </button>
            <button 
              onClick={loginComoVendedor}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Login como Vendedor
            </button>
          </div>
          <button 
            onClick={() => window.location.href = 'http://localhost:5500/login.html'}
            className="btn primario"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Ir al Login
          </button>
          <button 
            onClick={() => window.location.href = 'http://localhost:5500/index.html'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!hasAdminAccess) {
    return (
      <div className="access-denied" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            ⛔ Acceso Denegado
          </h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            No tienes permisos para acceder al panel de administración.
          </p>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Solo usuarios <strong>Admin</strong> o <strong>Vendedor</strong> pueden acceder.
          </p>
          <button 
            onClick={() => window.location.href = 'http://localhost:5500/login.html'}
            className="btn primario"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Cambiar cuenta
          </button>
          <button 
            onClick={() => window.location.href = 'http://localhost:5500/index.html'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute