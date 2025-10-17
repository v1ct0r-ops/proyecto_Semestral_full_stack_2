import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function AdminLayout(){
  const { user, isAdmin, isVendedor } = useAuth()
  const loc = useLocation()

  return (
    <div className="principal">
      {/* Header */}
      <header className="encabezado">
        <Link className="logo" to="/">
          <img src="http://localhost:5500/img/LOGO.png" alt="Logo" className="logoBase" />
        </Link>
        <nav className="navegacion">
          <a href="http://localhost:5500/index.html">Inicio</a>
          <a href="http://localhost:5500/productos.html">Productos</a>
          {/* Botón perfil omitido en React; la sesión se maneja por ProtectedRoute */}
        </nav>
      </header>

      {/* Body: menu + content */}
      <section className="admin" style={{display:'flex', gap:'16px'}}>
        <aside className="menu-admin">
          <NavLink to="/" className={({isActive})=> isActive? 'activo' : ''}>Inicio</NavLink>
          <NavLink to="/productos" className={({isActive})=> isActive? 'activo' : ''}>Productos</NavLink>
          {!isVendedor && (
            <NavLink to="/usuarios" className={({isActive})=> isActive? 'activo' : ''}>Usuarios</NavLink>
          )}
          <NavLink to="/pedidos" className={({isActive})=> isActive? 'activo' : ''}>Pedidos</NavLink>
          <NavLink to="/solicitudes" className={({isActive})=> isActive? 'activo' : ''}>Solicitud</NavLink>
        </aside>

        <div className="panel" style={{flex:1}}>
          <Outlet />
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>
    </div>
  )
}

export default AdminLayout
