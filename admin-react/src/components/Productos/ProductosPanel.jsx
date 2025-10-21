// src/components/productos/ProductosPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { obtener, guardar, usuarioActual } from "../../utils/storage";

// === Helpers ===
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
    : "—";

// === Hook de sesión/datos ===
function useSessionData() {
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);
    setProductos(Array.isArray(obtener("productos", [])) ? obtener("productos", []) : []);
    setUsuarios(Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []);
    setPedidos(Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []);
  }, []);

  const kpis = useMemo(
    () => ({
      productos: productos.length,
      usuarios: usuarios.length,
      pendientes: pedidos.filter((p) => p.estado === "pendiente").length,
    }),
    [productos, usuarios, pedidos]
  );

  return { user, productos, kpis };
}

// === Header ===
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

      {/* NAV escritorio */}
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

// === Menú lateral móvil ===
function SideMenu({ open, onClose, isAdmin, onOpenAccount }) {
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

        {/* Menú móvil: Mi cuenta, Inicio, Productos, Salir */}
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
          <a href="../cliente/productos" onClick={onClose}>Productos</a>
          <a
            href="/"
            id="linkSalirMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("sesion");
              onClose();
              window.location.href = "/index.html";
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

// === Panel de cuenta ===
const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

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
          <a className="btn secundario" href="/cliente/perfil.html">Editar Perfil</a>

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
            <a className="btn secundario" href="/cliente/misCompras.html">Mis compras</a>
            <button
              id="btnSalirCuenta"
              className="btn"
              onClick={() => {
                localStorage.removeItem("sesion");
                window.location.href = "/index.html";
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

// === Página: Productos ===
export default function ProductosPanel() {
  const { user, productos } = useSessionData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const deleteDialogRef = useRef(null);
  const [deleteCode, setDeleteCode] = useState("");

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
        {/* Menú lateral (desktop) */}
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos" className="activo">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta" >Boletas</a>
        </aside>

        {/* Panel principal */}
        <div className="panel">
          <h1>Productos</h1>

          {/* Acciones principales */}
          <div className="acciones" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {isAdmin && (
              <>
                <a className="btn primario solo-admin" href="/admin/producto-nuevo">
                  Nuevo Producto
                </a>
                <a className="btn secundario solo-admin" href="/admin/productos-poco-stock">
                  Poco stock
                </a>
                <a className="btn secundario solo-admin" href="/admin/reportes-productos">
                  Reportes
                </a>
              </>
            )}
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                {isAdmin && <th id="thAcciones">Acciones</th>}
              </tr>
            </thead>
            <tbody id="tablaProductos">
              {Array.isArray(productos) && productos.length > 0 ? (
                productos.map((p) => (
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria || "—"}</td>
                    <td>{CLP(p.precio)}</td>
                    <td
                      className={
                        typeof p.stock === "number" &&
                        typeof p.stockCritico === "number" &&
                        p.stock <= p.stockCritico
                          ? "stock-critico"
                          : ""
                      }
                    >
                      {typeof p.stock === "number" ? p.stock : "—"}
                    </td>
                    {isAdmin && (
                      <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a
                          className="btn secundario"
                          href={`/admin/editarProducto/${encodeURIComponent(p.codigo)}`}
                        >
                          Editar
                        </a>

                        {/* Botón Eliminar */}
                        <button
                          className="btn peligro"
                          type="button"
                          onClick={() => {
                            setDeleteCode(p.codigo);
                            deleteDialogRef.current?.showModal();
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5}>
                    <p className="info" style={{ margin: 0 }}>
                      No hay productos cargados.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Dialog de confirmación para eliminar */}
          <dialog ref={deleteDialogRef} className="modal">
            <form method="dialog" className="formulario" style={{ minWidth: 320, maxWidth: 480 }}>
              <h3>Eliminar producto</h3>
              <p>
                ¿Estás seguro de eliminar el producto <strong>{deleteCode}</strong>? Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  className="btn peligro"
                  value="ok"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!deleteCode) return;

                    const lista = Array.isArray(obtener("productos", [])) ? obtener("productos", []) : [];
                    const idx = lista.findIndex((x) => x.codigo === deleteCode);
                    if (idx >= 0) {
                      lista.splice(idx, 1);
                      guardar("productos", lista);
                    }

                    deleteDialogRef.current?.close();
                    // Refrescamos la vista para que desaparezca el producto
                    window.location.reload();
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
