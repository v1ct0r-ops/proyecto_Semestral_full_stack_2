// =============== UTILIDADES LOCALSTORAGE (MIGRADO DE app.js) ===============

function obtener(key, defecto) {
  try { 
    return JSON.parse(localStorage.getItem(key)) ?? defecto; 
  } catch { 
    return defecto; 
  }
}

function guardar(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

// =============== FUNCIONES ESPECÍFICAS ===============
function obtenerProductos() {
  return obtener("productos", []);
}

function guardarProductos(productos) {
  guardar("productos", productos);
}

function obtenerUsuarios() {
  return obtener("usuarios", []);
}

function guardarUsuarios(usuarios) {
  guardar("usuarios", usuarios);
}

function obtenerPedidos() {
  return obtener("pedidos", []);
}

function guardarPedidos(pedidos) {
  guardar("pedidos", pedidos);
}

// =============== FUNCIONES DE SESIÓN ===============
function usuarioActual() {
  const sesion = obtener("sesion", null);
  if (!sesion) return null;
  const usuarios = obtenerUsuarios();
  return usuarios.find(u => u.correo?.toLowerCase() === sesion.correo?.toLowerCase()) || null;
}

function guardarSesion(usuario) {
  guardar("sesion", { correo: usuario.correo, tipo: usuario.tipoUsuario });
}

function cerrarSesion() {
  localStorage.removeItem("sesion");
}

// Funciones de validación de roles
function esAdmin() {
  const user = usuarioActual();
  return user && user.tipoUsuario === 'admin';
}

function esVendedor() {
  const user = usuarioActual();
  return user && user.tipoUsuario === 'vendedor';
}

function estaSesionActiva() {
  return usuarioActual() !== null;
}

// Exportar como objeto StorageService
export const StorageService = {
  obtener,
  guardar,
  obtenerProductos,
  guardarProductos,
  obtenerUsuarios,
  guardarUsuarios,
  obtenerPedidos,
  guardarPedidos,
  usuarioActual,
  guardarSesion,
  cerrarSesion,
  esAdmin,
  esVendedor,
  estaSesionActiva
};

// Exportar funciones individuales para compatibilidad
export { 
  obtener,
  guardar,
  usuarioActual, 
  esAdmin, 
  esVendedor, 
  estaSesionActiva, 
  cerrarSesion,
  obtenerProductos,
  guardarProductos,
  obtenerUsuarios,
  guardarUsuarios,
  obtenerPedidos,
  guardarPedidos
};

// =============== INICIALIZACIÓN ===============
export function inicializarDatos() {
  // Importar datos base si no existen
  if (!localStorage.getItem("productos")) {
    import('../data/baseData.js').then(({ productosBase }) => {
      guardar("productos", productosBase);
    });
  }
  if (!localStorage.getItem("usuarios")) guardar("usuarios", []);
  if (!localStorage.getItem("carrito")) guardar("carrito", []);
  if (!localStorage.getItem("resenas")) guardar("resenas", {});
}