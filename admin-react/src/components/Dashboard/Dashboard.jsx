import { useState, useEffect } from 'react'
import { obtenerProductos, obtenerUsuarios, obtenerPedidos, inicializarDatos } from '../../services/storageService'
import { useAuth } from '../../hooks/useAuth'

function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  
  // Estados para los KPIs (métricas)
  const [kpis, setKpis] = useState({
    productos: 0,
    usuarios: 0,
    pedidos: 0
  })

  // Hook para cargar datos reales
  useEffect(() => {
    // Inicializar datos base si no existen
    inicializarDatos()
    
    // Cargar datos del localStorage
    const productos = obtenerProductos()
    const usuarios = obtenerUsuarios()
    const pedidos = obtenerPedidos()

    setKpis({
      productos: productos.length,
      usuarios: usuarios.length,
      pedidos: pedidos.filter(p => p.estado === 'pendiente').length || pedidos.length
    })
  }, [])

  return (
    <div className="admin-container">
      {/* Header con información del usuario */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6'
      }}>
        <h1>Panel de Administración - Level-Up Gamer</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Bienvenido/a, <strong>{user?.nombres || user?.correo}</strong></span>
          <span className="badge" style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: user?.tipoUsuario === 'admin' ? '#007bff' : '#28a745',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            {user?.tipoUsuario?.toUpperCase()}
          </span>
          <button 
            onClick={logout} 
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="panel">
        <h1 id="tituloPanel">Dashboard</h1>
        <p id="descPanel" className="info">
          Accedé a la gestión según tu rol.
        </p>

        {/* KPIs Section */}
        <div className="tarjetas admin-kpis" style={{ marginTop: '12px' }}>
          <div className="kpi">
            <span id="kpiProductos">{kpis.productos}</span>
            <small>Productos</small>
          </div>
          {isAdmin && (
            <div className="kpi" id="kpiUsuariosBox">
              <span id="kpiUsuarios">{kpis.usuarios}</span>
              <small>Usuarios</small>
            </div>
          )}
          <div className="kpi" id="kpiPedidosBox">
            <span id="kpiPedidos">{kpis.pedidos}</span>
            <small>Pedidos pendientes</small>
          </div>
        </div>

        {/* Quick Actions */}
        <article className="tarjeta" style={{ marginTop: '16px' }}>
          <div className="contenido">
            <h3>Accesos rápidos</h3>
            <div 
              className="acciones" 
              style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
            >
              <button className="btn secundario">
                Ver productos
              </button>
              <button className="btn secundario">
                Ver pedidos
              </button>
              {isAdmin && (
                <>
                  <button className="btn primario">
                    Nuevo producto
                  </button>
                  <button className="btn primario">
                    Gestionar usuarios
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default Dashboard