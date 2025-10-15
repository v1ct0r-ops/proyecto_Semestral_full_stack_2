import React, { useState } from 'react';

const SimpleLogin = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.correo === 'admin@duoc.cl' && formData.password === 'admin123') {
      setMessage('✅ Login exitoso! (Versión simple)');
      // En una versión completa aquí redirigirías
    } else {
      setMessage('❌ Credenciales incorrectas');
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
      {/* Header simple con estilos del CSS original */}
      <header className="encabezado">
        <a className="logo" href="/">
          <img src="/img/LOGO.png" alt="Logo de la Pagina" className="logoBase" />
        </a>

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

      {/* Main con formulario idéntico al HTML original */}
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
            </div>
            
            <button className="btn primario" type="submit">Entrar</button>
            {message && <p className={message.includes('✅') ? 'exito' : 'error'}>{message}</p>}
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

export default SimpleLogin;