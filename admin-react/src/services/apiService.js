// Servicio para manejar las llamadas a la API y la sesión del usuario

// Configuración de la API: define la URL base y el tiempo máximo de espera
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8080/api'
      : 'https://levelup-gamer-backend.up.railway.app/api'),
  TIMEOUT: 10000
};

// Cache local para guardar datos y evitar llamadas repetidas
const cache = {
  productos: null,
  usuario: null,
  timestamp: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // Duración de la cache en milisegundos

// Clase para manejar errores de la API
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function makeRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('authToken');
  
  
  const config = {
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, {
        url,
        status: response.status,
        errorData
      });
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
  // Si el backend no responde, retorna null para evitar romper la app
    return null;
  }
}

// Función para iniciar sesión
export async function login(email, password) {
  try {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response && response.token) {
  // Guardar el token en localStorage
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('authToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
  // Guardar los datos del usuario en localStorage
      const userData = {
        correo: response.usuario.correo,
        email: response.usuario.correo,
        tipoUsuario: response.usuario.tipoUsuario,
        tipo: response.usuario.tipoUsuario,
        nombres: response.usuario.nombres,
        apellidos: response.usuario.apellidos,
        run: response.usuario.run,
        puntosLevelUp: response.usuario.puntosLevelUp || 0
      };
      
      localStorage.setItem('sesion', JSON.stringify(userData));
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      cache.usuario = response.usuario;
      return response;
    }
    throw new ApiError('Login failed', 401);
  } catch (error) {
  // Si ocurre un error en login, lo lanzamos para manejarlo en el componente
    throw error;
  }
}

export async function register(userData) {
  try {
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  } catch (error) {
  // Si el registro falla, intenta guardar el usuario en localStorage
    return registerLocalStorage(userData);
  }
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('sesion');
  cache.usuario = null;
  // El logout solo borra los datos del usuario en localStorage
}

// Función para obtener el usuario actual
export async function usuarioActual() {
  const token = localStorage.getItem('jwt_token') || localStorage.getItem('authToken');
  if (!token) return null;

  // Si hay datos en cache y no ha expirado, retorna el usuario guardado
  if (cache.usuario && (Date.now() - cache.timestamp) < CACHE_DURATION) {
    return cache.usuario;
  }

  try {
    const response = await makeRequest('/usuarios/me');
    if (response) {
      cache.usuario = response;
      cache.timestamp = Date.now();
      return response;
    }
  } catch (error) {
    console.warn('Failed to fetch user from API:', error.message);
    // Si falla, usar datos locales temporalmente
    const sesion = getSesionLocal();
    return sesion;
  }

  return null;
}

export async function esAdmin() {
  const usuario = await usuarioActual();
  return !!(usuario && usuario.tipoUsuario === "admin");
}

export async function esVendedor() {
  const usuario = await usuarioActual();
  return !!(usuario && usuario.tipoUsuario === "vendedor");
}

// === PRODUCTOS ===
export async function obtenerProductos() {
  // Verificar cache
  if (cache.productos && (Date.now() - cache.timestamp) < CACHE_DURATION) {
    return cache.productos;
  }

  try {
    // Usar endpoint público para productos
    const response = await makeRequest('/productos/publicos');
    if (response && Array.isArray(response)) {
      cache.productos = response;
      cache.timestamp = Date.now();
      return response;
    }
  } catch (error) {
    console.warn('Failed to fetch products from API:', error.message);
    throw error;
  }

  return [];
}

export async function obtenerProductoPorCodigo(codigo) {
  try {
    const response = await makeRequest(`/productos/${encodeURIComponent(codigo)}`);
    return response;
  } catch (error) {
    // Fallback
    const productos = await obtenerProductos();
    return productos.find(p => p.codigo === codigo) || null;
  }
}

export async function crearProducto(producto) {
  try {
    const response = await makeRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    });
    // Limpiar cache
    cache.productos = null;
    return response;
  } catch (error) {
    // Fallback a localStorage
    return createProductLocalStorage(producto);
  }
}

export async function actualizarProducto(codigo, producto) {
  try {
    const response = await makeRequest(`/productos/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(producto)
    });
    // Limpiar cache
    cache.productos = null;
    return response;
  } catch (error) {
    return updateProductLocalStorage(codigo, producto);
  }
}

// === CARRITO ===
export function obtenerCarrito() {
  // El carrito se mantiene en localStorage por ahora (sesión temporal)
  return getFromLocalStorage('carrito', []);
}

export function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function agregarAlCarrito(codigo, cantidad = 1) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.codigo === codigo);
  
  if (index >= 0) {
    carrito[index].cantidad = (carrito[index].cantidad || 0) + cantidad;
  } else {
    carrito.push({ codigo, cantidad });
  }
  
  guardarCarrito(carrito);
  return carrito;
}

export function quitarDelCarrito(codigo) {
  const carrito = obtenerCarrito().filter(item => item.codigo !== codigo);
  guardarCarrito(carrito);
  return carrito;
}

export function limpiarCarrito() {
  localStorage.removeItem('carrito');
}

// === PEDIDOS ===
export async function obtenerPedidos() {
  try {
    // Usar endpoint correcto con autenticación
    const response = await makeRequest('/v1/pedidos');
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.warn('Failed to fetch orders from API:', error.message);
    throw error;
  }
}

export async function crearPedido(pedidoData) {
  try {
    const response = await makeRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData)
    });
    return response;
  } catch (error) {
    return createPedidoLocalStorage(pedidoData);
  }
}

export async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  try {
    const response = await makeRequest(`/pedidos/${pedidoId}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: nuevoEstado })
    });
    return response;
  } catch (error) {
    return updatePedidoLocalStorage(pedidoId, nuevoEstado);
  }
}

// === FUNCIONES AUXILIARES ===
function getSesionLocal() {
  try {
    const sesion = localStorage.getItem('sesion');
    return sesion ? JSON.parse(sesion) : null;
  } catch {
    return null;
  }
}

function getFromLocalStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function getUserFromLocalStorage(correo) {
  const usuarios = getFromLocalStorage('usuarios', []);
  return usuarios.find(u => 
    u.correo && u.correo.toLowerCase() === correo.toLowerCase()
  ) || null;
}

// === FALLBACKS LOCALSTORAGE ===
function loginLocalStorage(correo, password) {
  const usuarios = getFromLocalStorage('usuarios', []);
  const usuario = usuarios.find(u => 
    u.correo && u.correo.toLowerCase() === correo.toLowerCase() && u.pass === password
  );

  if (!usuario) {
    throw new ApiError('Credenciales incorrectas', 401);
  }

  localStorage.setItem('sesion', JSON.stringify({
    correo: usuario.correo,
    tipo: usuario.tipoUsuario
  }));

  return {
    accessToken: 'fake-token-' + Date.now(),
    usuario: usuario
  };
}

function registerLocalStorage(userData) {
  const usuarios = getFromLocalStorage('usuarios', []);
  
  // Verificar si ya existe
  if (usuarios.some(u => u.correo.toLowerCase() === userData.correo.toLowerCase())) {
    throw new ApiError('El correo ya está registrado', 409);
  }

  const nuevoUsuario = {
    ...userData,
    id: Date.now(),
    fechaRegistro: new Date().toISOString(),
    tipoUsuario: userData.tipoUsuario || 'cliente'
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  
  return nuevoUsuario;
}

function createProductLocalStorage(producto) {
  const productos = getFromLocalStorage('productos', []);
  
  // Verificar si ya existe
  if (productos.some(p => p.codigo === producto.codigo)) {
    throw new ApiError('El código de producto ya existe', 409);
  }

  const nuevoProducto = {
    ...producto,
    id: Date.now(),
    fechaCreacion: new Date().toISOString()
  };

  productos.push(nuevoProducto);
  localStorage.setItem('productos', JSON.stringify(productos));
  
  return nuevoProducto;
}

function updateProductLocalStorage(codigo, productoData) {
  const productos = getFromLocalStorage('productos', []);
  const index = productos.findIndex(p => p.codigo === codigo);
  
  if (index === -1) {
    throw new ApiError('Producto no encontrado', 404);
  }

  productos[index] = {
    ...productos[index],
    ...productoData,
    fechaModificacion: new Date().toISOString()
  };

  localStorage.setItem('productos', JSON.stringify(productos));
  return productos[index];
}

function createPedidoLocalStorage(pedidoData) {
  const pedidos = getFromLocalStorage('pedidos', []);
  
  const nuevoPedido = {
    ...pedidoData,
    id: 'PED-' + Date.now(),
    fecha: new Date().toISOString(),
    estado: 'pendiente'
  };

  pedidos.push(nuevoPedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  
  return nuevoPedido;
}

function updatePedidoLocalStorage(pedidoId, nuevoEstado) {
  const pedidos = getFromLocalStorage('pedidos', []);
  const index = pedidos.findIndex(p => p.id === pedidoId);
  
  if (index === -1) {
    throw new ApiError('Pedido no encontrado', 404);
  }

  pedidos[index].estado = nuevoEstado;
  pedidos[index].fechaActualizacion = new Date().toISOString();
  
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  return pedidos[index];
}

// === FUNCIONES DE COMPATIBILIDAD ===
// Para mantener compatibilidad con el código existente
export function obtener(key, defecto) {
  return getFromLocalStorage(key, defecto);
}

export function guardar(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

// === API ENDPOINTS ESTRUCTURADOS ===
export const authAPI = {
  login: (credentials) => makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  logout: () => makeRequest('/auth/logout', { method: 'POST' }),
  validateToken: () => makeRequest('/auth/validate'),
  getProfile: () => makeRequest('/auth/profile')
};

export const productosAPI = {
  getAll: () => makeRequest('/productos'),
  getPublicos: () => makeRequest('/productos/publicos'),
  getById: (codigo) => makeRequest(`/productos/${encodeURIComponent(codigo)}`),
  getByCategory: (category) => makeRequest(`/productos/categoria/${encodeURIComponent(category)}`),
  search: (query) => makeRequest(`/productos/buscar?nombre=${encodeURIComponent(query)}`),
  getCategories: () => makeRequest('/productos/categorias'),
  getCriticalStock: () => makeRequest('/productos/stock-critico'),
  
  // Admin endpoints
  create: (producto) => makeRequest('/productos', {
    method: 'POST',
    body: JSON.stringify(producto)
  }),
  update: (codigo, producto) => makeRequest(`/productos/${encodeURIComponent(codigo)}`, {
    method: 'PUT',
    body: JSON.stringify(producto)
  }),
  delete: (codigo) => makeRequest(`/productos/${encodeURIComponent(codigo)}`, { method: 'DELETE' }),
  updateStock: (codigo, stock) => makeRequest(`/productos/${encodeURIComponent(codigo)}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ stock })
  }),
  activate: (codigo) => makeRequest(`/productos/${encodeURIComponent(codigo)}/activar`, { method: 'PUT' })
};

export const pedidosAPI = {
  getAll: () => makeRequest('/v1/pedidos'),
  getById: (id) => makeRequest(`/v1/pedidos/${id}`),
  getMisPedidos: () => makeRequest('/v1/pedidos/mis-pedidos'),
  create: (pedido) => makeRequest('/v1/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido)
  }),
  delete: (id) => makeRequest(`/v1/pedidos/${id}`, { method: 'DELETE' }),
  
  // Admin endpoints
  updateStatus: (id, estado) => makeRequest(`/v1/pedidos/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  })
};

export const usuariosAPI = {
  getAll: () => makeRequest('/usuarios'),
  
  getById: (run) => makeRequest(`/usuarios/${encodeURIComponent(run)}`),
  
  create: (usuario) => makeRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario)
  }),
  
  update: (run, usuario) => makeRequest(`/usuarios/${encodeURIComponent(run)}`, {
    method: 'PUT',
    body: JSON.stringify(usuario)
  }),

  // 🔥 NUEVO: eliminar usuario
  delete: (run) => makeRequest(`/usuarios/${encodeURIComponent(run)}`, {
    method: 'DELETE'
  }),

  activate: (run) => makeRequest(`/usuarios/${encodeURIComponent(run)}/activar`, { 
    method: 'PUT' 
  }),

  deactivate: (run) => makeRequest(`/usuarios/${encodeURIComponent(run)}/desactivar`, { 
    method: 'PUT' 
  }),

  getByType: (tipo) => makeRequest(`/usuarios/tipo/${encodeURIComponent(tipo)}`),

  addPoints: (run, puntos) => makeRequest(`/usuarios/${encodeURIComponent(run)}/puntos`, {
    method: 'POST', 
    body: JSON.stringify({ puntos })
  })
};

export const solicitudesAPI = {
  // Admin: obtener todas las solicitudes
  getAll: () => makeRequest('/solicitudes'),

  // Admin: obtener una solicitud por ID
  getById: (id) => makeRequest(`/solicitudes/${id}`),

  // Público: crear solicitud desde el formulario de contacto
  createPublic: (payload) => makeRequest('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Admin: actualizar estado ("pendiente", "completado", etc.)
  updateEstado: (id, estado) => makeRequest(`/solicitudes/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  }),

  // Admin: eliminar solicitud
  delete: (id) => makeRequest(`/solicitudes/${id}`, { method: 'DELETE' })
};

export const boletasAPI = {
  // Lista todas las boletas (ADMIN / VENDEDOR)
  getAll: () => makeRequest('/v1/boletas'),

  // Obtiene una boleta por su número
  getByNumero: (numero) => makeRequest(`/v1/boletas/${encodeURIComponent(numero)}`),

  // (Opcional) solo buscar por id de pedido, si la necesitas en algún lado
  getByPedido: (pedidoId) => makeRequest(`/v1/boletas/pedido/${pedidoId}`),

  // 🔥 Usado por el botón "Ver boleta" en PedidosPanel:
  // crea la boleta si no existe y devuelve la boleta resultante
  generarParaPedido: (pedidoId) =>
    makeRequest(`/v1/boletas/generar/${pedidoId}`, {
      method: 'POST'
    }),
};



// Exportar la configuración para debug
export { API_CONFIG };