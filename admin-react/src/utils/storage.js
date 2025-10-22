export function obtener(key, defecto) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defecto;
    const parsed = JSON.parse(raw);

    return parsed ?? defecto;
  } catch {
    return defecto;
  }
}

export function guardar(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

// Asegura que devolvemos SIEMPRE un array, aunque en storage haya otra cosa
function obtenerArray(key) {
  const v = obtener(key, []);
  return Array.isArray(v) ? v : [];
}

// === Sesión / Usuarios ===
export function usuarioActual() {
  const sesion = obtener("sesion", null);      
  if (!sesion) return null;

  const usuarios = obtenerArray("usuarios");      
  const correo = (sesion.correo || "").toLowerCase();

  return (
    usuarios.find(
      (u) => (u.correo || "").toLowerCase() === correo
    ) || null
  );
}

export function esAdmin() {
  const u = usuarioActual();
  return !!(u && u.tipoUsuario === "admin");
}

export function esVendedor() {
  const u = usuarioActual();
  return !!(u && u.tipoUsuario === "vendedor");
}

export function obtenerPedidos() {
  return obtenerArray("pedidos");
}

export function guardarPedidos(peds) {
  guardar("pedidos", Array.isArray(peds) ? peds : []);
}
