import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/Dashboard/AdminPanel.jsx";
import ProductosPanel from "./components/Productos/ProductosPanel.jsx";
import NuevoProductoPanel from "./components/Productos/NuevoProductoPanel.jsx";
import EditarProductoPanel from "./components/Productos/EditarProductoPanel.jsx";
import ProductosPocoStockPanel from "./components/Productos/ProductosPocoStockPanel.jsx";
import ReportesProductosPanel from "./components/Productos/ReportesProductosPanel.jsx";
import UsuariosPanel from "./components/Usuario/UsuariosPanel.jsx";
import NuevoUsuarioPanel from "./components/Usuario/NuevoUsuarioPanel.jsx";
import EditarUsuarioPanel from "./components/Usuario/EditarUsuarioPanel.jsx";
import HistorialUsuarioPanel from "./components/Usuario/HistorialUsuarioPanel.jsx";
import PedidosPanel from "./components/Pedidos/PedidosPanel.jsx";
import DetallePedidoPanel from "./components/Pedidos/DetallePedidoPanel.jsx";
import SolicitudesPanel from "./components/Solicitud/SolicitudesPanel.jsx";
import DetalleSolicitudPanel from "./components/Solicitud/DetalleSolicitudPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Usuarios from "./components/usuarios/Usuarios.JSX";
import Boleta from "./components/Boleta/Boleta.jsx";
import DetalleBoleta from "./components/Boleta/DetalleBoleta.jsx";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404</h1>
      <p>Ruta no encontrada.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirección inicial */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Dashboard principal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* productos */}
        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <ProductosPanel />
            </ProtectedRoute>
          }
        />

        {/* nuevo producto */}
        <Route
          path="/admin/producto-nuevo"
          element={
            <ProtectedRoute roles={["admin"]}>
              <NuevoProductoPanel />
            </ProtectedRoute>
          }
        />

        {/* editar producto */}
        <Route 
          path="/admin/editarProducto/:codigo" 
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditarProductoPanel />
            </ProtectedRoute>
          } />

        {/* productos poco stock */}
        <Route
          path="/admin/productos-poco-stock"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <ProductosPocoStockPanel />
            </ProtectedRoute>
          }
        />

        {/* reportes productos */}
        <Route
          path="/admin/reportes-productos"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <ReportesProductosPanel />
            </ProtectedRoute>
          }
        />

        {/* usuarios */}
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UsuariosPanel />
            </ProtectedRoute>
          }
        />

        {/* nuevo usuario */}
        <Route
          path="/admin/usuario-nuevo"
          element={
            <ProtectedRoute roles={["admin"]}>
              <NuevoUsuarioPanel />
            </ProtectedRoute>
          }
        />

        {/* editar usuario */}
        <Route
          path="/admin/usuario/editar/:run" 
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditarUsuarioPanel />
            </ProtectedRoute>
          }
        />  
        
        {/* historial usuario */}
        <Route
          path="/admin/usuario/historial/:run"  
          element={
            <ProtectedRoute roles={["admin"]}>
              <HistorialUsuarioPanel />
            </ProtectedRoute>
          }
        />

        {/* pedidos */}
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <PedidosPanel />
            </ProtectedRoute>
          }
        />

        {/* detalle pedido */}
        <Route
          path="/admin/pedidos/:id"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <DetallePedidoPanel />
            </ProtectedRoute>
          }
        />

        {/* solicitudes */}
        <Route
          path="/admin/solicitud/*"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <SolicitudesPanel />
            </ProtectedRoute>
          }
        />

        {/* Detalle solicitud */}
        <Route
          path="/admin/solicitud/:id"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <DetalleSolicitudPanel />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

