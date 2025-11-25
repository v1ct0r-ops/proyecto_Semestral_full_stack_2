import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirigir según el tipo de usuario
        const userType = result.user.tipo;
        if (userType === 'ADMIN' || userType === 'VENDEDOR') {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setErrors({ general: result.error || 'Error al iniciar sesión' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para llenar datos de prueba
  const fillTestData = (userType) => {
    const testData = {
      admin: { email: 'admin@levelup.cl', password: 'admin123' },
      vendedor: { email: 'vendedor@levelup.cl', password: 'vendedor123' }
    };
    
    setFormData(testData[userType]);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de Level-Up Gamer</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="tu-email@ejemplo.com"
              disabled={isSubmitting || isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
              disabled={isSubmitting || isLoading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting || isLoading}
          >
            {(isSubmitting || isLoading) ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>

        {/* Botones de prueba para desarrollo */}
        {import.meta.env.DEV && (
          <div className="test-data-buttons">
            <h4>Datos de Prueba:</h4>
            <button 
              type="button" 
              onClick={() => fillTestData('admin')}
              className="test-button admin"
            >
              Admin
            </button>
            <button 
              type="button" 
              onClick={() => fillTestData('vendedor')}
              className="test-button vendedor"
            >
              Vendedor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;