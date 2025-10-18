import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/Dashboard/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function NotFound() {
  return <div style={{padding:24}}><h1>404</h1><p>Ruta no encontrada.</p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
