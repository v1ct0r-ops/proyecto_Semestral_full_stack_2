import React, { useEffect, useMemo, useRef, useState } from "react";
import { obtener, guardar, usuarioActual } from "../../utils/storage";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ========= Helpers mínimos =========
function useSessionData() {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);
    setUsuarios(Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []);
  }, []);

  return { user, usuarios, setUsuarios };
}

function Header({ onOpenAccount, onToggleMenu, isMenuOpen }) {
  return (
    <header className="encabezado">
      <a className="logo" href="/admin">
        <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
      </a>

      {/* Botón menú móvil */}
      <button
        id="btnMenu"
        type="button"
        className="btn-menu"
        aria-label="Abrir menú"
        aria-expanded={isMenuOpen}
        aria-controls="menuLateral"
        onClick={onToggleMenu}
      >
        <span className="icono-menu" aria-hidden="true">☰</span>
        <span className="icono-cerrar" aria-hidden="true">✕</span>
      </button>

      {/* NAV superior */}
      <nav className="navegacion">
        <a href="/cliente/index.html">Inicio</a>
        <a href="/cliente/productos.html">Productos</a>
        <button
          id="btnPerfilDesk"
          type="button"
          className="perfil-desk"
          aria-label="Mi cuenta"
          onClick={onOpenAccount}
        >
          <img src="/img/imgPerfil.png" alt="" loading="lazy" />
        </button>
      </nav>
    </header>
  );
}

function SideMenu({ open, onClose, onOpenAccount }) {
  return (
    <>
      <aside
        id="menuLateral"
        className={`menu-lateral ${open ? "abierto" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="menu-cabecera">
          <a className="logo" href="/admin">
            <span className="marca">
              LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

        {/* SOLO: Mi cuenta, Inicio, Productos y Salir */}
        <nav id="menuLista" className="menu-lista" data-clonado="1">
          <a
            href="#"
            id="linkMiCuentaMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              onOpenAccount();
            }}
          >
            Mi cuenta
          </a>

          <a href="../cliente/index.html" onClick={onClose}>Inicio</a>
          <a href="../cliente/productos.html" onClick={onClose}>Productos</a>

          <a
            href="../cliente/index.html"
            id="linkSalirMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("sesion");
              onClose();
              window.location.href = "../index.html";
            }}
          >
            Salir
          </a>
        </nav>
      </aside>

      {/* Cortina */}
      <div id="cortina" className="cortina" hidden={!open} onClick={onClose} />
    </>
  );
}

function AccountPanel({ user, open, onClose }) {
  const puntos = user?.puntosLevelUp ?? 0;
  const nivel = calcularNivel(puntos);
  const codigo = user?.codigoReferido || "";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      alert("¡Copiado!");
    } catch {}
  };

  // Si está cerrado, no se renderiza
  if (!open) return null;

  return (
    <>
      <aside
        id="panelCuenta"
        className="panel-cuenta panel-cuenta--abierto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panelCuentaTitulo"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="panel-cuenta__cab">
          <h3 id="panelCuentaTitulo">Mi cuenta</h3>
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

          <p><strong>Nombre:</strong> {`${user?.nombres || ""} ${user?.apellidos || ""}`.trim() || "—"}</p>
          <p><strong>Correo:</strong> {user?.correo || "—"}</p>
          <a className="btn secundario" href="../cliente/perfil.html">Editar Perfil</a>

          <div className="panel-cuenta__bloque">
            <label><strong>Código de referido</strong></label>
            <div className="panel-cuenta__ref">
              <input readOnly value={codigo} />
              <button className="btn secundario" type="button" onClick={copyCode}>Copiar</button>
            </div>
            <small className="pista">Compartí este código para ganar puntos.</small>
          </div>

          <div className="panel-cuenta__bloque">
            <p><strong>Puntos LevelUp:</strong> <span>{puntos}</span></p>
            <p><strong>Nivel:</strong> <span>{nivel}</span></p>
            <small className="pista">Bronce: 0–199 · Plata: 200–499 · Oro: 500+</small>
          </div>

          <div className="panel-cuenta__acciones">
            <a className="btn secundario" href="../cliente/misCompras.html">Mis compras</a>
            <button
              id="btnSalirCuenta"
              className="btn"
              onClick={() => {
                localStorage.removeItem("sesion");
                window.location.href = "../cliente/index.html";
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </aside>

      <div id="cortinaCuenta" className="cortina" onClick={onClose} />
    </>
  );
}

// Reutilizamos el patrón de diálogo de ProductosPanel (confirmación)
export default function UsuariosPanel() {
  const { user, usuarios, setUsuarios } = useSessionData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // Puedes wirear tu AccountPanel si lo usas aquí
  const deleteDialogRef = useRef(null);
  const [deleteRun, setDeleteRun] = useState("");

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  if (!user) return null;
  const isAdmin = user.tipoUsuario === "admin";

  return (
    <div className="principal">
      <Header
        isMenuOpen={menuOpen}
        onOpenAccount={() => setAccountOpen(true)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAdmin={isAdmin}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <section className="admin">
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios" className="activo">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
        </aside>

        <div className="panel">
          <h1>Usuarios</h1>
          {isAdmin && (
            <div className="acciones" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <a className="btn primario solo-admin" href="/admin/usuario-nuevo">Nuevo Usuario</a>
            </div>
          )}

          <table className="tabla">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                {isAdmin && <th id="thAcciones">Acciones</th>}
              </tr>
            </thead>
            <tbody id="tablaUsuarios">
              {Array.isArray(usuarios) && usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.run}>
                    <td>{u.run}</td>
                    <td>{`${u.nombres || ""} ${u.apellidos || ""}`.trim()}</td>
                    <td>{u.correo || "—"}</td>
                    <td>{u.tipoUsuario || "—"}</td>
                    {isAdmin && (
                      <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a className="btn secundario" href={`/admin/usuario/editar/${encodeURIComponent(u.run)}`}>
                          Editar
                        </a>
                        <button
                          className="btn peligro"
                          type="button"
                          onClick={() => {
                            setDeleteRun(u.run);
                            deleteDialogRef.current?.showModal();
                          }}
                        >
                          Eliminar
                        </button>
                        <a className="btn secundario" href={`/admin/usuario/historial/${encodeURIComponent(u.run)}`}>
                          Historial
                        </a>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4}>
                    <p className="info" style={{ margin: 0 }}>No hay usuarios cargados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Dialog confirmar eliminación */}
          <dialog ref={deleteDialogRef} className="modal">
            <form method="dialog" className="formulario" style={{ minWidth: 320, maxWidth: 480 }}>
              <h3>Eliminar usuario</h3>
              <p>
                ¿Estás seguro de eliminar al usuario <strong>{deleteRun}</strong>? Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  className="btn peligro"
                  value="ok"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!deleteRun) return;

                    const lista = Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : [];
                    const idx = lista.findIndex((x) => x.run === deleteRun);
                    if (idx >= 0) {
                      lista.splice(idx, 1);
                      guardar("usuarios", lista);
                      // refrescamos estado en memoria
                      setUsuarios(lista);
                    }
                    deleteDialogRef.current?.close();
                  }}
                >
                  Estoy seguro
                </button>
                <button
                  className="btn secundario"
                  value="cancel"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteDialogRef.current?.close();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
