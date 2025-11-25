import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al iniciar, cargar los datos de autenticación guardados
  useEffect(() => {
    const initAuth = async () => {
      try {
  // Buscar tokens guardados en localStorage
        const storedToken = localStorage.getItem('jwt_token') || localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('usuario') || localStorage.getItem('sesion');


        if (storedToken && storedUser) {
          setToken(storedToken);
          
          // Convertir los datos del usuario de texto a objeto
          const userData = JSON.parse(storedUser);
          
          // Normalizar el formato del usuario para usarlo en React
          const normalizedUser = {
            email: userData.correo || userData.email,
            correo: userData.correo || userData.email,
            nombre: userData.nombres || userData.nombre,
            nombres: userData.nombres || userData.nombre,
            apellidos: userData.apellidos,
            run: userData.run,
            tipo: userData.tipoUsuario || userData.tipo,
            tipoUsuario: userData.tipoUsuario || userData.tipo,
            puntosLevelUp: userData.puntosLevelUp || 0,
            id: userData.run
          };
          
          setUser(normalizedUser);
          
          // Si hay token y usuario, marcar como autenticado
          setIsAuthenticated(true);
  }
      } catch (error) {
        // Si ocurre un error al inicializar, cerrar sesión
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response && response.token) {
        const { token: authToken, refreshToken, usuario } = response;
        
  // Guardar el token y los datos del usuario en localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const userData = {
          email: usuario.correo,
          nombre: usuario.nombres,
          apellidos: usuario.apellidos,
          run: usuario.run,
          tipo: usuario.tipoUsuario,
          id: usuario.run
        };
        
        localStorage.setItem('sesion', JSON.stringify(userData));
        
  // Actualizar el estado de autenticación
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
  // Si ocurre un error en login, intentar login de prueba si es desarrollo
      
  // Si el backend no responde, usar login de prueba
      if (error.response?.status === 500 || !error.response) {
        return await loginFallback(email, password);
      }
      
      return { 
        success: false, 
        error: error.message || 'Error de autenticación' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginFallback = async (email, password) => {
  // Usuarios de prueba para desarrollo
    const testUsers = [
      {
        email: 'admin@levelup.cl',
        password: 'admin123',
        run: '12345678-9',
        nombres: 'Administrador',
        apellidos: 'Sistema',
        tipo: 'ADMIN'
      },
      {
        email: 'vendedor@levelup.cl', 
        password: 'vendedor123',
        run: '98765432-1',
        nombres: 'Vendedor',
        apellidos: 'Tienda',
        tipo: 'VENDEDOR'
      }
    ];

    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        email: user.email,
        nombre: user.nombres,
        apellidos: user.apellidos,
        run: user.run,
        tipo: user.tipo,
        id: user.run
      };
      
      const fakeToken = `fake-jwt-${Date.now()}`;
      
      localStorage.setItem('authToken', fakeToken);
      localStorage.setItem('sesion', JSON.stringify(userData));
      
      setToken(fakeToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Credenciales incorrectas' };
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      
      if (response && response.success) {
        return { success: true, message: response.message };
      }
      
      throw new Error(response?.message || 'Error en registro');
    } catch (error) {
  // Si ocurre un error al registrar, devolver el error
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
  // Si hay token, llamar al endpoint de logout
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
  // Si ocurre un error al cerrar sesión, solo limpiar localStorage
    } finally {
      // Limpiar estado local
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sesion');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('usuario');
      
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirigir a la página principal del cliente
      window.location.href = '/cliente/index.html';
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('sesion', JSON.stringify(updatedUser));
  };

  // Funciones de roles
  const isAdmin = () => user?.tipo === 'ADMIN';
  const isVendedor = () => user?.tipo === 'VENDEDOR';
  const isCliente = () => user?.tipo === 'CLIENTE';

  const value = {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,
    
    // Funciones
    login,
    register,
    logout,
    updateUser,
    
    // Utilidades de roles
    isAdmin,
    isVendedor,
    isCliente,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;