import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/Dashboard/AdminPanel.jsx";
import PedidosPanel from "./components/pedido/PedidosPanel.jsx";
import DetallePedidoPanel from "./components/pedido/DetallePedidoPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
