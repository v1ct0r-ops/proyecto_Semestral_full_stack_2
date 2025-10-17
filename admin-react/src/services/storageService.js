// =============== UTILIDADES LOCALSTORAGE ===============
export function obtener(key, defecto) {
  try { 
    return JSON.parse(localStorage.getItem(key)) ?? defecto; 
  } catch { 
    return defecto; 
  }
}

export function guardar(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

// =============== FUNCIONES ESPECÍFICAS ===============
export function obtenerProductos() {
  return obtener("productos", []);
}

export function guardarProductos(productos) {
  guardar("productos", productos);
}

export function obtenerUsuarios() {
  return obtener("usuarios", []);
}

export function guardarUsuarios(usuarios) {
  guardar("usuarios", usuarios);
}

export function obtenerPedidos() {
  return obtener("pedidos", []);
}

export function guardarPedidos(pedidos) {
  guardar("pedidos", pedidos);
}

export function usuarioActual() {
  const sesion = obtener("sesion", null);
  if (!sesion) return null;
  const usuarios = obtener("usuarios", []);
  return usuarios.find(u => u.correo?.toLowerCase() === sesion.correo?.toLowerCase()) || null;
}

export function guardarSesion(usuario) {
  guardar("sesion", { correo: usuario.correo, tipo: usuario.tipoUsuario });
}

export function cerrarSesion() {
  localStorage.removeItem("sesion");
}

export function estaSesionActiva() {
  return !!usuarioActual();
}

export function esAdmin() {
  const u = usuarioActual();
  return !!(u && u.tipoUsuario === "admin");
}

export function esVendedor() {
  const u = usuarioActual();
  return !!(u && u.tipoUsuario === "vendedor");
}

// =============== INICIALIZACIÓN ===============
export function inicializarDatos() {
  // No escribir claves compartidas desde React.
  // Evita sobreescribir datos existentes del sitio HTML.
  // Mantener esta función por compatibilidad, pero sin acciones.
}