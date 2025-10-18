import { usuarioActual } from "../utils/storage";

export default function ProtectedRoute({ roles = [], children }) {
  const user = usuarioActual();

  // 1) Sin sesión, alerta y redirige a login
  if (!user) {
    alert("Debes iniciar sesión para acceder al panel.");
    window.location.href = "/cliente/login.html";   
    return null;
  }

  // 2) Con sesión pero rol no permitido, alerta y redirige a index.html
  if (roles.length && !roles.includes(user.tipoUsuario)) {
    alert("Acceso no permitido para tu rol.");
    window.location.href = "/cliente/index.html";
    return null;
  }

  // 3) Autorizado, si es admin o vendedor
  return children;
}
