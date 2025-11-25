// Re-export functions from the new API service
import * as apiService from '../services/apiService.js';

// Mantener compatibilidad con funciones síncronas para localStorage directo
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

// === Funciones que ahora usan API (async) ===
export async function usuarioActual() {
  return await apiService.usuarioActual();
}

// Versión síncrona para compatibilidad inmediata
export function usuarioActualSync() {
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

export async function esAdmin() {
  return await apiService.esAdmin();
}

export async function esVendedor() {
  return await apiService.esVendedor();
}

// Versiones síncronas para compatibilidad
export function esAdminSync() {
  const u = usuarioActualSync();
  return !!(u && u.tipoUsuario === "admin");
}

export function esVendedorSync() {
  const u = usuarioActualSync();
  return !!(u && u.tipoUsuario === "vendedor");
}

export async function obtenerPedidos() {
  return await apiService.obtenerPedidos();
}

export function obtenerPedidosSync() {
  return obtenerArray("pedidos");
}

export function guardarPedidos(peds) {
  guardar("pedidos", Array.isArray(peds) ? peds : []);
}

// Re-export API functions
export { 
  login, 
  register, 
  logout, 
  obtenerProductos, 
  obtenerProductoPorCodigo,
  crearProducto,
  actualizarProducto,
  obtenerCarrito,
  guardarCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  limpiarCarrito,
  crearPedido,
  actualizarEstadoPedido
} from '../services/apiService.js';
