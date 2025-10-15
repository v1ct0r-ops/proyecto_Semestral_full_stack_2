import { useState } from 'react'

function AdminHeader({ onToggleUserPanel, onNavigate }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const togglePerfil = () => {
    setPerfilAbierto(!perfilAbierto)
    if (onToggleUserPanel) {
      onToggleUserPanel();
    }
  }

  return (
    <>
      <header className="encabezado">
        <a className="logo" href="#" onClick={(e) => e.preventDefault()}>
          <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
        </a>

        {/* Botón menú móvil */}
        <button 
          id="btnMenu" 
          className="btn-menu" 
          aria-label="Abrir menú" 
          aria-expanded={menuAbierto}
          aria-controls="menuLateral"
          onClick={toggleMenu}
        >
          <span className="icono-menu" aria-hidden="true">☰</span>
          <span className="icono-cerrar" aria-hidden="true">✕</span>
        </button>

        {/* NAV superior */}
        <nav className="navegacion">
          <a href="#" onClick={(e) => { e.preventDefault(); /* Aquí iría la navegación al sitio público */ }}>Inicio</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('products'); }}>Productos</a>

          {/* Perfil (escritorio) */}
          <button 
            id="btnPerfilDesk" 
            className="perfil-desk" 
            aria-label="Mi cuenta"
            onClick={togglePerfil}
          >
            <img src="/img/imgPerfil.png" alt="" loading="lazy" />
          </button>
        </nav>
      </header>

      {/* Menú lateral móvil */}
      <aside 
        id="menuLateral" 
        className={`menu-lateral ${menuAbierto ? 'activo' : ''}`}
        role="dialog" 
        aria-modal="true" 
        aria-hidden={!menuAbierto}
      >
        <div className="menu-cabecera">
          <a className="logo" href="#" onClick={(e) => e.preventDefault()}>
            <span className="marca">
              LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>
        <nav id="menuLista" className="menu-lista">
          {/* Aquí va el menú lateral que será populate por JS */}
        </nav>
      </aside>
      
      {/* Cortina del menú móvil */}
      <div 
        id="cortina" 
        className={`cortina ${menuAbierto ? 'activo' : ''}`}
        onClick={toggleMenu}
        hidden={!menuAbierto}
      />
    </>
  )
}

export default AdminHeader