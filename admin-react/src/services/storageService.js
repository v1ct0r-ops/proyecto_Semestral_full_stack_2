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

function obtenerBoletas() {
  return obtener("boletas", []);
}

function guardarBoletas(boletas) {
  guardar("boletas", boletas);
}

// =============== FUNCIONES HELPER PARA BOLETAS ===============
function obtenerProductosDeBoletaPorPedido(pedidoId) {
  // 1. Buscar el pedido
  const pedidos = obtenerPedidos();
  const pedido = pedidos.find(p => p.id === pedidoId);
  
  if (!pedido || !pedido.items) {
    return [];
  }

  // 2. Buscar la información completa de cada producto
  let productos = obtenerProductos();
  
  // Si no hay productos en localStorage, crearlos temporalmente
  if (productos.length === 0) {
    productos = [
      { codigo: 'PS001', nombre: 'PlayStation 5', categoria: 'Consolas', precio: 599999, stock: 5 },
      { codigo: 'XB002', nombre: 'Xbox Series X', categoria: 'Consolas', precio: 549999, stock: 3 },
      { codigo: 'SW003', nombre: 'Nintendo Switch', categoria: 'Consolas', precio: 299999, stock: 8 }
    ];
    // Guardarlos para la próxima vez
    guardarProductos(productos);
  }
  
  // 3. Combinar datos del pedido (cantidad, precio) con datos del producto (nombre, etc.)
  const productosCompletos = pedido.items.map(item => {
    const producto = productos.find(p => p.codigo === item.codigo);
    
    return {
      codigo: item.codigo,
      nombre: producto ? producto.nombre : `Producto ${item.codigo}`,
      categoria: producto ? producto.categoria : 'N/A',
      cantidad: item.cantidad,
      precioUnitario: item.precio,
      subtotal: item.cantidad * item.precio
    };
  });

  return productosCompletos;
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
  obtenerBoletas,
  guardarBoletas,
  obtenerProductosDeBoletaPorPedido,
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
  guardarPedidos,
  obtenerBoletas,
  guardarBoletas,
  obtenerProductosDeBoletaPorPedido
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