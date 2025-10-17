import { useState, useEffect } from 'react'
import { obtenerProductos, obtenerUsuarios, obtenerPedidos } from '../../services/storageService'
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
    <>
      <h1 id="tituloPanel">Panel</h1>
      <p id="descPanel" className="info">Accedé a la gestión según tu rol.</p>

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

      <article className="tarjeta" style={{ marginTop: '16px' }}>
        <div className="contenido">
          <h3>Accesos rápidos</h3>
          <div className="acciones" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a className="btn secundario" href="/productos">Ver productos</a>
            <a className="btn secundario" href="/pedidos">Ver pedidos</a>
            {isAdmin && (
              <>
                <a className="btn primario" href="/productos/nuevo">Nuevo producto</a>
                <a className="btn primario" href="/usuarios">Gestionar usuarios</a>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

export default Dashboard