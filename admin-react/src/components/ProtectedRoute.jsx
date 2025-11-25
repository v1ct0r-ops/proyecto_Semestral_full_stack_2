import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles = [], children }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  // 1) Sin sesión, mostrar mensaje y opción de regresar
  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Acceso Restringido</h2>
        <p>Debes iniciar sesión para acceder a esta página.</p>
        <button onClick={() => window.location.href = '/cliente/login.html'}>
          Ir a Login
        </button>
        <button onClick={() => window.location.href = '/'} style={{ marginLeft: '8px' }}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  // 2) Con sesión pero rol no permitido
  const userRole = user.tipo?.toLowerCase();
  const allowedRoles = roles.map(role => role.toLowerCase());
  
  
  if (roles.length && !allowedRoles.includes(userRole)) {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }

  // 3) Autorizado
  return children;
}
