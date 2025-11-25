// src/components/pedido/PedidosPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtener, usuarioActual } from "../../utils/storage";
import { pedidosAPI, boletasAPI } from "../../services/apiService";

/* ================= Helpers ================= */
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      })
    : "—";

const fechaHoraLarga = (ts) => {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const estadoBadgeClass = (estado) => {
  const e = (estado || "").toLowerCase();
  if (e === "despachado") return "badge exito";
  if (e === "cancelado") return "badge peligro";
  return "badge secundario";
};

const estadoLabel = (estado) => {
  const e = (estado || "").toLowerCase();
  if (e === "despachado") return "Despachado";
  if (e === "cancelado") return "Cancelado";
  return "Pendiente";
};

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

/* ============== Datos de sesión (Backend API) ============== */
function useSessionData() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const u = await usuarioActual();
        if (!u) {
          alert("Acceso restringido.");
          window.location.href = "/index.html";
          return;
        }
        setUser(u);

        const pedidosData = await pedidosAPI.getAll();
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);

        setUsuarios(
          Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []
        );
        setLoading(false);
      } catch (error) {
        // Si ocurre un error al cargar los datos, se guarda el mensaje en el estado
        setError(error.message);

        setPedidos(
          Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []
        );
        setUsuarios(
          Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []
        );
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { user, pedidos, usuarios, loading, error };
}

/* ============== Header y SideMenu ============== */
function Header({ onOpenAccount, onToggleMenu, isMenuOpen }) {
  return (
    <header className="encabezado">
      <a className="logo" href="/admin">
        <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
      </a>

      <button
        id="btnMenu"
        type="button"
        className={`btn-menu ${isMenuOpen ? "is-open" : ""}`}
        aria-label="Abrir menú"
        aria-expanded={isMenuOpen}
        aria-controls="menuLateral"
        onClick={onToggleMenu}
      >
        <span className="icono-menu" aria-hidden="true">
          ☰
        </span>
        <span className="icono-cerrar" aria-hidden="true">
          ✕
        </span>
      </button>

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
              LEVEL<span className="up">UP</span>{" "}
              <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

        <nav id="menuLista" className="menu-lista" data-clonado="1">
          <a
            href="#" 
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
            href="/index.html"
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

      <div
        id="cortina"
        className="cortina"
        hidden={!open}
        onClick={onClose}
      />
    </>
  );
}

/* ============== AccountPanel ============== */
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
            {`${user?.nombres || ""} ${user?.apellidos || ""}`.trim()}
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
              <button className="btn secundario" onClick={copyCode}>
                Copiar
              </button>
            </div>
            <small className="pista">
              Compartí este código para ganar puntos.
            </small>
          </div>

          <div className="panel-cuenta__bloque">
            <p>
              <strong>Puntos LevelUp:</strong> {puntos}
            </p>
            <p>
              <strong>Nivel:</strong> {nivel}
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

      <div
        id="cortinaCuenta"
        className="cortina"
        onClick={onClose}
      />
    </>
  );
}

/* ============== Tarjeta Pedido ============== */
function PedidoCard({
  pedido,
  usuarios,
  onVerDetalle,
  onVerBoleta,
  canSeeBoletas,
}) {
  const compradorData = pedido.usuario || {};
  const nombreCompleto = `${compradorData.nombres || ""} ${
    compradorData.apellidos || ""
  }`.trim();
  const correo = compradorData.correo || "—";

  const codigo = pedido.codigo || pedido.id || `PED-${pedido.timestamp || ""}`;
  const createdAt =
    pedido.fecha ||
    pedido.createdAt ||
    pedido.timestamp ||
    pedido.fechaCreacion;

  const dir = pedido.direccion || "—";
  const comuna = pedido.comuna || "—";
  const region = pedido.region || "—";

  const total = pedido.total || pedido.totalCLP || 0;
  const estado = (pedido.estado || "pendiente").toLowerCase();

  return (
    <article className="tarjeta" style={{ marginTop: 12 }}>
      <div className="contenido">
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>
          {String(codigo).startsWith("PED") ? codigo : `PED-${codigo}`}
        </h3>

        <p className="info" style={{ margin: "6px 0 10px" }}>
          {fechaHoraLarga(createdAt)} · {nombreCompleto || "—"} ({correo})
        </p>

        <p className="info" style={{ margin: "6px 0" }}>
          <strong>Envío:</strong> {dir}, {comuna}, {region}
        </p>

        <p style={{ margin: "8px 0 12px" }}>
          <strong>Total:</strong> {CLP(total)}
        </p>

        <div className="acciones" style={{ gap: 8 }}>
          <button
            type="button"
            className={estadoBadgeClass(estado)}
            onClick={onVerDetalle}
            title="Ver detalle del pedido"
            style={{ cursor: "pointer" }}
          >
            {estadoLabel(estado)}
          </button>

          <button className="btn secundario" onClick={onVerDetalle}>
            Ver detalle
          </button>

          {/* Botón Ver Boleta solo para ADMIN y VENDEDOR */}
          {canSeeBoletas && (
            <button
              className="btn primario"
              onClick={() => onVerBoleta && onVerBoleta(pedido)}
              style={{ cursor: "pointer" }}
            >
              Ver boleta
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============== Página principal ============== */
export default function PedidosPanel() {
  const navigate = useNavigate();
  const { user, pedidos, usuarios, loading, error } = useSessionData();

  const tipo = (user?.tipoUsuario ?? user?.tipo ?? "")
    .toString()
    .trim()
    .toUpperCase();

  const isAdmin = tipo === "ADMIN";
  const canSeeBoletas = tipo === "ADMIN" || tipo === "VENDEDOR";

  // Generar/obtener boleta desde el backend Spring Boot
  const handleVerBoleta = async (pedido) => {
    if (!pedido || !pedido.id) return;

    if (!canSeeBoletas) {
      alert("No tienes permiso para ver boletas.");
      return;
    }

    try {
      const boleta = await boletasAPI.generarParaPedido(pedido.id);

      if (!boleta || !boleta.numero) {
        alert("No se pudo obtener la boleta desde el backend.");
        return;
      }

      navigate(`/admin/boleta/${encodeURIComponent(boleta.numero)}`);
    } catch (err) {
      // Si ocurre un error al generar/obtener la boleta, se muestra un mensaje al usuario
      alert("Ocurrió un error al generar la boleta en el backend.");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filtro, setFiltro] = useState("");

  const pedidosFiltrados = useMemo(() => {
    const arr = Array.isArray(pedidos) ? pedidos : [];
    if (!filtro) return arr;
    return arr.filter((p) => (p.estado || "").toLowerCase() === filtro);
  }, [pedidos, filtro]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

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

          {/* Solo ADMIN ve Usuarios */}
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}

          <a href="/admin/pedidos" className="activo">
            Pedidos
          </a>

          <a href="/admin/solicitud">Solicitudes</a>

          {/* ADMIN y VENDEDOR ven Boletas */}
          {canSeeBoletas && <a href="/admin/boleta">Boletas</a>}

          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1>Pedidos</h1>

          <div className="filtros" style={{ marginBottom: 12 }}>
            <select
              id="filtroPedidos"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="despachado">Despachados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>

          {loading ? (
            <p className="info">🔄 Cargando pedidos desde el backend...</p>
          ) : error ? (
            <div className="info" style={{ color: "#dc2626" }}>
              <p>❌ Error cargando pedidos: {error}</p>
              <p>
                <small>
                  Revisa que el backend Spring Boot esté ejecutándose en puerto
                  8080
                </small>
              </p>
            </div>
          ) : !user ? (
            <p className="info">Cargando usuario…</p>
          ) : (
            <div id="listaPedidos" className="tarjetas">
              {pedidosFiltrados.length === 0 ? (
                <p className="info">📦 No hay pedidos para mostrar.</p>
              ) : (
                pedidosFiltrados.map((p) => {
                  const raw = p.id || p.codigo || p.timestamp;
                  const pid = encodeURIComponent(
                    String(raw).replace(/^PED-?/i, "")
                  );
                  return (
                    <PedidoCard
                      key={raw}
                      pedido={p}
                      usuarios={usuarios}
                      canSeeBoletas={canSeeBoletas}
                      onVerDetalle={() => navigate(`/admin/pedidos/${pid}`)}
                      onVerBoleta={(pedido) => handleVerBoleta(pedido)}
                    />
                  );
                })
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
    </div>
  );
}
