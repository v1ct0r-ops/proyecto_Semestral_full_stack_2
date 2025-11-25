// =============== CONFIGURACIÓN ===============
const API_BASE_URL = 'http://localhost:8080/api';

// =============== CACHE GLOBAL DE PRODUCTOS ===============
let productosCache = null;

// =============== DATOS ESTÁTICOS ===============
const REGIONES_COMUNAS = {
  "Metropolitana": [
    "Santiago", "Las Condes", "Providencia", "Ñuñoa", "La Florida", "Maipú", 
    "Puente Alto", "Peñalolén", "La Reina", "Vitacura", "Lo Barnechea", 
    "Macul", "San Miguel", "Quinta Normal", "Estación Central"
  ],
  "Valparaíso": [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", 
    "Casablanca", "San Antonio", "Cartagena", "El Quisco", "Algarrobo"
  ],
  "Biobío": [
    "Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel", 
    "San Pedro de la Paz", "Hualpén", "Tomé", "Penco", "Lota"
  ],
  "La Araucanía": [
    "Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", 
    "Victoria", "Nueva Imperial", "Lautaro", "Pitrufquén", "Carahue"
  ],
  "Los Lagos": [
    "Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud", 
    "Calbuco", "Frutillar", "Los Muermos", "Maullín", "Llanquihue"
  ],
  "Antofagasta": [
    "Antofagasta", "Calama", "Tocopilla", "Mejillones", "San Pedro de Atacama", 
    "Taltal", "Sierra Gorda", "María Elena", "Ollagüe"
  ],
  "Atacama": [
    "Copiapó", "Vallenar", "Chañaral", "Diego de Almagro", "Caldera", 
    "Tierra Amarilla", "Alto del Carmen", "Freirina", "Huasco"
  ],
  "Coquimbo": [
    "La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña", "Combarbalá", 
    "Los Vilos", "Andacollo", "Monte Patria", "Punitaqui"
  ]
};

const CATEGORIAS_PRODUCTOS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas",
  "Computadores Gamers",
  "Sillas Gamers",
  "Mouse",
  "Mousepad",
  "Poleras Personalizadas",
  "Polerones Gamers Personalizados",
  "Servivio técnico"
];


// =============== GESTIÓN DE USUARIOS ===============
function crearUsuariosPrueba() {
  const usuariosIniciales = [
    {
      run: "12345678-9",
      nombres: "Administrador",
      apellidos: "Sistema",
      correo: "admin@levelup.cl",
      pass: "admin123",
      tipoUsuario: "admin",
      region: "Metropolitana",
      comuna: "Santiago",
      direccion: "Av. Principal 123",
      fechaNacimiento: "1985-01-01",
      descuentoDuoc: false,
      puntosLevelUp: 0,
      codigoReferido: "ADMIN001",
      compras: []
    },
    {
      run: "33333333-3",
      nombres: "Richard",
      apellidos: "Moreano",
      correo: "richard@duoc.cl",
      pass: "admin",
      tipoUsuario: "admin",
      region: "Metropolitana",
      comuna: "Santiago",
      direccion: "Campus Duoc UC",
      fechaNacimiento: "1990-01-01",
      descuentoDuoc: true,
      puntosLevelUp: 0,
      codigoReferido: "RICH001",
      compras: []
    },
    {
      run: "98765432-1",
      nombres: "Juan Carlos",
      apellidos: "Vendedor",
      correo: "vendedor@levelup.cl",
      pass: "vendedor123",
      tipoUsuario: "vendedor",
      region: "Metropolitana",
      comuna: "Las Condes",
      direccion: "Av. Apoquindo 456",
      fechaNacimiento: "1988-03-15",
      descuentoDuoc: false,
      puntosLevelUp: 0,
      codigoReferido: "VEND001",
      compras: []
    }
  ];
  
  return usuariosIniciales;
}

// =============== UTILIDADES ===============
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

function eliminarUsuarioFantasma() {
  
  // Obtener TODAS las keys antes de empezar
  const todasLasKeys = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
  
  let eliminados = 0;
  
  // Lista COMPLETA de keys prohibidas (EXCLUIMOS 'usuario' porque es la key correcta para datos de usuario)
  const keysProhibidas = [
    'usuarioActual', 'currentUser', 'user', 'session', 'login',
    'userData', 'authData', 'sessionData', 'logged', 'isLogged', 'auth',
    'loggedIn', 'userInfo', 'profile', 'account', 'clientData', 'userSession'
  ];
  
  // Eliminar keys prohibidas específicas
  keysProhibidas.forEach(key => {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      eliminados++;
    }
    if (sessionStorage.getItem(key) !== null) {
      sessionStorage.removeItem(key);
      eliminados++;
    }
  });
  
  // NO verificar contenido de keys permitidas de localStorage - solo eliminar keys no permitidas que NO sean sospechosas
  [...Object.keys(localStorage)].forEach(key => {
    // Solo preservar keys legítimas: 'carrito', 'jwt_token', 'token', 'refreshToken', 'usuario'
    const keysPermitidas = ['carrito', 'jwt_token', 'token', 'refreshToken', 'usuario'];
    if (!keysPermitidas.includes(key)) {
      // Solo eliminar si el nombre de la key es obviamente sospechoso
      if (key.includes('user') || key.includes('auth') || key.includes('login') || key.includes('session')) {
        localStorage.removeItem(key);
        eliminados++;
      }
    }
  });
  
  // Limpiar sessionStorage completamente (excepto keys permitidas)
  [...Object.keys(sessionStorage)].forEach(key => {
    const keysPermitidas = ['carrito', 'jwt_token', 'token', 'refreshToken', 'usuario'];
    if (!keysPermitidas.includes(key)) {
      sessionStorage.removeItem(key);
      eliminados++;
    }
  });
  
  // Estado final
  const finales = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
  
  if (eliminados > 0) {
  } else {
  }
}

function usuarioActual() {
  // PRIMERO: Eliminar cualquier usuario fantasma antes de verificar sesión
  eliminarUsuarioFantasma();
  
  // Solo verificar si hay token JWT válido del backend
  const token = localStorage.getItem('jwt_token');
  
  
  if (!token) {
    return null;
  }

  try {
    // Decodificar JWT para obtener datos de sesión
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verificar que no esté expirado
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
      return null;
    }
    
    // Obtener datos completos del usuario desde localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      try {
        const datosUsuario = JSON.parse(usuarioGuardado);
        
        // Verificar que los datos sean válidos
        if (datosUsuario && datosUsuario.nombres && datosUsuario.correo) {
          return datosUsuario;
        } else {
        }
      } catch (e) {
      }
    }
    
    // Limpiar todo y forzar re-login
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    
    return null;
  } catch (error) {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    return null;
  }
}

// =============== FUNCIONES JWT ===============

// Usar el sistema de login original del usuario (sin JWT backend)
function loginUsuario(correo, password) {
  return new Promise((resolve, reject) => {
    // Validaciones básicas
    if (!correo || !password) {
      reject(new Error('Correo y contraseña son requeridos'));
      return;
    }
    
    if (password.length < 6 || password.length > 10) {
      reject(new Error('Contraseña debe tener entre 6 y 10 caracteres'));
      return;
    }
    
    const usuarios = obtener("usuarios", []);
    const usuario = usuarios.find(u => u.correo?.toLowerCase() === correo.toLowerCase());
    
    if (!usuario) {
      reject(new Error('Usuario no encontrado'));
      return;
    }
    
    if (usuario.pass !== password) {
      reject(new Error('Contraseña incorrecta'));
      return;
    }
    
    // NO GUARDAR SESIÓN - Solo usar JWT del backend
    
    resolve({
      usuario: usuario,
      message: `¡Bienvenido/a, ${usuario.nombres || 'Usuario'}!`
    });
  });
}

function cerrarSesion() {
  
  // Limpiar TODAS las claves de autenticación
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('usuario');
  localStorage.removeItem('sesion');
  localStorage.removeItem('sesionActual');
  
  
  // Actualizar navegación inmediatamente
  actualizarNavegacion();
  
  // Forzar recarga completa para limpiar todo el estado en memoria
  window.location.reload();
}

// =============== NAVEGACIÓN ===============
function actualizarNavegacion() {
  // LIMPIEZA ADICIONAL en cada actualización de navegación
  eliminarUsuarioFantasma();
  
  const u = usuarioActual();
  
  // DEBUG: Ver el tipo de usuario
  if (u) {
  }
  
  // Enlaces de navegación
  const linkRegistro = document.getElementById("linkRegistro");
  const linkLogin = document.getElementById("linkLogin");
  const linkSalir = document.getElementById("linkSalir");
  const linkAdmin = document.getElementById("linkAdmin");
  const linkVendedor = document.getElementById("linkVendedor");
  const linkMiCuenta = document.getElementById("linkMiCuenta");
  const btnPerfilDesk = document.getElementById("btnPerfilDesk");

  if (linkRegistro) linkRegistro.classList.toggle("oculto", !!u);
  if (linkLogin) linkLogin.classList.toggle("oculto", !!u);
  if (linkSalir) linkSalir.classList.toggle("oculto", !u);

  // Normalizar el tipo de usuario y soportar formatos como 'ROLE_ADMIN', 'Admin', 'admin'
  const tipo = (u && u.tipoUsuario) ? String(u.tipoUsuario).toLowerCase() : '';
  const esAdmin = tipo.includes('admin');
  const esVendedor = tipo.includes('vendedor') || tipo.includes('seller');

  if (linkAdmin) linkAdmin.classList.toggle('oculto', !(u && esAdmin));
  if (linkVendedor) linkVendedor.classList.toggle('oculto', !(u && esVendedor));

  if (linkMiCuenta) linkMiCuenta.classList.toggle("oculto", !u);
  if (btnPerfilDesk) btnPerfilDesk.classList.toggle("oculto", !u);

  actualizarContadorCarrito();
}

// =============== CARRITO ===============
function obtenerCarrito() { 
  return obtener("carrito", []); 
}

function guardarCarrito(c) { 
  guardar("carrito", c); 
  actualizarContadorCarrito(); 
  renderCarrito(); 
}

async function agregarAlCarrito(codigo, cantidad = 1) {
  
  // Asegurar que tenemos productos del backend
  let productos = productosCache;
  if (!productos || productos.length === 0) {
    productos = await obtenerProductos();
    productosCache = productos;
  }
  
  const prod = productos.find(p => p.codigo === codigo);
  if (!prod) {
    mostrarDialogoStock("Producto no encontrado", "Error");
    return;
  }

  const stock = Number(prod.stock) || 0;
  if (stock <= 0) {
    mostrarDialogoStock("Sin stock disponible", "Stock");
    return;
  }

  const carrito = obtenerCarrito();
  const idx = carrito.findIndex(it => it.codigo === codigo);
  const enCarrito = idx >= 0 ? (Number(carrito[idx].cantidad) || 0) : 0;

  const restante = stock - enCarrito;
  if (restante <= 0) {
    mostrarDialogoStock("Alcanzaste el máximo según stock disponible para este producto.", "Stock");
    return;
  }

  const aAgregar = Math.min(Number(cantidad) || 1, restante);

  if (idx >= 0) carrito[idx].cantidad = enCarrito + aAgregar;
  else carrito.push({ codigo, cantidad: aAgregar });

  guardarCarrito(carrito);

  if ((Number(cantidad) || 1) > aAgregar) {
    mostrarDialogoStock(`Solo quedaban ${restante} unidad(es) disponibles. Se ajustó la cantidad en el carrito.`, "Stock");
  } else {
  }
}

function quitarDelCarrito(codigo) {
  guardarCarrito(obtenerCarrito().filter(it => it.codigo !== codigo));
}

async function cambiarCantidad(codigo, nuevaCant) {
  
  // Asegurar que tenemos productos del backend
  let productos = productosCache;
  if (!productos || productos.length === 0) {
    productos = await obtenerProductos();
    productosCache = productos;
  }
  
  const prod = productos.find(p => p.codigo === codigo);
  if (!prod) return;

  const stock = Number(prod.stock) || 0;

  const c = obtenerCarrito();
  const i = c.findIndex(it => it.codigo === codigo);
  if (i >= 0) {
    let cant = Math.max(1, parseInt(nuevaCant || "1", 10));
    if (cant > stock) {
      cant = stock;
      mostrarDialogoStock(`La cantidad supera el stock disponible (${stock}). Se ajustó automáticamente.`, "Stock");
    }
    c[i].cantidad = cant;
  }
  guardarCarrito(c);
}

function actualizarContadorCarrito() {
  const total = obtenerCarrito().reduce((sum, it) => sum + (Number(it.cantidad) || 0), 0);
  const el = document.getElementById("contadorCarrito");
  if (el) el.textContent = total;
}

async function renderCarrito() {
  const cont = document.getElementById("listaCarrito");
  if (!cont) return;
  
  const carrito = obtenerCarrito();
  
  if (carrito.length === 0) {
    cont.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
    const totalEl = document.getElementById("totalCarrito");
    if (totalEl) totalEl.textContent = formatoPrecio(0);
    return;
  }
  
  // Asegurarnos de tener productos desde el backend
  let productos = productosCache;
  if (!productos || productos.length === 0) {
    productos = await obtenerProductos();
    productosCache = productos;
  }
  
  let total = 0, totalSinDesc = 0;
  
  const itemsHTML = carrito.map(it => {
    const p = productos.find(x => x.codigo === it.codigo);
    if (!p) {
      return `<div class="item-carrito">
        <div><strong>Producto no disponible</strong><br><small>${it.codigo}</small></div>
        <div>—</div>
        <div>
          <button class="btn peligro" onclick="quitarDelCarrito('${it.codigo}')">Eliminar</button>
        </div>
      </div>`;
    }
    
    const precio = precioConDescuento(p.precio);
    total += precio * it.cantidad;
    totalSinDesc += p.precio * it.cantidad;
    
    const stockDisp = Number(p.stock) || 0;
    
    return `<div class="item-carrito">
      <div><strong>${p.nombre}</strong><br><small>${p.codigo}</small></div>
      <div>${formatoPrecio(precio)}</div>
      <div>
        <input type="number" min="1" max="${stockDisp}" value="${Math.min(it.cantidad, stockDisp)}"
              onchange="cambiarCantidad('${p.codigo}', this.value)">
        <button class="btn secundario" onclick="quitarDelCarrito('${p.codigo}')">Quitar</button>
        ${stockDisp <= (p.stockCritico ?? -1) ? '<small class="stock-critico">⚠ Bajo stock</small>' : ''}
      </div>
    </div>`;
  });
  
  cont.innerHTML = itemsHTML.join("");

  const u = usuarioActual();
  if (document.getElementById("textoDescuento")) {
    const hayDuoc = !!(u && u.correo?.toLowerCase().endsWith("@duoc.cl"));
    document.getElementById("textoDescuento").classList.toggle("oculto", !(hayDuoc && totalSinDesc > total));
    if (hayDuoc) document.getElementById("montoDescuento").textContent = "- " + formatoPrecio(totalSinDesc - total);
  }
  
  const totalEl = document.getElementById("totalCarrito");
  if (totalEl) totalEl.textContent = formatoPrecio(total);
}

// =============== FUNCIONES HELPER PARA CARRITO ===============
function formatoPrecio(num) {
  return num.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function precioConDescuento(precio) {
  const u = usuarioActual();
  const esDuoc = !!(u && u.correo?.toLowerCase().endsWith("@duoc.cl"));
  return esDuoc ? Math.round(precio * 0.8) : precio; // 20% descuento Duoc
}

function mostrarDialogoStock(mensaje, titulo = "Aviso") {
  let dlg = document.getElementById("dlgAvisoStock");
  // Si la página no lo tiene, lo creamos dinámicamente
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "dlgAvisoStock";
    dlg.className = "modal";
    dlg.innerHTML = `
      <form method="dialog" class="formulario" style="min-width:320px;max-width:480px">
        <h3 id="dlgAvisoStockTitulo">Aviso</h3>
        <p id="dlgAvisoStockMsg">Mensaje</p>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <button class="btn primario" value="ok">Entendido</button>
        </div>
      </form>
    `;
    document.body.appendChild(dlg);
  }
  
  document.getElementById("dlgAvisoStockTitulo").textContent = titulo;
  document.getElementById("dlgAvisoStockMsg").textContent = mensaje;
  dlg.showModal();
}

// =============== FUNCIONALIDAD DE PROCESAR PAGO ===============
async function procesarPago() {
  const carrito = obtenerCarrito();
  
  if (carrito.length === 0) {
    mostrarDialogoStock("El carrito está vacío. Agrega productos antes de procesar el pago.", "Carrito Vacío");
    return;
  }
  
  const usuario = usuarioActual();
  if (!usuario) {
    mostrarDialogoStock("Debes iniciar sesión para procesar el pago.", "Sesión Requerida");
    window.location.href = "/cliente/login.html";
    return;
  }
  
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    mostrarDialogoStock("Sesión expirada. Por favor inicia sesión nuevamente.", "Sesión Expirada");
    window.location.href = "/cliente/login.html";
    return;
  }
  
  try {
    // Verificar stock actualizado antes de procesar
    const productos = productosCache || await obtenerProductos();
    let hayProblemas = false;
    
    for (const item of carrito) {
      const producto = productos.find(p => p.codigo === item.codigo);
      if (!producto) {
        mostrarDialogoStock(`El producto ${item.codigo} ya no está disponible.`, "Producto No Disponible");
        hayProblemas = true;
        break;
      }
      
      if (producto.stock < item.cantidad) {
        mostrarDialogoStock(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, solicitado: ${item.cantidad}.`, "Stock Insuficiente");
        hayProblemas = true;
        break;
      }
    }
    
    if (hayProblemas) return;
    
    // Calcular total para mostrar al usuario
    let total = 0;
    carrito.forEach(it => {
      const p = productos.find(x => x.codigo === it.codigo);
      if (p) {
        const precio = precioConDescuento(p.precio);
        total += precio * it.cantidad;
      }
    });
    
    // Preparar datos para el backend según la estructura esperada
    const pedidoRequest = {
      items: carrito.map(item => ({
        productoCodigo: item.codigo,
        cantidad: item.cantidad
      })),
      direccion: usuario.direccion || "",
      region: usuario.region || "",
      comuna: usuario.comuna || "",
      puntosAUsar: 0 // Por ahora no usamos puntos
    };
    
    // Llamar al backend para crear el pedido
    const response = await fetch(`${API_BASE_URL}/v1/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pedidoRequest)
    });
    
    if (response.ok) {
      const pedidoCreado = await response.json();
      
      // Limpiar carrito después del pago exitoso
      guardarCarrito([]);
      
      // Mostrar mensaje de éxito
      mostrarDialogoStock(`¡Pago procesado exitosamente! 
      
Pedido #${pedidoCreado.id}
Total: ${formatoPrecio(total)}
      
Tu pedido ha sido guardado y será procesado pronto.`, "Pago Exitoso");
      
      // Redirigir a mis compras para ver el pedido
      setTimeout(() => {
        window.location.href = "/cliente/misCompras.html";
      }, 4000);
      
    } else {
      const errorData = await response.text();
      console.error('❌ Error del backend al crear pedido:', response.status, errorData);
      
      if (response.status === 401) {
        mostrarDialogoStock("Sesión expirada. Por favor inicia sesión nuevamente.", "Sesión Expirada");
        localStorage.removeItem('jwt_token');
        window.location.href = "/cliente/login.html";
      } else {
        mostrarDialogoStock("Error al procesar el pedido en el servidor. Inténtalo nuevamente.", "Error del Servidor");
      }
    }
    
  } catch (error) {
    console.error('❌ Error de conexión al procesar pago:', error);
    mostrarDialogoStock("Error de conexión. Verifica que el backend esté funcionando e inténtalo nuevamente.", "Error de Conexión");
  }
}

// Exponer funciones globalmente
Object.assign(window, {
  agregarAlCarrito,
  quitarDelCarrito,
  cambiarCantidad,
  procesarPago
});

// =============== FORMULARIOS ===============
function inicializarLogin() {
  const form = document.getElementById("formLogin");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const correo = document.getElementById("correoLogin").value.trim();
    const password = document.getElementById("passwordLogin").value;
    
    try {
      const resultado = await loginUsuario(correo, password);
      const msg = document.getElementById("msgLogin");
      if (msg) msg.textContent = resultado.message;
      
      setTimeout(() => {
        window.location.href = "productos.html";
      }, 700);
    } catch (error) {
      const msg = document.getElementById("msgLogin");
      if (msg) msg.textContent = error.message;
    }
  });
}

// =============== VALIDACIONES DE FORMULARIO ===============

// Funciones de validación
function validarRUN(run) {
  if (!run) return "El RUN es obligatorio";
  
  // Remover puntos y guiones
  run = run.replace(/[\.\-]/g, '').toUpperCase();
  
  if (run.length < 8 || run.length > 9) {
    return "RUN debe tener entre 8 y 9 caracteres";
  }
  
  // Verificar formato básico
  if (!/^\d{7,8}[0-9K]$/.test(run)) {
    return "Formato de RUN inválido";
  }
  
  return null; // Sin error
}

function validarCorreo(correo) {
  if (!correo) return "El correo es obligatorio";
  
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!formatoValido) return "Formato de correo inválido";
  
  const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
  const dominio = correo.split('@')[1];
  
  if (!dominiosPermitidos.includes(dominio)) {
    return "Solo se permiten correos: @duoc.cl, @profesor.duoc.cl, @gmail.com";
  }
  
  return null;
}

function validarFecha(fecha) {
  if (!fecha) return "La fecha de nacimiento es obligatoria";
  
  const hoy = new Date();
  const fechaNac = new Date(fecha);
  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  
  if (edad < 18) return "Debes ser mayor de 18 años";
  if (edad > 120) return "Fecha inválida";
  
  return null;
}

// Funciones específicas para el perfil
function esCorreoPermitido(correo) {
  if (!correo) return false;
  const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
  const dominio = correo.split('@')[1];
  return dominiosPermitidos.includes(dominio);
}

function esMayorDe18(fecha) {
  if (!fecha) return false;
  const hoy = new Date();
  const fechaNac = new Date(fecha);
  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  return edad >= 18 && edad <= 120;
}

function validarPassword(password, password2) {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 6) return "Mínimo 6 caracteres";
  if (password.length > 10) return "Máximo 10 caracteres";
  
  if (password2 !== undefined && password !== password2) {
    return "Las contraseñas no coinciden";
  }
  
  return null;
}

function mostrarError(campo, mensaje) {
  const errorElement = document.getElementById(`err${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
  if (errorElement) {
    if (mensaje && mensaje.trim() !== '') {
      errorElement.textContent = mensaje;
      errorElement.style.display = 'block';
    } else {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
}

function limpiarErrores() {
  const campos = ['Run', 'Nombres', 'Apellidos', 'Correo', 'Fecha', 'Tipo', 'Region', 'Comuna', 'Direccion', 'Pass', 'Pass2'];
  campos.forEach(campo => mostrarError(campo.toLowerCase(), ''));
}

// Funciones específicas para login  
function limpiarErroresLogin() {
  const msgLogin = document.getElementById('msgLogin');
  if (msgLogin) {
    msgLogin.textContent = '';
    msgLogin.style.display = 'none';
    msgLogin.classList.remove('exito', 'error');
  }
}

function mostrarMensajeLogin(mensaje, tipo = 'exito') {
  const msgElement = document.getElementById('msgLogin');
  if (msgElement) {
    msgElement.textContent = mensaje;
    msgElement.style.display = 'block';
    
    // Remover clases previas y agregar la apropiada
    msgElement.classList.remove('exito', 'error');
    
    if (tipo === 'error') {
      msgElement.classList.add('error');
    } else {
      msgElement.classList.add('exito');
    }
  }
}

function validarFormulario(datos) {
  limpiarErrores();
  let esValido = true;
  
  // Validar RUN
  const errorRun = validarRUN(datos.run);
  if (errorRun) {
    mostrarError('run', errorRun);
    esValido = false;
  }
  
  // Validar nombres (obligatorio)
  if (!datos.nombres.trim()) {
    mostrarError('nombres', 'Los nombres son obligatorios');
    esValido = false;
  }
  
  // Validar apellidos (obligatorio)
  if (!datos.apellidos.trim()) {
    mostrarError('apellidos', 'Los apellidos son obligatorios');
    esValido = false;
  }
  
  // Validar correo
  const errorCorreo = validarCorreo(datos.correo);
  if (errorCorreo) {
    mostrarError('correo', errorCorreo);
    esValido = false;
  }
  
  // Validar fecha
  const errorFecha = validarFecha(datos.fechaNacimiento);
  if (errorFecha) {
    mostrarError('fecha', errorFecha);
    esValido = false;
  }
  
  // Validar región
  if (!datos.region) {
    mostrarError('region', 'Selecciona una región');
    esValido = false;
  }
  
  // Validar comuna
  if (!datos.comuna) {
    mostrarError('comuna', 'Selecciona una comuna');
    esValido = false;
  }
  
  // Validar dirección
  if (!datos.direccion.trim()) {
    mostrarError('direccion', 'La dirección es obligatoria');
    esValido = false;
  }
  
  // Validar contraseña
  const errorPass = validarPassword(datos.password, datos.password2);
  if (errorPass) {
    mostrarError('pass', errorPass);
    esValido = false;
  }
  
  // Validar confirmación de contraseña
  if (datos.password !== datos.password2) {
    mostrarError('pass2', 'Las contraseñas no coinciden');
    esValido = false;
  }
  
  return esValido;
}

function inicializarRegistro() {
  const form = document.getElementById("formRegistro");
  if (!form) {
    return;
  }

  // Poblar regiones y configurar eventos
  poblarRegiones();
  configurarEventosRegistro();
  
  // Limpiar errores y mensaje de éxito al inicio
  limpiarErrores();
  const msgElement = document.getElementById("msgRegistro");
  if (msgElement) {
    msgElement.textContent = '';
    msgElement.style.display = "none";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Verificar cada elemento individualmente
    const runElement = document.getElementById("run");
    const nombresElement = document.getElementById("nombres");
    const apellidosElement = document.getElementById("apellidos");
    const correoElement = document.getElementById("correo");
    const fechaNacimientoElement = document.getElementById("fechaNacimiento");
    const passwordElement = document.getElementById("password");
    const password2Element = document.getElementById("password2");
    const tipoElement = document.getElementById("tipoUsuario");
    const regionElement = document.getElementById("region");
    const comunaElement = document.getElementById("comuna");
    const direccionElement = document.getElementById("direccion");
    
    const datos = {
      run: runElement?.value.trim() || '',
      nombres: nombresElement?.value.trim() || '',
      apellidos: apellidosElement?.value.trim() || '',
      correo: correoElement?.value.trim() || '',
      fechaNacimiento: fechaNacimientoElement?.value || '',
      password: passwordElement?.value || '',
      password2: password2Element?.value || '',
      tipoUsuario: tipoElement?.value.toUpperCase() || '',
      region: regionElement?.value || "",
      comuna: comunaElement?.value || "",
      direccion: direccionElement?.value.trim() || ''
    };
    
    // VALIDAR ANTES DE ENVIAR
    if (!validarFormulario(datos)) {
      mostrarMensajeRegistro("Por favor corrige los errores en el formulario", "error");
      return;
    }
    
    try {
      // Solo enviar datos necesarios para el backend (sin fechaNacimiento y password2)
      const datosBackend = {
        run: datos.run,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        correo: datos.correo,
        password: datos.password,
        tipoUsuario: datos.tipoUsuario,
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion
      };
      
      // Guardar datos adicionales localmente (como fechaNacimiento que el backend no maneja)
      if (datos.fechaNacimiento) {
        const datosLocales = {
          correo: datos.correo,
          fechaNacimiento: datos.fechaNacimiento
        };
        localStorage.setItem('datosUsuarioLocal', JSON.stringify(datosLocales));
      }
      
      await registrarUsuario(datosBackend);
      mostrarMensajeRegistro("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.", "exito");
      form.reset();
      limpiarErrores();
      // Limpiar selects después del reset
      poblarRegiones();
    } catch (error) {
      console.error('Error en registro:', error);
      mostrarMensajeRegistro("Error al crear la cuenta. Intenta nuevamente.", "error");
    }
  });
}

// Poblar dropdown de regiones
function poblarRegiones() {
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");
  
  if (!selectRegion) {
    return;
  }

  // Limpiar y agregar opción por defecto
  selectRegion.innerHTML = '<option value="">Selecciona una región</option>';
  
  // Agregar todas las regiones
  Object.keys(REGIONES_COMUNAS).forEach(region => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    selectRegion.appendChild(option);
  });

  // Limpiar comunas
  if (selectComuna) {
    selectComuna.innerHTML = '<option value="">Primero selecciona una región</option>';
  }
}

// Configurar eventos para regiones/comunas
function configurarEventosRegistro() {
  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");
  
  if (!selectRegion || !selectComuna) return;

  selectRegion.addEventListener("change", () => {
    const regionSeleccionada = selectRegion.value;
    
    // Limpiar comunas
    selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
    
    if (regionSeleccionada && REGIONES_COMUNAS[regionSeleccionada]) {
      // Agregar comunas de la región seleccionada
      REGIONES_COMUNAS[regionSeleccionada].forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna;
        option.textContent = comuna;
        selectComuna.appendChild(option);
      });
    }
  });
}

// Mostrar mensaje de registro con estilo
function mostrarMensajeRegistro(mensaje, tipo = "exito") {
  const msgElement = document.getElementById("msgRegistro");
  
  if (!msgElement) {
    return;
  }

  if (mensaje && mensaje.trim() !== '') {
    msgElement.textContent = mensaje;
    msgElement.className = tipo; // "exito" o "error" - usa los estilos del CSS
    msgElement.style.display = "block";
  } else {
    msgElement.textContent = '';
    msgElement.style.display = "none";
  }
  

  // Si es éxito, redirigir al login después de 5 segundos
  if (tipo === "exito") {
    setTimeout(() => {
      window.location.href = '/cliente/login.html';
    }, 5000);
  } else {
    // Si es error, solo ocultar después de 5 segundos
    setTimeout(() => {
      msgElement.style.display = "none";
    }, 5000);
  }
}

// =============== PERFIL ===============
async function inicializarPerfil() {
  const form = document.getElementById("formPerfil");
  if (!form) return; // no estás en perfil.html

  const usuario = usuarioActual();
  if (!usuario) { 
    window.location.href = "login.html"; 
    return; 
  }

  // Referencias a los campos del formulario
  const iRun   = document.getElementById("p_run");
  const iNom   = document.getElementById("p_nombres");
  const iApe   = document.getElementById("p_apellidos");
  const iMail  = document.getElementById("p_correo");
  const iFecha = document.getElementById("p_fecha");
  const iReg   = document.getElementById("region");
  const iCom   = document.getElementById("comuna");
  const iDir   = document.getElementById("p_direccion");
  const msg    = document.getElementById("msgPerfil");

  // Cargar regiones y comunas usando REGIONES_COMUNAS definidas en el archivo
  if (iReg && iCom) {
    // Usar las regiones definidas directamente en app.js
    iReg.innerHTML = '<option value="">Selecciona una región</option>' + 
      Object.keys(REGIONES_COMUNAS).map(region => `<option value="${region}">${region}</option>`).join("");
    
    const actualizarComunas = () => {
      const regionSeleccionada = iReg.value;
      iCom.innerHTML = '<option value="">Selecciona una comuna</option>' + 
        (REGIONES_COMUNAS[regionSeleccionada] || []).map(c => `<option value="${c}">${c}</option>`).join("");
    };
    
    iReg.addEventListener("change", actualizarComunas);
    actualizarComunas(); // primera carga
  }

  // Establecer valores iniciales con los datos del usuario
  if (iRun)   iRun.value = usuario.run || "";
  if (iNom)   iNom.value = usuario.nombres || "";
  if (iApe)   iApe.value = usuario.apellidos || "";
  if (iMail)  iMail.value = usuario.correo || "";
  if (iFecha) iFecha.value = usuario.fechaNacimiento || "";
  if (iDir)   iDir.value = usuario.direccion || "";

  // Establecer región y comuna
  if (iReg && usuario.region) {
    iReg.value = usuario.region;
    if (iReg.dispatchEvent) {
      iReg.dispatchEvent(new Event("change"));
    }
  }
  
  if (iCom && usuario.comuna) {
    setTimeout(() => {
      iCom.value = usuario.comuna;
    }, 100); // Dar tiempo para que se carguen las comunas
  }

  // Configurar el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Limpiar mensajes de error
    ["errPNombres","errPApellidos","errPCorreo","errPFecha","errPRegion","errPComuna","errPDireccion","msgPerfil"]
      .forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.textContent = ""; 
      });

    const nombres = iNom.value.trim();
    const apellidos = iApe.value.trim();
    const correo = iMail.value.trim();
    const fechaNac = iFecha.value;
    const region = iReg ? iReg.value : "";
    const comuna = iCom ? iCom.value : "";
    const direccion = iDir.value.trim();

    let ok = true;
    
    // Validaciones básicas
    if (!nombres) { 
      document.getElementById("errPNombres").textContent = "Requerido."; 
      ok = false; 
    }
    if (!apellidos) { 
      document.getElementById("errPApellidos").textContent = "Requerido."; 
      ok = false; 
    }
    if (!esCorreoPermitido(correo) || correo.length > 100) {
      document.getElementById("errPCorreo").textContent = "Correo no permitido o demasiado largo."; 
      ok = false;
    }
    if (!esMayorDe18(fechaNac)) { 
      document.getElementById("errPFecha").textContent = "Debés ser mayor de 18."; 
      ok = false; 
    }
    if (iReg && !region) { 
      document.getElementById("errPRegion").textContent = "Seleccioná una región."; 
      ok = false; 
    }
    if (iCom && !comuna) { 
      document.getElementById("errPComuna").textContent = "Seleccioná una comuna."; 
      ok = false; 
    }
    if (!direccion || direccion.length > 300) { 
      document.getElementById("errPDireccion").textContent = "Dirección inválida (máx 300)."; 
      ok = false; 
    }

    if (!ok) return;

    try {
      // Actualizar datos del usuario en localStorage
      const usuarioActualizado = {
        ...usuario,
        nombres,
        apellidos,
        correo,
        fechaNacimiento: fechaNac,
        region,
        comuna,
        direccion
      };

      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // También guardar la fecha de nacimiento por separado para futuras sesiones
      if (fechaNac) {
        const datosLocales = {
          correo: correo,
          fechaNacimiento: fechaNac
        };
        localStorage.setItem('datosUsuarioLocal', JSON.stringify(datosLocales));
      }
      
      if (msg) {
        msg.textContent = "✅ Datos guardados correctamente.";
        msg.style.display = "block";
      }
      
      setTimeout(() => { 
        if (msg) {
          msg.textContent = ""; 
          msg.style.display = "none";
        }
      }, 3000);
      
      actualizarNavegacion();
      
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      if (msg) {
        msg.textContent = "❌ Error al guardar los datos.";
        msg.style.display = "block";
      }
    }
  });

  // =============== CONFIGURAR MODAL DE CAMBIO DE CONTRASEÑA ===============
  const dlg = document.getElementById("dlgPass");
  const btnCambiar = document.getElementById("btnCambiarPass");
  const formPass = document.getElementById("formPass");
  const btnCancelarPass = document.getElementById("btnCancelarPass");

  // Abrir modal
  if (btnCambiar && dlg) {
    btnCambiar.addEventListener("click", () => {
      dlg.showModal();
    });
  }

  // Cancelar modal
  if (btnCancelarPass && dlg) {
    btnCancelarPass.addEventListener("click", () => {
      dlg.close();
    });
  }

  // Submit cambio de contraseña
  if (formPass && dlg) {
    formPass.addEventListener("submit", (e) => {
      e.preventDefault();

      // Limpiar errores previos
      ["errPassActual", "errPassNueva", "errPassNueva2", "msgPass"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "";
      });

      const passActual = document.getElementById("passActual").value;
      const passNueva = document.getElementById("passNueva").value;
      const passNueva2 = document.getElementById("passNueva2").value;
      let ok = true;

      // Validaciones
      if (!passActual) {
        document.getElementById("errPassActual").textContent = "La contraseña actual es requerida";
        ok = false;
      }
      if (passNueva.length < 4 || passNueva.length > 10) {
        document.getElementById("errPassNueva").textContent = "Debe tener 4 a 10 caracteres";
        ok = false;
      }
      if (passNueva !== passNueva2) {
        document.getElementById("errPassNueva2").textContent = "La confirmación no coincide";
        ok = false;
      }

      if (!ok) {
        const msgEl = document.getElementById("msgPass");
        if (msgEl) {
          msgEl.textContent = 'Las contraseñas nuevas no coinciden';
          msgEl.style.display = 'block';
          msgEl.style.color = 'red';
          msgEl.style.backgroundColor = '#f8d7da';
          msgEl.style.borderColor = '#f5c6cb';
        }
        return;
      }

      // Intentar cambiar la contraseña por la API si hay token JWT
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
      const msgEl = document.getElementById("msgPass");

      if (token) {
        (async () => {
          try {
            const resp = await fetch(`${API_BASE_URL}/usuarios/me/cambiar-password`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ passwordActual: passActual, nuevaPassword: passNueva })
            });

            if (!resp.ok) {
              console.error('❌ Error HTTP al cambiar contraseña:', resp.status);
              if (msgEl) { 
                msgEl.textContent = '❌ Error al cambiar contraseña'; 
                msgEl.style.display = 'block'; 
                msgEl.style.color = 'red';
                msgEl.style.backgroundColor = '#f8d7da';
                msgEl.style.borderColor = '#f5c6cb';
              }
              return;
            }

            const data = await resp.json();
            if (data && data.success) {
              if (msgEl) { 
                msgEl.textContent = 'Contraseña actualizada ✔'; 
                msgEl.style.display = 'block'; 
                msgEl.style.color = 'green';
                msgEl.style.backgroundColor = '#d4edda';
                msgEl.style.borderColor = '#c3e6cb';
              }
              formPass.reset();
              setTimeout(() => { if (dlg) dlg.close(); if (msgEl) { msgEl.textContent = ''; msgEl.style.display = 'none'; } }, 1400);
            } else {
              if (msgEl) { 
                msgEl.textContent = 'La contraseña actual es incorrecta'; 
                msgEl.style.display = 'block'; 
                msgEl.style.color = 'red';
                msgEl.style.backgroundColor = '#f8d7da';
                msgEl.style.borderColor = '#f5c6cb';
              }
            }
          } catch (error) {
            console.error('❌ Error cambiando contraseña:', error);
            if (msgEl) { 
              msgEl.textContent = '❌ Error al cambiar contraseña'; 
              msgEl.style.display = 'block'; 
              msgEl.style.color = 'red';
              msgEl.style.backgroundColor = '#f8d7da';
              msgEl.style.borderColor = '#f5c6cb';
            }
          }
        })();
      } else {
        // Sin token: intentar cambiar contraseña en localStorage (usuarios locales)
        try {
          const uStr = localStorage.getItem('usuario');
          const u = uStr ? JSON.parse(uStr) : null;
          if (!u || !u.pass) {
            if (msgEl) { 
              msgEl.textContent = 'No es posible cambiar la contraseña localmente'; 
              msgEl.style.display = 'block'; 
              msgEl.style.color = 'red';
              msgEl.style.backgroundColor = '#f8d7da';
              msgEl.style.borderColor = '#f5c6cb';
            }
            return;
          }

          if (u.pass !== passActual) {
            if (msgEl) { 
              msgEl.textContent = 'La contraseña actual no coincide'; 
              msgEl.style.display = 'block'; 
              msgEl.style.color = 'red';
              msgEl.style.backgroundColor = '#f8d7da';
              msgEl.style.borderColor = '#f5c6cb';
            }
            return;
          }

          // Guardar nueva pass localmente
          u.pass = passNueva;
          localStorage.setItem('usuario', JSON.stringify(u));
          if (msgEl) { 
            msgEl.textContent = 'Contraseña actualizada ✔ (local)'; 
            msgEl.style.display = 'block'; 
            msgEl.style.color = 'green';
            msgEl.style.backgroundColor = '#d4edda';
            msgEl.style.borderColor = '#c3e6cb';
          }
          formPass.reset();
          setTimeout(() => { if (dlg) dlg.close(); if (msgEl) { msgEl.textContent = ''; msgEl.style.display = 'none'; } }, 1400);
        } catch (error) {
          console.error('❌ Error cambiando contraseña localmente:', error);
          if (msgEl) { 
            msgEl.textContent = '❌ Error al cambiar contraseña'; 
            msgEl.style.display = 'block'; 
            msgEl.style.color = 'red';
            msgEl.style.backgroundColor = '#f8d7da';
            msgEl.style.borderColor = '#f5c6cb';
          }
        }
      }
    });
  }
}

// =============== INICIALIZACIÓN ===============
async function inicializarPagina() {
  // Renderizar contenido específico por página - OPTIMIZADO
  const gridDestacados = document.getElementById("gridDestacados");
  const gridProductos = document.getElementById("gridProductos");
  
  // Mostrar loading mientras cargan los productos
  if (gridDestacados) {
    gridDestacados.innerHTML = '<div style="text-align: center; padding: 20px;"><p>🔄 Cargando productos destacados...</p></div>';
  }
  if (gridProductos) {
    gridProductos.innerHTML = '<div style="text-align: center; padding: 20px;"><p>🔄 Cargando productos...</p></div>';
  }
  
  // Cache productos una sola vez si hay múltiples grids
  if (gridDestacados || gridProductos) {
    const startTime = Date.now();
    productosCache = await obtenerProductos();
    const loadTime = Date.now() - startTime;
    
    if (gridDestacados) {
      renderDestacados(productosCache);
    }
    if (gridProductos) {
      renderProductos(productosCache);
    }
  }
  
  if (window.location.pathname.includes('producto.html')) {
    renderDetalleProducto();
  }
  
  // Inicializar perfil si estamos en perfil.html
  if (window.location.pathname.includes('perfil.html')) {
    await inicializarPerfil();
  }

  // Inicializar mis compras si estamos en misCompras.html
  if (window.location.pathname.includes('misCompras.html')) {
    await inicializarMisCompras();
  }
  
  // Limpiar errores de formularios al cargar la página
  if (document.getElementById('formLogin')) {
    limpiarErroresLogin();
  }
  if (document.getElementById('formRegistro')) {
    limpiarErrores();
    const msgRegistro = document.getElementById('msgRegistro');
    if (msgRegistro) {
      msgRegistro.textContent = '';
      msgRegistro.style.display = 'none';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // PRIMERO: Limpiar usuarios fantasma SIEMPRE al cargar cualquier página
  eliminarUsuarioFantasma();
  
  // Cargar datos iniciales
  if (!localStorage.getItem("carrito")) guardar("carrito", []);
  
  // Inicializar navegación sin usuarios locales
  actualizarNavegacion();
  
  // CONFIGURAR EVENT LISTENERS GLOBALES (delegación de eventos)
  setupEventListeners();
  
  // Inicializar página de forma asíncrona y optimizada
  inicializarPagina();
  
  // Configurar event listeners de navegación
  const linkSalir = document.getElementById("linkSalir");
  if (linkSalir && !linkSalir.dataset.bind) {
    linkSalir.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
    });
    linkSalir.dataset.bind = "1";
  }
  
  // Configurar botón perfil de escritorio
  const btnPerfilDesk = document.getElementById("btnPerfilDesk");
  if (btnPerfilDesk && !btnPerfilDesk.dataset.bind) {
    btnPerfilDesk.addEventListener("click", (e) => {
      e.preventDefault();
      const usuario = usuarioActual();
      if (usuario) {
        abrirPanelCuenta();
      } else {
        window.location.href = "login.html";
      }
    });
    btnPerfilDesk.dataset.bind = "1";
  }
  
  // Inicializar formularios
  inicializarLogin();
  inicializarRegistro();
  
  // Inicializar carrito
  renderCarrito();
  
  // Configurar botón de pago
  const btnPagar = document.getElementById("btnPagar");
  if (btnPagar && !btnPagar.dataset.bind) {
    btnPagar.addEventListener("click", (e) => {
      e.preventDefault();
      procesarPago();
    });
    btnPagar.dataset.bind = "1";
  }
  
  // Inicializar menú móvil
  inicializarMenuLateral();
});

// =============== MENÚ LATERAL (MÓVIL) ===============
function inicializarMenuLateral() {
  const btn = document.getElementById("btnMenu");
  const panel = document.getElementById("menuLateral");
  const cortina = document.getElementById("cortina");
  const navDesk = document.querySelector(".navegacion");
  const lista = document.getElementById("menuLista");
  
  if (!btn || !panel || !navDesk || !lista) return;

  // Reconstruir el nav móvil solo una vez
  if (!lista.dataset.clonado) {
    lista.innerHTML = "";

    // Si hay usuario, agregar "Mi cuenta" y "Salir" primero
    const u = usuarioActual();
    if (u) {
      const miCuenta = document.createElement("a");
      miCuenta.href = "#";
      miCuenta.id = "linkMiCuentaMov";
      miCuenta.textContent = "Mi cuenta";
      lista.appendChild(miCuenta);
    }

    // Clonar enlaces del nav de escritorio
    navDesk.querySelectorAll("a").forEach(a => {
      if (a.classList.contains("oculto")) return;
      if ((a.id||"").toLowerCase() === "linksalir") return;
      const nuevo = a.cloneNode(true);
      nuevo.removeAttribute("id");
      lista.appendChild(nuevo);
    });
    
    // Agregar salir al final si hay usuario
    if (u) {
      const salirMov = document.createElement("a");
      salirMov.href = "#";
      salirMov.id = "linkSalirMov";
      salirMov.textContent = "Salir";
      lista.appendChild(salirMov);
    }

    lista.dataset.clonado = "1";
  }

  // Funciones abrir/cerrar menú
  const abrir = () => {
    document.body.classList.add("menu-abierto");
    btn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    if (cortina) cortina.hidden = false;
  };
  
  const cerrar = () => {
    document.body.classList.remove("menu-abierto");
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    if (cortina) cortina.hidden = true;
  };

  // Event listeners del botón menú (solo una vez)
  if (!btn.dataset.bind) {
    btn.addEventListener("click", () => {
      document.body.classList.contains("menu-abierto") ? cerrar() : abrir();
    });
    
    if (cortina) {
      cortina.addEventListener("click", cerrar);
    }
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-abierto")) {
        cerrar();
      }
    });
    
    lista.addEventListener("click", (e) => {
      const esLink = e.target.closest("a");
      if (esLink) cerrar();
    });
    
    btn.dataset.bind = "1";
  }

  // Event listeners específicos del menú móvil
  const linkMiCuentaMov = document.getElementById("linkMiCuentaMov");
  if (linkMiCuentaMov && !linkMiCuentaMov.dataset.bind) {
    linkMiCuentaMov.addEventListener("click", (e) => {
      e.preventDefault();
      abrirPanelCuenta();
    });
    linkMiCuentaMov.dataset.bind = "1";
  }

  const linkSalirMov = document.getElementById("linkSalirMov");
  if (linkSalirMov && !linkSalirMov.dataset.bind) {
    linkSalirMov.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Usar la función cerrarSesion() que ya limpia todo correctamente
      cerrarSesion();
    });
    linkSalirMov.dataset.bind = "1";
  }
}

// =============== PANEL MI CUENTA ===============
// Guarda el usuario actual en localStorage
function guardarUsuarioActual(usuario) {
  if (usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
}
function asegurarCodigoReferido(usuario) {
  if (!usuario.codigoReferido) {
    usuario.codigoReferido = "REF" + Math.random().toString(36).substring(2,8).toUpperCase();
  }
}

function calcularNivel(p) {
  if (p >= 500) return "Oro";
  if (p >= 200) return "Plata";
  return "Bronce";
}


function abrirPanelCuenta() {
  const u = usuarioActual();
  const panel = document.getElementById("panelCuenta");
  const cortina = document.getElementById("cortinaCuenta");
  
  if (!u || !panel || !cortina) {
    return;
  }

  asegurarCodigoReferido(u);
  guardarUsuarioActual(u);

  // Llenar campos
  const nom = document.getElementById("cuentaNombre");
  const cor = document.getElementById("cuentaCorreo");
  const cod = document.getElementById("cuentaCodigoReferido");
  const pts = document.getElementById("cuentaPuntos");
  const niv = document.getElementById("cuentaNivel");
  
  if (nom) nom.textContent = `${u.nombres||""} ${u.apellidos||""}`.trim() || "—";
  if (cor) cor.textContent = u.correo || "—";
  if (cod) cod.value = u.codigoReferido;
  if (pts) pts.textContent = u.puntosLevelUp ?? 0;
  if (niv) niv.textContent = calcularNivel(u.puntosLevelUp || 0);

  // Configurar botón copiar (solo una vez)
  const btnCopiar = document.getElementById("btnCopiarCodigo");
  if (btnCopiar && !btnCopiar.dataset.bind) {
    btnCopiar.addEventListener("click", () => {
      const inp = document.getElementById("cuentaCodigoReferido");
      if (inp) {
        inp.select();
        document.execCommand("copy");
        btnCopiar.textContent = "¡Copiado!";
        setTimeout(() => btnCopiar.textContent = "Copiar", 1200);
      }
    });
    btnCopiar.dataset.bind = "1";
  }

  // Función cerrar panel
  const cerrar = () => {
    panel.classList.remove("panel-cuenta--abierto");
    panel.setAttribute("aria-hidden", "true");
    cortina.hidden = true;
  };

  // Configurar botón cerrar (solo una vez)
  const btnCerrar = document.getElementById("btnCerrarCuenta");
  if (btnCerrar && !btnCerrar.dataset.bind) {
    btnCerrar.addEventListener("click", cerrar);
    btnCerrar.dataset.bind = "1";
  }

  // Configurar cortina (solo una vez)
  if (!cortina.dataset.bind) {
    cortina.addEventListener("click", cerrar);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("panel-cuenta--abierto")) {
        cerrar();
      }
    });
    cortina.dataset.bind = "1";
  }

  // Configurar botón salir del panel (solo una vez)
  const btnSalir = document.getElementById("btnSalirCuenta");
  if (btnSalir && !btnSalir.dataset.bind) {
    btnSalir.addEventListener("click", () => {
      cerrar(); // Cerrar el panel primero
      
      // Usar la función cerrarSesion() que ya limpia todo correctamente
      cerrarSesion();
    });
    btnSalir.dataset.bind = "1";
  }

  // Abrir panel
  panel.classList.add("panel-cuenta--abierto");
  panel.setAttribute("aria-hidden", "false");
  cortina.hidden = false;
}

// =============== FUNCIONES API BACKEND ===============
async function obtenerProductos() {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/publicos`);
    
    if (response.ok) {
      const productos = await response.json();
      return productos;
    } else {
      if (response.status === 401) {
      }
      return [];
    }
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    console.error('� BACKEND NO DISPONIBLE - INICIA SPRING BOOT PRIMERO');
    return [];
  }
}

// Función para obtener un producto específico por código
async function obtenerProductoPorCodigo(codigo) {
  try {
    
    // Primero intentar usar el cache si existe
    if (productosCache && productosCache.length > 0) {
      const producto = productosCache.find(p => p.codigo === codigo);
      if (producto) {
        return producto;
      }
    }
    
    // Si no hay cache, obtener todos los productos y buscar el específico
    const response = await fetch(`${API_BASE_URL}/productos/publicos`);
    
    if (response.ok) {
      const productos = await response.json();
      const producto = productos.find(p => p.codigo === codigo);
      if (producto) {
        return producto;
      } else {
        return null;
      }
    } else {
      console.error('❌ Error HTTP obteniendo productos:', response.status);
      console.error('🚫 BACKEND NO DISPONIBLE - INICIA SPRING BOOT');
      return null;
    }
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error);
    console.error('🚫 BACKEND NO DISPONIBLE - INICIA SPRING BOOT');
    return null;
  }
}

// FUNCIÓN ELIMINADA - Solo usamos productos de la base de datos

async function renderDestacados(productosCache = null) {
  const grid = document.getElementById("gridDestacados");
  if (!grid) return;
  
  try {
    const productos = productosCache || await obtenerProductos();
    
    // Mostrar los primeros 6 productos como destacados
    const destacados = productos.slice(0, 6);
    
    grid.setAttribute('data-bind', '1');
    grid.innerHTML = destacados.map(p => `
      <article class="tarjeta tarjeta-producto">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'">
        <div class="contenido">
          <h3>${p.nombre}</h3>
          <p class="precio">$${p.precio.toLocaleString()}</p>
          <div class="acciones">
            <a class="btn secundario" href="producto.html?codigo=${p.codigo}">Ver</a>
            <button class="btn primario" data-agregar="${p.codigo}">Añadir</button>
          </div>
        </div>
      </article>
    `).join('');

  } catch (error) {
    console.error('Error renderizando destacados:', error);
    grid.innerHTML = '<p>Error cargando productos destacados</p>';
  }
}

async function renderProductos(productosCache = null) {
  const grid = document.getElementById("gridProductos");
  if (!grid) return;
  
  try {
    const productos = productosCache || await obtenerProductos();
    
    grid.setAttribute('data-bind', '1');
    grid.innerHTML = productos.map(p => `
      <article class="tarjeta tarjeta-producto">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.jpg'">
        <div class="contenido">
          <h3>${p.nombre}</h3>
          <p class="precio">$${p.precio.toLocaleString()}</p>
          <div class="acciones">
            <a class="btn secundario" href="producto.html?codigo=${p.codigo}">Ver</a>
            <button class="btn primario" data-agregar="${p.codigo}">Añadir</button>
          </div>
        </div>
      </article>
    `).join('');
    
  } catch (error) {
    console.error('Error renderizando productos:', error);
    grid.innerHTML = '<p>Error cargando productos. Inicia el backend Spring Boot.</p>';
  }
}

async function renderDetalleProducto() {
  // Obtener código del producto desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const codigo = urlParams.get('codigo');
  
  if (!codigo) {
    console.error('❌ No se especificó código de producto');
    window.location.href = '/cliente/productos.html';
    return;
  }
  
  try {
    const producto = await obtenerProductoPorCodigo(codigo);
    
    if (!producto) {
      console.error('❌ Producto no encontrado:', codigo);
      alert('Producto no encontrado');
      window.location.href = '/cliente/productos.html';
      return;
    }
    
    // Actualizar contenido de la página
    document.title = `${producto.nombre} | Level-Up Gamer`;
    
    // Actualizar imagen principal
    const imgPrincipal = document.getElementById('imagenDetalle');
    if (imgPrincipal) {
      imgPrincipal.src = producto.imagen;
      imgPrincipal.alt = producto.nombre;
    }
    
    // Actualizar información
    const nombreProducto = document.getElementById('nombreDetalle');
    if (nombreProducto) nombreProducto.textContent = producto.nombre;
    
    const precioProducto = document.getElementById('precioDetalle');
    if (precioProducto) precioProducto.textContent = `$${producto.precio.toLocaleString()}`;
    
    const descripcionProducto = document.getElementById('descripcionDetalle');
    if (descripcionProducto) descripcionProducto.textContent = producto.descripcion;
    
    const categoriaProducto = document.getElementById('categoriaDetalle');
    if (categoriaProducto) categoriaProducto.textContent = producto.categoria;
    
    // Actualizar detalles extra si existen
    const detallesExtra = document.getElementById('detallesDetalle');
    if (detallesExtra && producto.detalles) {
      detallesExtra.textContent = producto.detalles;
    }
    
    // Configurar botón agregar
    const btnAgregar = document.getElementById('btnAgregarDetalle');
    if (btnAgregar) {
      btnAgregar.dataset.codigo = producto.codigo;
      btnAgregar.disabled = producto.stock === 0;
      btnAgregar.textContent = producto.stock > 0 ? 'Añadir al carrito' : 'Sin stock';
    }
    
    // Configurar input de cantidad
    const inputCantidad = document.getElementById('cantidadDetalle');
    if (inputCantidad) {
      inputCantidad.max = producto.stock;
      inputCantidad.disabled = producto.stock === 0;
    }
    
  } catch (error) {
    console.error('Error cargando detalle del producto:', error);
    alert('Error cargando el producto');
    window.location.href = '/cliente/productos.html';
  }
}

// Configurar event listeners globales usando delegación
function setupEventListeners() {
  
  // Event listener global para botones de agregar al carrito (delegación)
  document.addEventListener('click', function(e) {
    // Interceptar clics en enlaces Admin/Vendedor
    if (e.target.matches('#linkAdmin') || e.target.matches('#linkVendedor')) {
      e.preventDefault();
      
      // Verificar que el usuario esté logueado y tenga permisos
      const usuario = usuarioActual();
      if (!usuario) {
        window.location.href = '/cliente/login.html';
        return;
      }
      
      // Verificar roles
      const tipo = (usuario.tipoUsuario || '').toLowerCase();
      const esAdmin = tipo.includes('admin');
      const esVendedor = tipo.includes('vendedor') || tipo.includes('seller');
      
      if (esAdmin || esVendedor) {
        // Abrir el dashboard de React 
        window.location.assign('/admin');
      } else {
        alert('No tienes permisos para acceder al panel de administración');
      }
      return;
    }
    
    // Botón agregar al carrito
    if (e.target.matches('[data-agregar]') || e.target.matches('#btnAgregarCarrito')) {
      e.preventDefault();
      const codigo = e.target.dataset.agregar || e.target.dataset.codigo;
      if (codigo) {
        agregarAlCarrito(codigo);
      }
      return;
    }
    
    // Formulario de login
    if (e.target.matches('#btnLogin') || e.target.closest('#formLogin')) {
      const form = e.target.closest('#formLogin');
      if (form && e.target.type === 'submit') {
        e.preventDefault();
        const correo = form.querySelector('#correoLogin')?.value;
        const password = form.querySelector('#passwordLogin')?.value;
        
        if (correo && password) {
          loginUsuarioAPI(correo, password);
        }
      }
      return;
    }
  });
  
  // Event listener para formularios (submit) - SOLO LOGIN
  document.addEventListener('submit', function(e) {
    if (e.target.matches('#formLogin')) {
      e.preventDefault();
      
      // Limpiar errores previos
      limpiarErroresLogin();
      
      const correo = e.target.querySelector('#correoLogin')?.value?.trim();
      const password = e.target.querySelector('#passwordLogin')?.value;
      
      // Validaciones básicas
      let esValido = true;
      
      if (!correo) {
        mostrarErrorLogin('Correo', 'El correo es obligatorio');
        esValido = false;
      } else {
        const dominiosPermitidos = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
        const dominio = correo.split('@')[1];
        if (!dominio || !dominiosPermitidos.includes(dominio)) {
          mostrarErrorLogin('Correo', 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com');
          esValido = false;
        }
      }
      
      if (!password) {
        mostrarErrorLogin('Pass', 'La contraseña es obligatoria');
        esValido = false;
      } else if (password.length < 6) {
        mostrarErrorLogin('Pass', 'La contraseña debe tener al menos 6 caracteres');
        esValido = false;
      }
      
      // Solo enviar si las validaciones pasan
      if (esValido) {
        loginUsuarioAPI(correo, password);
      }
    }
    // [REGISTRO REMOVIDO] - Se maneja en inicializarRegistro()
  });
}

// Función de login usando API
async function loginUsuarioAPI(correo, password) {
  
  // Limpiar mensajes previos
  limpiarErroresLogin();
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: correo, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Usar los datos del usuario que ya vienen en la respuesta
      const userData = data.usuario;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('jwt_token', data.token); // Usando jwt_token para consistencia
      localStorage.setItem('token', data.token); // También guardamos como token por compatibilidad
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Verificar si hay datos adicionales locales (como fechaNacimiento) y combinarlos
      const datosLocalesExtra = localStorage.getItem('datosUsuarioLocal');
      if (datosLocalesExtra) {
        try {
          const extra = JSON.parse(datosLocalesExtra);
          if (extra.correo === userData.correo) {
            // Combinar datos del backend con datos locales
            userData.fechaNacimiento = extra.fechaNacimiento;
          }
        } catch (e) {
        }
      }
      
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      // Mostrar mensaje de éxito
      mostrarMensajeLogin(data.message || 'Login exitoso');
      
      // Actualizar navegación
      actualizarNavegacion();
      
      // Esperar un momento para que se vea el mensaje y luego redireccionar
      setTimeout(() => {
        // Redireccionar según el tipo de usuario
        if (userData.tipoUsuario === 'ADMIN' || userData.tipoUsuario === 'VENDEDOR') {
          window.location.href = '/cliente/index.html';
        } else {
          window.location.href = '/cliente/index.html';
        }
      }, 1000);
      
    } else {
      const error = await response.json();
      console.error('❌ Error en login:', error);
      
      // Mostrar error en msgLogin en lugar de errores individuales
      mostrarMensajeLogin(error.message || 'Correo o contraseña incorrectos', 'error');
    }
  } catch (error) {
    console.error('❌ Error conectando con el servidor:', error);
    mostrarMensajeLogin('Error de conexión. Verificá tu conexión a internet.', 'error');
  }
}

// Función de registro usando API - NUEVA VERSION
async function registrarUsuario(datos) {
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        run: datos.run,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        correo: datos.correo,
        password: datos.password,
        tipoUsuario: datos.tipoUsuario || 'CLIENTE',
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
      
    } else {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error de conexión completo:', error);
    if (error.name === 'TypeError') {
      throw new Error('Error de conexión. Verifica que el backend esté funcionando.');
    }
    throw error;
  }
}


  
  // LIMPIEZA PERIÓDICA cada 3 segundos para eliminar cualquier usuario fantasma
  setInterval(() => {
    eliminarUsuarioFantasma();
  }, 3000);
  
  // LISTENER para detectar cambios en localStorage y limpiar inmediatamente
  window.addEventListener('storage', function(e) {
    if (e.key && (e.key.includes('usuario') || e.key.includes('user') || e.key.includes('auth'))) {
      eliminarUsuarioFantasma();
    }
  });

// [ELIMINADO] DOMContentLoaded duplicado - usar solo el de la línea 409

// Exponer funciones globales necesarias
Object.assign(window, {
  agregarAlCarrito,
  quitarDelCarrito,
  cambiarCantidad,
  cerrarSesion,
  abrirPanelCuenta,
  crearUsuariosPrueba,
  loginUsuario,
  loginUsuarioAPI,
  usuarioActual,
  obtenerProductos,
  renderDestacados,
  renderProductos,
  eliminarUsuarioFantasma
});

// ========================================
// INICIALIZAR MIS COMPRAS
// ========================================
async function inicializarMisCompras() {
  const listaCompras = document.getElementById('listaCompras');
  if (!listaCompras) return;

  // Verificar si el usuario está logueado
  const usuario = usuarioActual();
  if (!usuario) {
    listaCompras.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p>Debes iniciar sesión para ver tus compras.</p>
        <a href="/cliente/login.html" class="btn primario">Iniciar Sesión</a>
      </div>
    `;
    return;
  }

  // Mostrar loading
  listaCompras.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <p>Cargando tus pedidos...</p>
    </div>
  `;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`${API_BASE_URL}/v1/pedidos/mis-pedidos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const pedidos = await response.json();

    if (!pedidos || pedidos.length === 0) {
      listaCompras.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <p>📦 No tienes pedidos aún.</p>
          <a href="/cliente/productos.html" class="btn primario">Ver Productos</a>
        </div>
      `;
      return;
    }

    // Renderizar pedidos con funcionalidad completa
    await renderPedidosCompletos(pedidos);

  } catch (error) {
    console.error('❌ Error al cargar pedidos:', error);
    listaCompras.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p>❌ Error al cargar tus pedidos: ${error.message}</p>
        <button class="btn primario" onclick="location.reload()">Intentar de nuevo</button>
      </div>
    `;
  }
}

async function renderPedidosCompletos(pedidosBackend){
  const cont = document.getElementById("listaCompras");
  if(!cont) return;

  const u = usuarioActual();
  if (!u) return;

  // Convertir pedidos del backend al formato esperado por la UI
  const compras = pedidosBackend.map(pedido => ({
    id: `PED-${pedido.id}`, // Formato personalizado como pediste
    fecha: pedido.fecha,
    estado: pedido.estado.toLowerCase(), // PENDIENTE -> pendiente
    items: [], // Los items los obtendremos del detalle si es necesario
    subtotal: pedido.subtotal,
    descuentoDuoc: pedido.descuentoDuoc,
    descuentoPuntos: pedido.descuentoPuntos,
    total: pedido.total,
    direccion: pedido.direccion,
    comuna: pedido.comuna,
    region: pedido.region,
    idOriginal: pedido.id // Guardamos el ID original para las API calls
  }));

  const prods = await obtenerProductos();
  // más recientes primero
  compras.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));

  const pedidosHTML = compras.map(pedido => {
    const fecha = new Date(pedido.fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const estadoClass = {
      'pendiente': 'estado-pendiente',
      'despachado': 'estado-despachado', 
      'cancelado': 'estado-cancelado'
    }[pedido.estado] || '';

    const estadoEmoji = {
      'pendiente': '⏳',
      'despachado': '✅',
      'cancelado': '❌'
    }[pedido.estado] || '📦';

    return `
      <div class="pedido-card" data-pedido-id="${pedido.idOriginal}">
        <div class="pedido-header">
          <div class="pedido-info">
            <h3>${pedido.id}</h3>
            <p class="fecha">${fecha}</p>
          </div>
          <div class="pedido-estado ${estadoClass}">
            ${estadoEmoji} ${pedido.estado.toUpperCase()}
          </div>
        </div>
        
        <div class="pedido-detalles">
          <div class="direccion">
            <strong>📍 Dirección:</strong> ${pedido.direccion}, ${pedido.comuna}, ${pedido.region}
          </div>
          
          <div class="totales">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatoPrecio(pedido.subtotal)}</span>
            </div>
            ${pedido.descuentoDuoc > 0 ? `
              <div class="total-row descuento">
                <span>Descuento Duoc (20%):</span>
                <span>-${formatoPrecio(pedido.descuentoDuoc)}</span>
              </div>
            ` : ''}
            ${pedido.descuentoPuntos > 0 ? `
              <div class="total-row descuento">
                <span>Descuento con puntos:</span>
                <span>-${formatoPrecio(pedido.descuentoPuntos)}</span>
              </div>
            ` : ''}
            <div class="total-row total-final">
              <span><strong>Total:</strong></span>
              <span><strong>${formatoPrecio(pedido.total)}</strong></span>
            </div>
          </div>
          
          <div class="pedido-acciones">
            ${pedido.estado === 'pendiente' ? `
              <button class="btn secundario" data-cancelar="${pedido.idOriginal}">Cancelar</button>
            ` : ''}
            ${pedido.estado === 'despachado' ? `
              <button class="btn primario" onclick="window.location.href='/cliente/productos.html#resenas'">Escribir Reseña</button>
            ` : ''}
            <button class="btn primario" data-boleta="${pedido.id}">Generar Boleta</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  cont.innerHTML = `
    <div class="pedidos-lista">
      <h2>Mis Pedidos (${compras.length})</h2>
      ${pedidosHTML}
    </div>
  `;

  // Delegación: abrir modal (Cancelar y Boleta) – un solo listener
  if (!cont.dataset.bind){
    cont.addEventListener("click",(e)=>{
      // --- Cancelar ---
      const btnCancel = e.target.closest("[data-cancelar]");
      if (btnCancel){
        const idOriginal = btnCancel.getAttribute("data-cancelar");
        const dlg = document.getElementById("dlgCancelarPedido");
        const hid = document.getElementById("cancelarPedidoId");
        if (!dlg || !hid) return;
        hid.value = idOriginal;
        dlg.showModal();
        return;
      }

      // --- Boleta ---
      const btnBol = e.target.closest("[data-boleta]");
      if (btnBol){
        const id = btnBol.getAttribute("data-boleta");
        const dlg = document.getElementById("dlgBoleta");
        const hid = document.getElementById("boletaPedidoId");
        const resumen = document.getElementById("boletaResumen");
        if (!dlg || !hid || !resumen) return;

        // buscar la compra
        const compra = compras.find(c => c.id === id);
        if (!compra){ alert("Pedido no encontrado."); return; }

        // preparar resumen HTML para la boleta
        const fecha = new Date(compra.fecha).toLocaleString("es-CL");
        resumen.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div>
              <strong>Level-Up Gamer</strong><br>
              <small>Boleta electrónica</small><br>
              <small>Pedido: ${compra.id}</small><br>
              <small>Fecha: ${fecha}</small>
            </div>
            <div style="font-size:28px" aria-hidden="true">📄</div>
          </div>
          <hr>
          <div style="margin:6px 0">
            <small><strong>Cliente:</strong> ${u.nombres||""} ${u.apellidos||""} — ${u.correo||"—"}</small>
          </div>
          <div style="margin:6px 0">
            <small><strong>Dirección:</strong> ${compra.direccion}, ${compra.comuna}, ${compra.region}</small>
          </div>
          <div style="overflow:auto">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th style="text-align:left;padding:6px 0">Detalle</th>
                  <th style="text-align:right;padding:6px 0">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td style="text-align:right">${formatoPrecio(compra.subtotal)}</td>
                </tr>
                ${compra.descuentoDuoc > 0 ? `
                  <tr>
                    <td>Descuento Duoc (20%)</td>
                    <td style="text-align:right">-${formatoPrecio(compra.descuentoDuoc)}</td>
                  </tr>
                ` : ''}
                ${compra.descuentoPuntos > 0 ? `
                  <tr>
                    <td>Descuento con puntos</td>
                    <td style="text-align:right">-${formatoPrecio(compra.descuentoPuntos)}</td>
                  </tr>
                ` : ''}
              </tbody>
              <tfoot>
                <tr>
                  <td style="text-align:right;padding-top:8px"><strong>Total</strong></td>
                  <td style="text-align:right;padding-top:8px"><strong>${formatoPrecio(compra.total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        `;

        hid.value = id;
        dlg.showModal();
      }
    });
    cont.dataset.bind = "1";
  }

  // Botones del modal Cancelar
  (function wireCancelar(){
    const dlg = document.getElementById("dlgCancelarPedido");
    const btnOk = document.getElementById("btnConfirmarCancelacion");
    const btnClose = document.getElementById("btnCerrarCancelacion");
    if (dlg && btnOk && !btnOk.dataset.bind){
      btnOk.addEventListener("click", async ()=>{
        const id = document.getElementById("cancelarPedidoId").value;
        if (!id) return;
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/v1/pedidos/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            dlg.close();
            inicializarMisCompras(); // Recargar la lista
            alert("Pedido cancelado.");
          } else {
            alert("Error al cancelar el pedido");
          }
        } catch (error) {
          console.error('Error al cancelar:', error);
          alert("Error al cancelar el pedido");
        }
      });
      btnOk.dataset.bind = "1";
    }
    if (dlg && btnClose && !btnClose.dataset.bind){
      btnClose.addEventListener("click", ()=> dlg.close());
      btnClose.dataset.bind = "1";
    }
  })();

  // Botones del modal Boleta - Funcionalidad completa de PDF
  (function wireBoleta(){
    const dlgB = document.getElementById("dlgBoleta");
    const btnPDF = document.getElementById("btnGenerarPDF");
    const btnCloseB = document.getElementById("btnCerrarBoleta");

    if (dlgB && btnPDF && !btnPDF.dataset.bind){
      btnPDF.addEventListener("click",(e)=>{
        e.preventDefault();
        const id = document.getElementById("boletaPedidoId").value;
        if (!id) return;

        // obtener compra y armar HTML imprimible
        const compra = compras.find(c => c.id === id);
        if (!compra){ alert("Pedido no encontrado."); return; }

        const fecha = new Date(compra.fecha).toLocaleString("es-CL");
        const html = `
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Boleta ${compra.id}</title>
<style>
  body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; padding:20px; }
  h1{ margin:0 0 6px 0; font-size:20px; }
  table{ width:100%; border-collapse:collapse; }
  th, td{ padding:6px 0; border-bottom:1px solid #ddd; font-size:14px; }
  tfoot td{ border-bottom:0; }
  .enc{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
  .enc .icon{ font-size:28px; }
  .small{ color:#555; font-size:12px; }
</style>
</head>
<body>
  <div class="enc">
    <div>
      <h1>Level-Up Gamer</h1>
      <div class="small">Boleta electrónica</div>
      <div class="small">Pedido: ${compra.id}</div>
      <div class="small">Fecha: ${fecha}</div>
      <div class="small">Cliente: ${u.nombres||""} ${u.apellidos||""} — ${u.correo||"—"}</div>
      <div class="small">Dirección: ${compra.direccion}, ${compra.comuna}, ${compra.region}</div>
    </div>
    <div class="icon">📄</div>
  </div>
  <hr>
  <table>
    <thead>
      <tr>
        <th style="text-align:left">Detalle</th>
        <th style="text-align:right">Valor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Subtotal</td>
        <td style="text-align:right">${formatoPrecio(compra.subtotal)}</td>
      </tr>
      ${compra.descuentoDuoc > 0 ? `
        <tr>
          <td>Descuento Duoc (20%)</td>
          <td style="text-align:right">-${formatoPrecio(compra.descuentoDuoc)}</td>
        </tr>
      ` : ''}
      ${compra.descuentoPuntos > 0 ? `
        <tr>
          <td>Descuento con puntos</td>
          <td style="text-align:right">-${formatoPrecio(compra.descuentoPuntos)}</td>
        </tr>
      ` : ''}
    </tbody>
    <tfoot>
      <tr>
        <td style="text-align:right"><strong>Total</strong></td>
        <td style="text-align:right"><strong>${formatoPrecio(compra.total)}</strong></td>
      </tr>
    </tfoot>
  </table>
  <script>window.onload = () => window.print();</script>
</body>
</html>
        `.trim();

        const w = window.open("", "_blank");
        if (!w){ alert("Bloqueado por el navegador. Permití ventanas emergentes para generar el PDF."); return; }
        w.document.open();
        w.document.write(html);
        w.document.close();
      });
      btnPDF.dataset.bind = "1";
    }

    if (dlgB && btnCloseB && !btnCloseB.dataset.bind){
      btnCloseB.addEventListener("click", ()=> dlgB.close());
      btnCloseB.dataset.bind = "1";
    }
  })();
}

// Funciones auxiliares para los pedidos
function cancelarPedido(pedidoId) {
  // TODO: Implementar cancelación de pedido
  alert('Función de cancelación pendiente de implementar');
}

function verDetallePedido(pedidoId) {
  // TODO: Implementar vista de detalles
  alert('Vista de detalles pendiente de implementar');
}