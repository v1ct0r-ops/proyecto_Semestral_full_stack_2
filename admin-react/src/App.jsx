import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/Dashboard/AdminPanel.jsx";
import ProductosPanel from "./components/Productos/ProductosPanel.jsx";
import NuevoProductoPanel from "./components/Productos/NuevoProductoPanel.jsx";
import EditarProductoPanel from "./components/Productos/EditarProductoPanel.jsx";
import PedidosPanel from "./components/Pedidos/PedidosPanel.jsx";
import DetallePedidoPanel from "./components/Pedidos/DetallePedidoPanel.jsx";
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

        {/* usuarios  solo probando no considerar*/}   
          <Route
          path="/admin/usuarios" element={<Usuarios />} />

        {/* Boleta */}
        <Route
          path="/admin/boleta" element={<Boleta />} />

        {/* Detalle de boleta */}
        <Route
          path="/admin/boleta/:numero" element={<DetalleBoleta />} />
          

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

