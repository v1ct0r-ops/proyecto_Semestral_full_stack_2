import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usuarioActual } from "../../utils/storage";
import { solicitudesAPI } from "../../services/apiService";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ================== HEADER ==================
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

// ================== SIDE MENU ==================
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
              window.location.href = "/cliente/index.html";
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

// ================== ACCOUNT PANEL ==================
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

          <p>
            <strong>Nombre:</strong>{" "}
            {`${user?.nombres || ""} ${user?.apellidos || ""}`.trim() || "—"}
          </p>
          <p>
            <strong>Correo:</strong> {user?.correo || "—"}
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

// ================== UTILS ==================
const formatearFecha = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} / ${hh}:${mi}`;
};

const colorEstado = (estado) => {
  const e = String(estado || "").toLowerCase();
  if (e === "completado" || e === "atendida" || e === "resuelta") return "green";
  if (e === "pendiente") return "orange";
  if (e === "cancelada" || e === "cancelado") return "red";
  return "inherit";
};

const getTitulo = (s) =>
  s.titulo || s.asunto || s.subject || `Solicitud ${s.id ?? ""}`;
const getResumen = (s) =>
  s.resumen || s.descripcion || s.mensaje || s.detalle || "";
const getEstado = (s) => s.estado || s.status || "pendiente";
const getFecha = (s) =>
  s.fecha || s.createdAt || s.creado || s.fechaSolicitud || null;

// ================== COMPONENTE PRINCIPAL ==================
export default function DetalleSolicitudPanel({ idParam }) {
  const { id: routeId } = useParams();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solicitud, setSolicitud] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // id de la URL o prop
  const idFromPath = useMemo(() => {
    if (idParam) return idParam;
    if (routeId) return routeId;
    const parts = (window?.location?.pathname || "").split("/");
    return decodeURIComponent(parts[parts.length - 1] || "");
  }, [idParam, routeId]);

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

        // detectar admin robusto (ADMIN/admin)
        const tipo = (u.tipoUsuario ?? u.tipo ?? "")
          .toString()
          .trim()
          .toUpperCase();
        setIsAdmin(tipo === "ADMIN");

        if (!idFromPath) {
          setError("ID de solicitud inválido");
          setLoading(false);
          return;
        }

        // 👇 Cargar solicitud desde backend
        const data = await solicitudesAPI.getById(idFromPath);
        setSolicitud(data);
        setError(null);
      } catch (err) {
        setError(err.message || "Error cargando solicitud");
        setSolicitud(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idFromPath]);

  const marcarAtendida = async () => {
    if (!solicitud) return;
    try {
      const actualizada = await solicitudesAPI.updateEstado(
        solicitud.id,
        "completado"
      );
      setSolicitud(actualizada);
      alert("Solicitud marcada como atendida/completada.");
    } catch (err) {
      alert("No se pudo actualizar el estado de la solicitud.");
    }
  };

  if (!user) {
    return (
      <div className="principal">
        <div style={{ padding: 16 }}>
          <p className="info">Cargando…</p>
        </div>
      </div>
    );
  }

  const titulo = solicitud ? getTitulo(solicitud) : "Solicitud";

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
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud" className="activo">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1 id="tituloSolicitud">{titulo}</h1>

          {loading ? (
            <p className="info">🔄 Cargando solicitud desde el backend...</p>
          ) : error ? (
            <p className="info" style={{ color: "#dc2626" }}>
              ❌ Error: {error} (ID: {idFromPath})
            </p>
          ) : !solicitud ? (
            <p className="info">
              No se encontró la solicitud (ID: {idFromPath}).
            </p>
          ) : (
            <>
              <div id="detalleSolicitud">
                <article className="tarjeta">
                  <div className="contenido">
                    <p style={{ margin: 0 }}>
                      <strong>Estado: </strong>
                      <span
                        style={{
                          color: colorEstado(getEstado(solicitud)),
                          fontWeight: 600,
                        }}
                      >
                        {String(getEstado(solicitud)).toUpperCase()}
                      </span>
                      {" · "}
                      <strong>Fecha:</strong>{" "}
                      {formatearFecha(getFecha(solicitud))}
                    </p>

                    {getResumen(solicitud) && (
                      <p style={{ marginTop: 8 }}>
                        <strong>Mensaje:</strong> {getResumen(solicitud)}
                      </p>
                    )}

                    {solicitud.nombre && (
                      <p>
                        <strong>Nombre:</strong> {solicitud.nombre}
                      </p>
                    )}
                    {solicitud.correo && (
                      <p>
                        <strong>Correo:</strong> {solicitud.correo}
                      </p>
                    )}
                    {solicitud.run && (
                      <p>
                        <strong>RUN:</strong> {solicitud.run}
                      </p>
                    )}
                  </div>
                </article>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  id="btnMarcarAtendida"
                  className="btn exito"
                  onClick={marcarAtendida}
                >
                  Marcar como atendida
                </button>
              </div>
            </>
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
    </div>
  );
}
