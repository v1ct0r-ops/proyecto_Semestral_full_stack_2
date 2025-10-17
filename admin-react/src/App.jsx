import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import AdminLayout from './components/Layout/AdminLayout'
import AdminProductos from './components/Productos/AdminProductos'
import AdminEditarProducto from './components/Productos/AdminEditarProducto'
import AdminNuevoProducto from './components/Productos/AdminNuevoProducto'
import AdminUsuarios from './components/Usuarios/AdminUsuarios'
import AdminUsuarioNuevo from './components/Usuarios/AdminUsuarioNuevo'
import AdminPedidos from './components/Pedidos/AdminPedidos'
import AdminPedidoDetalle from './components/Pedidos/AdminPedidoDetalle'
import AdminSolicitudes from './components/Solicitudes/AdminSolicitudes'
import AdminSolicitudDetalle from './components/Solicitudes/AdminSolicitudDetalle'
import ProtectedRoute from './components/ProtectedRoute'
import { setupCrossDomainSync, requestFromHTML } from './services/crossDomainStorage'
import './App.css'
// import './admin-styles.css' // Descomenta cuando copies el CSS

function App() {
  useEffect(() => {
    // Configurar sincronización cross-domain
    setupCrossDomainSync()
    console.log('🔄 Sincronización cross-domain activada')

    // Nombrar ventana de React para que el HTML pueda localizarla
    try { window.name = window.name || 'react-app' } catch {}

    // Intentar obtener datos iniciales desde el HTML si existen (rápido)
    setTimeout(()=>{
      ;['sesion','usuarios','productos','pedidos','carrito','resenas'].forEach(k=>{
        try { requestFromHTML(k) } catch {}
      })
    }, 50)
  }, [])

  return (
    <div className="App" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="productos/nuevo" element={<AdminNuevoProducto />} />
            <Route path="productos/editar/:codigo" element={<AdminEditarProducto />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuarios/nuevo" element={<AdminUsuarioNuevo />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="pedidos/:id" element={<AdminPedidoDetalle />} />
            <Route path="solicitudes" element={<AdminSolicitudes />} />
            <Route path="solicitudes/:id" element={<AdminSolicitudDetalle />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App