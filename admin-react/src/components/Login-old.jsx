import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StorageService } from '../services/storageService';

const Login = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Si ya está logueado, redirigir al admin
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const esCorreoPermitido = (correo) => {
    const regexDuoc = /^[a-zA-Z0-9._%+-]+@duocuc\.cl$/i;
    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return regexDuoc.test(correo) || regexGmail.test(correo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { correo, password } = formData;
    
    setErrors({});
    setMessage('');

    // Validaciones igual que en el JavaScript original
    if (!esCorreoPermitido(correo) || correo.length > 100) {
      setErrors(prev => ({ ...prev, correo: 'Correo inválido.' }));
      return;
    }

    if (password.length < 4 || password.length > 10) {
      setErrors(prev => ({ ...prev, password: 'Contraseña 4 a 10 caracteres.' }));
      return;
    }

    const usuarios = StorageService.obtener("usuarios", []);
    const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());
    
    if (!usuario) {
      setErrors(prev => ({ ...prev, correo: 'No existe el usuario.' }));
      return;
    }

    if (usuario.pass !== password) {
      setErrors(prev => ({ ...prev, password: 'Contraseña incorrecta.' }));
      return;
    }

    // Login exitoso
    const sessionData = { correo: usuario.correo, tipo: usuario.tipoUsuario };
    StorageService.guardar("sesion", sessionData);
    login(usuario);
    
    setMessage(`¡Bienvenido/a, ${usuario.nombres || ''}! Redirigiendo…`);
    
    // Redirigir después de un momento (el hook de auth manejará la redirección)
    setTimeout(() => {
      window.location.href = '/admin';
    }, 700);
  };

  return (
    <div className="login-container">
      <header className="encabezado">
        <a className="logo" href="/">
          <img src="/img/LOGO.png" alt="Logo de la Pagina" className="logoBase" />
        </a>

        <nav className="navegacion">
          <a href="/">Inicio</a>
          <a href="/productos.html">Productos</a>
          <a href="/blogs.html">Blogs</a>
          <a href="/nosotros.html">Nosotros</a>
          <a href="/contacto.html">Contacto</a>
          <a href="/registro.html">Registro</a>
          <a href="/login.html">Ingresar</a>
          <a className="carrito" href="/productos.html#carrito">🛒 <span>0</span></a>
        </nav>
      </header>

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

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
        <p className="pie-links">
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a> ·
          <a href="https://x.com" target="_blank" rel="noopener">X</a> ·
          <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
        </p>
      </footer>
    </div>
  );
};

export default Login;