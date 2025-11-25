import React, { useEffect, useMemo, useState } from "react";
import { obtener, usuarioActual } from "../../utils/storage";
import { solicitudesAPI } from "../../services/apiService";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

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

          <a href="/cliente/index.html" onClick={onClose}>Inicio</a>
          <a href="/cliente/productos.html" onClick={onClose}>Productos</a>

          <a
            href="/cliente/index.html"
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
                window.location.href = "/cliente/index.html";
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

// --- Helpers ---
const colorEstado = (estado) => {
  const e = String(estado || "").toLowerCase();
  if (e === "completado" || e === "atendida" || e === "resuelta") return "green";
  if (e === "pendiente") return "orange";
  if (e === "cancelada" || e === "cancelado") return "red";
  return "inherit";
};

const getTitulo = (s) =>
  s.titulo || s.asunto || s.subject || `Solicitud ${s.id ?? ""}`;
const getResumen = (s) => s.descripcion || s.resumen || s.mensaje || s.detalle || "";
const getEstado = (s) => s.estado || s.status || "pendiente";

export default function SolicitudesPanel() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario + solicitudes desde backend
  useEffect(() => {
    const load = async () => {
      try {
        const u = await usuarioActual();
        if (!u) {
          alert("Acceso restringido.");
          window.location.href = "/index.html";
          return;
        }
        setUser(u);

        // 👇 Backend
        const data = await solicitudesAPI.getAll();
        setSolicitudes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Error cargando solicitudes");

        // Fallback: localStorage "solicitudes"
        const local = Array.isArray(obtener("solicitudes", []))
          ? obtener("solicitudes", [])
          : [];
        setSolicitudes(local);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Normalizar tipo para detectar ADMIN aunque venga en mayúsculas
  const tipo = (user?.tipoUsuario ?? user?.tipo ?? "")
    .toString()
    .trim()
    .toUpperCase();
  const isAdmin = tipo === "ADMIN";

  const dataFiltrada = useMemo(() => {
    if (!filtro) return solicitudes;
    return solicitudes.filter(
      (s) => String(getEstado(s)).toLowerCase() === filtro
    );
  }, [solicitudes, filtro]);

  return (
    <div className="principal">
      {!user ? (
        <div style={{ padding: 16 }}>
          <p className="info">Cargando…</p>
        </div>
      ) : (
        <>
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
            <aside className="menu-admin">
              <a href="/admin">Inicio</a>
              <a href="/admin/productos">Productos</a>
              {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
              <a href="/admin/pedidos">Pedidos</a>
              <a href="/admin/solicitud" className="activo">Solicitudes</a>
              <a href="/admin/boleta">Boletas</a>
              <a href="/admin/reportes">Reportes</a>
            </aside>

            <div className="panel-solicitud">
              <h1>Solicitudes</h1>

              <div className="filtros" style={{ marginBottom: 12 }}>
                <select
                  id="filtroSoliciutudes"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">pendiente</option>
                  <option value="completado">completado</option>
                </select>
              </div>

              {loading ? (
                <p className="info">🔄 Cargando solicitudes...</p>
              ) : error && solicitudes.length === 0 ? (
                <p className="info" style={{ color: "#dc2626" }}>
                  ❌ Error: {error}
                </p>
              ) : (
                <div id="listaSolicitud" className="tarjeta-solicitud tarjetas">
                  {dataFiltrada.length === 0 ? (
                    <article className="tarjeta">
                      <div className="contenido">
                        <p className="info" style={{ margin: 0 }}>
                          No hay solicitudes.
                        </p>
                      </div>
                    </article>
                  ) : (
                    dataFiltrada.map((s) => (
                      <article
                        className="tarjeta"
                        key={s.id || s.codigo || Math.random()}
                      >
                        <div className="contenido">
                          <h3>{getTitulo(s)}</h3>

                          <div style={{ marginBottom: 6 }}>
                            {(s.nombre || s.correo) && (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px 12px",
                                  fontSize: 17,
                                  marginBottom: 4,
                                }}
                              >
                                {s.nombre && (
                                  <span>
                                    <strong>Nombre:</strong> {s.nombre}
                                  </span>
                                )}
                                {s.correo && (
                                  <span>
                                    <strong>Correo:</strong> {s.correo}
                                  </span>
                                )}
                              </div>
                            )}

                            <small style={{ display: "block", paddingTop: 4 }}>
                              <span
                                style={{
                                  color: colorEstado(getEstado(s)),
                                  fontWeight: 600,
                                  marginRight: 8,
                                }}
                              >
                                {String(getEstado(s)).toUpperCase()}
                              </span>
                              ·{" "}
                              {(() => {
                                const iso =
                                  s.fecha ||
                                  s.createdAt ||
                                  s.creado ||
                                  s.fechaSolicitud;
                                if (!iso) return "—";
                                const d = new Date(iso);
                                const dd = String(d.getDate()).padStart(2, "0");
                                const mm = String(
                                  d.getMonth() + 1
                                ).padStart(2, "0");
                                const yyyy = d.getFullYear();
                                const hh = String(d.getHours()).padStart(
                                  2,
                                  "0"
                                );
                                const mi = String(d.getMinutes()).padStart(
                                  2,
                                  "0"
                                );
                                return `${dd}-${mm}-${yyyy} / ${hh}:${mi}`;
                              })()}
                            </small>
                          </div>

                          {getResumen(s) && (
                            <p style={{ marginTop: 4 }}>
                              <strong>Mensaje:</strong> {getResumen(s)}
                            </p>
                          )}

                          <div className="acciones" style={{ marginTop: 8 }}>
                            <a
                              className="btn secundario"
                              href={`/admin/solicitud/${encodeURIComponent(
                                s.id || s.codigo || ""
                              )}`}
                            >
                              Ver detalle
                            </a>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}
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
        </>
      )}
    </div>
  );
}
