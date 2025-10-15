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
  // Importar datos base si no existen
  if (!localStorage.getItem("productos")) {
    import('../data/baseData.js').then(({ productosBase }) => {
      guardar("productos", productosBase);
    });
  }
  
  // Crear usuarios de prueba si no existen
  if (!localStorage.getItem("usuarios")) {
    const usuariosPrueba = [
      {
        run: "12345678-9",
        nombres: "Admin",
        apellidos: "Principal", 
        correo: "admin@test.com",
        fechaNacimiento: "1990-01-01",
        tipoUsuario: "admin",
        region: "Región Metropolitana",
        comuna: "Santiago",
        direccion: "Dirección Admin 123",
        pass: "1234",
        codigoReferido: "ADMIN123",
        puntos: 0,
        nivel: "Bronce"
      },
      {
        run: "98765432-1",
        nombres: "Vendedor",
        apellidos: "Principal",
        correo: "vendedor@test.com", 
        fechaNacimiento: "1992-01-01",
        tipoUsuario: "vendedor",
        region: "Región Metropolitana",
        comuna: "Santiago", 
        direccion: "Dirección Vendedor 456",
        pass: "1234",
        codigoReferido: "VEND123",
        puntos: 0,
        nivel: "Bronce"
      }
    ];
    guardar("usuarios", usuariosPrueba);
    console.log("Usuarios de prueba creados:", usuariosPrueba);
  }
  
  if (!localStorage.getItem("carrito")) guardar("carrito", []);
  if (!localStorage.getItem("resenas")) guardar("resenas", {});
}