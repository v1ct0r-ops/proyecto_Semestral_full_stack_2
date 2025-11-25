// Configuración de la API: selecciona la URL según el entorno

const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;

// Configura la URL base y los headers para las peticiones
export const API_CONFIG = {
  // URL del backend
  BASE_URL: isProd 
  ? 'https://levelup-gamer-backend.up.railway.app/api/v1'
  : 'http://localhost:8080/api/v1',
  
  // Tiempo máximo de espera para las peticiones
  TIMEOUT: 10000,
  
  // Headers por defecto para JSON
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Endpoints para las rutas principales de la API
export const API_ENDPOINTS = {
  // Rutas de autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  
  // Rutas de usuario
  USERS: {
    ME: '/usuarios/me',
    UPDATE_PROFILE: '/usuarios/me',
    CHANGE_PASSWORD: '/usuarios/me/cambiar-password',
    GET_POINTS: '/usuarios/puntos',
    LIST: '/usuarios',
    BY_ID: (run) => `/usuarios/${run}`,
    ACTIVATE: (run) => `/usuarios/${run}/activar`,
    DEACTIVATE: (run) => `/usuarios/${run}/desactivar`,
    ADD_POINTS: (run) => `/usuarios/${run}/puntos`
  },
  
  // Rutas de productos
  PRODUCTS: {
    LIST: '/productos',
    ACTIVE: '/productos/activos',
    BY_ID: (codigo) => `/productos/${codigo}`,
    BY_CATEGORY: (categoria) => `/productos/categoria/${categoria}`,
    SEARCH: '/productos/buscar',
    CATEGORIES: '/productos/categorias',
    CRITICAL_STOCK: '/productos/stock-critico',
    CREATE: '/productos',
    UPDATE: (codigo) => `/productos/${codigo}`,
    DELETE: (codigo) => `/productos/${codigo}`,
    UPDATE_STOCK: (codigo) => `/productos/${codigo}/stock`,
    CHECK_AVAILABILITY: (codigo) => `/productos/${codigo}/disponibilidad`
  }
};

// Función para construir la URL completa de la API
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener los headers con el token si existe
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función para crear la configuración de fetch
export const createFetchConfig = (method = 'GET', body = null, includeAuth = true) => {
  const config = {
    method,
    headers: includeAuth ? getAuthHeaders() : API_CONFIG.DEFAULT_HEADERS,
    timeout: API_CONFIG.TIMEOUT
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  return config;
};

// Debug info (solo en desarrollo)
if (isDev) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    environment: isProd ? 'production' : 'development',
    endpoints: Object.keys(API_ENDPOINTS)
  });
}