// src/components/usuarios/UsuariosPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosAPI } from "../../services/apiService";

// Esta función calcula el nivel del usuario según sus puntos
const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ========= Hook de sesión + carga desde backend =========
function useSessionData() {
  const { user, isAuthenticated } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      alert("Acceso restringido.");
      window.location.href = "/cliente/";
      return;
    }

    const load = async () => {
      try {
        // Cargar usuarios desde el backend
        const data = await usuariosAPI.getAll();
        // Guardamos la lista de usuarios obtenida
        setUsuarios(Array.isArray(data) ? data : []);
      } catch (err) {
        // Si ocurre un error al cargar usuarios, dejamos la lista vacía
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, user]);

  return { user, usuarios, setUsuarios, loading };
}

// ========= Header =========
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
        className={`btn-menu ${isMenuOpen ? "is-open" : ""}`}
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

// ========= Menú lateral =========
function SideMenu({ open, onClose, onOpenAccount }) {
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      onClose();
      window.location.href = "/cliente/";
    } catch (error) {
      // Si ocurre un error durante logout, limpiamos el storage y redirigimos igual
      localStorage.clear();
      onClose();
      window.location.href = "/cliente/";
    }
  };

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
              LEVEL<span className="up">UP</span>{" "}
              <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

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

          <a href="/cliente/index.html" onClick={onClose}>
            Inicio
          </a>
          <a href="/cliente/productos.html" onClick={onClose}>
            Productos
          </a>

          <a
            href="/cliente/index.html"
            id="linkSalirMov"
            data-bind="1"
            onClick={handleLogout}
          >
            Salir
          </a>
        </nav>
      </aside>

      <div id="cortina" className="cortina" hidden={!open} onClick={onClose} />
    </>
  );
}

// ========= Panel de cuenta =========
function AccountPanel({ user, open, onClose }) {
  const { logout } = useAuth();
  const puntos = user?.puntosLevelUp ?? 0;
  const nivel = calcularNivel(puntos);
  const codigo = user?.codigoReferido || "";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      alert("¡Copiado!");
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/cliente/";
    } catch (error) {
      // Si ocurre un error durante logout, limpiamos el storage y redirigimos igual
      localStorage.clear();
      window.location.href = "/cliente/";
    }
  };

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

          <p>
            <strong>Nombre:</strong>{" "}
            {`${user?.nombres || ""} ${user?.apellidos || ""}`.trim() || "—"}
          </p>
          <p>
            <strong>Correo:</strong> {user?.correo || user?.email || "—"}
          </p>
          <a className="btn secundario" href="/cliente/perfil.html">
            Editar Perfil
          </a>

          <div className="panel-cuenta__bloque">
            <label>
              <strong>Código de referido</strong>
            </label>
            <div className="panel-cuenta__ref">
              <input readOnly value={codigo} />
              <button
                className="btn secundario"
                type="button"
                onClick={copyCode}
              >
                Copiar
              </button>
            </div>
            <small className="pista">
              Compartí este código para ganar puntos.
            </small>
          </div>

          <div className="panel-cuenta__bloque">
            <p>
              <strong>Puntos LevelUp:</strong> <span>{puntos}</span>
            </p>
            <p>
              <strong>Nivel:</strong> <span>{nivel}</span>
            </p>
            <small className="pista">
              Bronce: 0–199 · Plata: 200–499 · Oro: 500+
            </small>
          </div>

          <div className="panel-cuenta__acciones">
            <a className="btn secundario" href="/cliente/misCompras.html">
              Mis compras
            </a>
            <button id="btnSalirCuenta" className="btn" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </aside>

      <div id="cortinaCuenta" className="cortina" onClick={onClose} />
    </>
  );
}

// ========= Página principal =========
export default function UsuariosPanel() {
  const { user, usuarios, setUsuarios, loading } = useSessionData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const deleteDialogRef = useRef(null);
  const [deleteRun, setDeleteRun] = useState("");

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="principal">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <div>Cargando usuarios.</div>
          <div style={{ marginTop: 10, fontSize: "0.9em", color: "#666" }}>
            Obteniendo datos del backend.
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin =
    user.tipo === "ADMIN" ||
    user.tipo === "admin" ||
    user.tipoUsuario === "ADMIN" ||
    user.tipoUsuario === "admin";

  const handleDeleteConfirmed = async (e) => {
    e.preventDefault();
    if (!deleteRun) return;
    try {
      await usuariosAPI.delete(deleteRun);
      setUsuarios((prev) => prev.filter((u) => u.run !== deleteRun));
      deleteDialogRef.current?.close();
    } catch (err) {
      // Si ocurre un error al eliminar usuario, mostramos alerta
      alert("No se pudo eliminar el usuario. Revisa la consola.");
    }
  };

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
        onOpenAccount={() => setAccountOpen(true)}
      />

      <section className="admin">
        {/* Menú lateral (desktop) */}
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && (
            <a href="/admin/usuarios" className="activo">
              Usuarios
            </a>
          )}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1>Usuarios</h1>
          {isAdmin && (
            <div
              className="acciones"
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <a className="btn primario solo-admin" href="/admin/usuario-nuevo">
                Nuevo Usuario
              </a>
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
                    <td>{u.correo || u.email || "—"}</td>
                    <td>{u.tipoUsuario || u.tipo || "—"}</td>
                    {isAdmin && (
                      <td
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <a
                          className="btn secundario"
                          href={`/admin/usuario/editar/${encodeURIComponent(
                            u.run
                          )}`}
                        >
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
                        <a
                          className="btn secundario"
                          href={`/admin/usuario/historial/${encodeURIComponent(
                            u.run
                          )}`}
                        >
                          Historial
                        </a>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4}>
                    <p className="info" style={{ margin: 0 }}>
                      No hay usuarios cargados.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Dialog confirmar eliminación */}
          <dialog ref={deleteDialogRef} className="modal">
            <form
              method="dialog"
              className="formulario"
              style={{ minWidth: 320, maxWidth: 480 }}
            >
              <h3>Eliminar usuario</h3>
              <p>
                ¿Estás seguro de eliminar al usuario{" "}
                <strong>{deleteRun}</strong>? Esta acción no se puede deshacer.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 12,
                }}
              >
                <button
                  className="btn peligro"
                  value="ok"
                  onClick={handleDeleteConfirmed}
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

      <AccountPanel
        user={user}
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </div>
  );
}
