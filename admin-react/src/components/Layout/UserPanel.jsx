import { useState } from 'react'

function UserPanel({ isOpen, onClose }) {
  // Mock user data por ahora
  const user = { 
    nombres: 'Admin', 
    correo: 'admin@duoc.cl',
    codigoReferido: 'REF123',
    puntos: 150,
    nivel: 'Oro'
  };
  
  const [copiado, setCopiado] = useState(false)

  const copiarCodigo = () => {
    if (user?.codigoReferido) {
      navigator.clipboard.writeText(user.codigoReferido)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      alert('Cerrando sesión...');
      onClose();
    }
  }

  if (!user) return null

  return (
    <>
      <aside 
        id="panelCuenta" 
        className={`panel-cuenta ${isOpen ? 'activo' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="panel-cuenta__cab">
          <h3>Mi cuenta</h3>
          <button 
            id="btnCerrarCuenta" 
            className="panel-cuenta__cerrar" 
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="panel-cuenta__contenido">
          <div className="panel-cuenta__avatar">
            <img src="/img/imgPerfil.png" alt="Foto de perfil" />
          </div>

          <p><strong>Nombre:</strong> <span id="cuentaNombre">{user.nombres} {user.apellidos}</span></p>
          <p><strong>Correo:</strong> <span id="cuentaCorreo">{user.correo}</span></p>
          <a className="btn secundario" href="/perfil.html">Editar Perfil</a>

          <div className="panel-cuenta__bloque">
            <label><strong>Código de referido</strong></label>
            <div className="panel-cuenta__ref">
              <input 
                id="cuentaCodigoReferido" 
                value={user.codigoReferido || ''} 
                readOnly 
              />
              <button 
                id="btnCopiarCodigo" 
                className="btn secundario" 
                type="button"
                onClick={copiarCodigo}
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <small className="pista">Compartí este código para ganar puntos.</small>
          </div>

          <div className="panel-cuenta__bloque">
            <p><strong>Puntos LevelUp:</strong> <span id="cuentaPuntos">{user.puntos || 0}</span></p>
            <p><strong>Nivel:</strong> <span id="cuentaNivel">{user.nivel || 'Bronce'}</span></p>
            <small className="pista">Bronce: 0–199 · Plata: 200–499 · Oro: 500+</small>
          </div>

          <div className="panel-cuenta__acciones">
            <a className="btn secundario" href="/misCompras.html">Mis compras</a>
            <button 
              id="btnSalirCuenta" 
              className="btn"
              onClick={handleLogout}
            >
              Salir
            </button>
          </div>
        </div>
      </aside>
      
      {/* Cortina del panel */}
      <div 
        id="cortinaCuenta" 
        className={`cortina ${isOpen ? 'activo' : ''}`}
        onClick={onClose}
        hidden={!isOpen} 
      />
    </>
  )
}

export default UserPanel