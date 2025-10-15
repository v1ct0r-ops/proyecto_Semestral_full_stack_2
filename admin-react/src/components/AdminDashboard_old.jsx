import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const AdminDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState({ nombres: 'Victor', tipoUsuario: 'admin' });
  const [kpis, setKpis] = useState({
    productos: 10,
    usuarios: 3,
    pedidosPendientes: 2
  });

  const isVendedor = user?.tipoUsuario === 'vendedor';

  // Efecto para mostrar el botón de perfil como en el JavaScript original
  useEffect(() => {
    const btnPerfil = document.getElementById('btnPerfilDesk');
    if (btnPerfil) {
      btnPerfil.classList.remove('oculto');
    }

    // Asegurar que el body tenga el tamaño correcto para el admin
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';
    
    // Cleanup al desmontar
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      alert('Cerrando sesión...');
      // Aquí iría la lógica de logout
    }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      {/* Header del Admin - Idéntico al HTML original */}
      <header className="encabezado">
        <a className="logo" href="admin.html">
          <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
        </a>
        
        <button className="btn-menu" aria-label="Abrir menú" aria-expanded="false">
          <span className="icono-menu" aria-hidden="true">☰</span>
          <span className="icono-cerrar" aria-hidden="true">✕</span>
        </button>

        <nav className="navegacion">
          <a href="../index.html">Inicio</a>
          <a href="../productos.html">Productos</a>
          
          <button 
            id="btnPerfilDesk"
            className="perfil-desk oculto" 
            aria-label="Mi cuenta"
            onClick={() => setShowUserPanel(!showUserPanel)}
          >
            <img src="/img/imgPerfil.png" alt="" loading="lazy" />
          </button>
        </nav>
      </header>

      {/* Menú lateral móvil (estructura del HTML original) */}
      <aside className="menu-lateral" role="dialog" aria-modal="true" aria-hidden="true">
        <div className="menu-cabecera">
          <a className="logo" href="admin.html">
            <span className="marca">LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span></span>
          </a>
        </div>
        <nav className="menu-lista"></nav>
      </aside>
      <div className="cortina" hidden></div>

      {/* Main con la estructura exacta del HTML original */}
      <main className="principal">
        <section className="admin">
          {/* Menú del panel - Estructura idéntica al HTML original */}
          <aside className="menu-admin">
            <a href="#" className="activo">Inicio</a>
            <a href="#">Productos</a>
            {!isVendedor && <a href="#">Usuarios</a>}
            <a href="#">Pedidos</a>
            <a href="#">Solicitud</a>
          </aside>

          {/* Contenido principal del panel - Idéntico al HTML original */}
          <div className="panel">
            <h1 id="tituloPanel">Panel</h1>
            <p id="descPanel" className="info">Accedé a la gestión según tu rol.</p>

            <div className="tarjetas admin-kpis" style={{marginTop: '12px'}}>
              <div className="kpi">
                <span id="kpiProductos">{kpis.productos}</span>
                <small>Productos</small>
              </div>
              
              {!isVendedor && (
                <div className="kpi" id="kpiUsuariosBox">
                  <span id="kpiUsuarios">{kpis.usuarios}</span>
                  <small>Usuarios</small>
                </div>
              )}
              
              <div className="kpi" id="kpiPedidosBox">
                <span id="kpiPedidos">{kpis.pedidosPendientes}</span>
                <small>Pedidos pendientes</small>
              </div>
            </div>

            <article className="tarjeta" style={{marginTop: '16px'}}>
              <div className="contenido">
                <h3>Accesos rápidos</h3>
                <div className="acciones" style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <a className="btn secundario" href="productos.html">Ver productos</a>
                  <a className="btn secundario" href="pedidos.html">Ver pedidos</a>
                  
                  {!isVendedor && (
                    <>
                      <a className="btn primario solo-admin" href="producto-nuevo.html">Nuevo producto</a>
                      <a className="btn primario solo-admin" href="usuarios.html">Gestionar usuarios</a>
                    </>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* Footer - Idéntico al HTML original */}
      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      {/* Panel Mi Cuenta - Idéntico al HTML original */}
      <aside className={`panel-cuenta ${showUserPanel ? '' : 'oculto'}`} aria-hidden={!showUserPanel}>
        <div className="panel-cuenta__cab">
          <h3>Mi cuenta</h3>
          <button 
            className="panel-cuenta__cerrar" 
            aria-label="Cerrar"
            onClick={() => setShowUserPanel(false)}
          >
            ✕
          </button>
        </div>

        <div className="panel-cuenta__contenido">
          <div className="panel-cuenta__avatar">
            <img src="/img/imgPerfil.png" alt="Foto de perfil" />
          </div>

          <p><strong>Nombre:</strong> <span>{user.nombres}</span></p>
          <p><strong>Apellidos:</strong> <span>Rodriguez</span></p>
          <p><strong>Teléfono:</strong> <span>987654321</span></p>
          <p><strong>Código de referido:</strong> <span>LUG001</span></p>

          <div className="panel-cuenta__acciones">
            <button className="btn primario" style={{marginBottom: '8px'}}>
              📋 Copiar código
            </button>
            <button className="btn secundario" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>
      
      {/* Cortina para el panel */}
      {showUserPanel && (
        <div 
          className="cortina" 
          onClick={() => setShowUserPanel(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;