import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Si ya está logueado, redirigir al admin
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const esCorreoPermitido = (correo) => {
    return /^[^\s@]+@(duoc\.cl|gmail\.com)$/.test(correo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    setMessage('');

    // Validaciones idénticas al JavaScript original
    if (!esCorreoPermitido(formData.correo) || formData.correo.length > 100) {
      newErrors.correo = "Correo inválido.";
    }
    
    if (formData.password.length < 4 || formData.password.length > 10) {
      newErrors.password = "Contraseña 4 a 10 caracteres.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const usuario = await login(formData.correo, formData.password);
      setMessage(`¡Bienvenido/a, ${usuario.nombres || ''}! Redirigiendo…`);
      
      setTimeout(() => {
        navigate('/admin');
      }, 700);
    } catch (error) {
      if (error.message.includes("No existe")) {
        setErrors({ correo: error.message });
      } else if (error.message.includes("Contraseña")) {
        setErrors({ password: error.message });
      } else {
        setErrors({ correo: error.message });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      {/* Header idéntico al HTML original */}
      <header className="encabezado">
        <a className="logo" href="/">
          <img src="/img/LOGO.png" alt="Logo de la Pagina" className="logoBase" />
        </a>

        {/* Botón menú móvil (no funcional por ahora) */}
        <button className="btn-menu" aria-label="Abrir menú" aria-expanded="false">
          <span className="icono-menu" aria-hidden="true">☰</span>
          <span className="icono-cerrar" aria-hidden="true">✕</span>
        </button>

        {/* NAV idéntico al original */}
        <nav className="navegacion">
          <a href="/">Inicio</a>
          <a href="/productos">Productos</a>
          <a href="/blogs">Blogs</a>
          <a href="/nosotros">Nosotros</a>
          <a href="/contacto">Contacto</a>
          <a href="/registro">Registro</a>
          <a href="/login">Ingresar</a>
          <a className="carrito" href="/productos#carrito">🛒 <span>0</span></a>
        </nav>
      </header>

      {/* Main idéntico al HTML original */}
      <main className="principal">
        <section className="formulario-contenedor">
          <h1>Ingresar</h1>
          <form onSubmit={handleSubmit} noValidate className="formulario">
            <div className="fila">
              <label htmlFor="correoLogin">Correo</label>
              <input
                id="correoLogin"
                name="correo"
                type="email"
                maxLength="100"
                required
                placeholder="usuario@duoc.cl / @gmail.com"
                value={formData.correo}
                onChange={handleChange}
              />
              {errors.correo && <div className="error">{errors.correo}</div>}
            </div>
            
            <div className="fila">
              <label htmlFor="passwordLogin">Contraseña</label>
              <input
                id="passwordLogin"
                name="password"
                type="password"
                minLength="4"
                maxLength="10"
                required
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            
            <button className="btn primario" type="submit">Entrar</button>
            {message && <p className="exito">{message}</p>}
          </form>
        </section>
      </main>

      {/* Footer idéntico al HTML original */}
      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
        <p className="pie-links">
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a> ·
          <a href="https://x.com" target="_blank" rel="noopener">X</a> ·
          <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
        </p>
      </footer>
    </>
  );
};

export default Login;