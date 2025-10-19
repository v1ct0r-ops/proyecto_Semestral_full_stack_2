// src/components/pedido/PedidosPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtener, usuarioActual } from "../../utils/storage";

/* ================= Helpers ================= */
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
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
  return "badge secundario"; // pendiente u otros
};
const estadoLabel = (estado) => {
  const e = (estado || "").toLowerCase();
  if (e === "despachado") return "Despachado";
  if (e === "cancelado") return "Cancelado";
  return "Pendiente";
};

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

/* ============== Datos de sesión (LS) ============== */
function useSessionData() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);
    setPedidos(Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []);
    setUsuarios(Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []);
  }, []);

  return { user, pedidos, usuarios };
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
        <span className="icono-menu" aria-hidden="true">☰</span>
        <span className="icono-cerrar" aria-hidden="true">✕</span>
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
              LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

        {/* SOLO estos ítems */}
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
            href="/index.html"
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

      {/* Cortina del panel */}
      <div id="cortinaCuenta" className="cortina" onClick={onClose} />
    </>
  );
}

/* ============== Tarjeta Pedido ============== */
import jsPDF from "jspdf";

function generarPDFBoleta(pedido, usuarios) {
  const comprador = pedido.comprador || pedido.usuario || pedido.cliente || pedido.user || {};
  const nombre = `${comprador.nombres || comprador.nombre || ""} ${comprador.apellidos || comprador.apellido || ""}`.trim();
  const correo = comprador.correo || comprador.email || pedido.correo || "—";
  const pedidoId = pedido.id || pedido.codigo || pedido.timestamp || "";
  const fecha = pedido.fecha || pedido.createdAt || pedido.timestamp || pedido.fechaCreacion || new Date().toISOString();
  const total = pedido.total || pedido.totalCLP || 0;
  const items = Array.isArray(pedido.items) ? pedido.items : [];

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Boleta de compra", 20, 20);
  doc.setFontSize(12);
  doc.text(`Cliente: ${nombre}`, 20, 35);
  doc.text(`Correo: ${correo}`, 20, 42);
  doc.text(`Fecha: ${new Date(fecha).toLocaleString()}`, 20, 49);
  doc.text(`Pedido: ${pedidoId}`, 20, 56);
  let y = 65;
  doc.text("Productos:", 20, y);
  y += 7;
  items.forEach(it => {
    doc.text(`- ${it.cantidad} x ${it.codigo} ($${it.precio})`, 25, y);
    y += 7;
  });
  doc.text(`Total: $${total}`, 20, y+5);
  doc.save(`boleta_${pedidoId}.pdf`);
}

function PedidoCard({ pedido, usuarios, onVerDetalle }) {
  // 👇 AHORA incluimos 'pedido.comprador' como primera opción
  const compradorDirect =
    pedido.comprador || // <- clave en tus datos
    pedido.usuario ||
    pedido.cliente ||
    pedido.user ||
    {
      nombres: pedido.nombres,
      apellidos: pedido.apellidos,
      correo: pedido.correo,
    };

  // Si aún faltan datos, buscamos en 'usuarios' por idUsuario o correo
  const compradorResolved =
    (compradorDirect?.nombres || compradorDirect?.apellidos || compradorDirect?.correo)
      ? compradorDirect
      : (pedido.idUsuario &&
          Array.isArray(usuarios) &&
          usuarios.find((u) => String(u.id) === String(pedido.idUsuario))) ||
        (pedido.correo &&
          Array.isArray(usuarios) &&
          usuarios.find(
            (u) => (u.correo || "").toLowerCase() === (pedido.correo || "").toLowerCase()
          )) ||
        {};

  const nombreCompleto = `${compradorResolved.nombres || compradorResolved.nombre || ""} ${
    compradorResolved.apellidos || compradorResolved.apellido || ""
  }`.trim();

  const correo = compradorResolved.correo || compradorResolved.email || pedido.correo || "—";

  const codigo = pedido.codigo || pedido.id || `PED-${pedido.timestamp || ""}`;
  const createdAt = pedido.fecha || pedido.createdAt || pedido.timestamp || pedido.fechaCreacion;

  // 👇 tu envío viene como 'pedido.envio'
  const envio = pedido.envio || pedido.direccionEnvio || {};
  const dir = envio.direccion || envio.calle || envio.detalle || "—";
  const comuna = envio.comuna || "—";
  const region = envio.region || "—";

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

        <div className="acciones" style={{ gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={estadoBadgeClass(estado)}
            onClick={onVerDetalle}
            title="Ver detalle del pedido"
            style={{ cursor: "pointer" }}
          >
            {estadoLabel(estado)}
          </button>

          <button
            className="btn secundario"
            onClick={onVerDetalle}
            style={{ cursor: "pointer" }}
          >
            Ver detalle
          </button>

          <button
            className="btn primario"
            style={{ cursor: "pointer" }}
            onClick={() => generarPDFBoleta(pedido, usuarios)}
            title="Descargar boleta PDF"
          >
            Descargar boleta
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============== Página ============== */
export default function PedidosPanel() {
  const navigate = useNavigate();
  const { user, pedidos, usuarios } = useSessionData();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Siempre llamamos hooks arriba (evitar cambios de orden)
  const pedidosFiltrados = useMemo(() => {
    const arr = Array.isArray(pedidos) ? pedidos : [];
    if (!filtro) return arr;
    return arr.filter((p) => (p.estado || "").toLowerCase() === filtro);
  }, [pedidos, filtro]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  const isAdmin = user?.tipoUsuario === "admin";

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
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos" className="activo">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
        </aside>

        {/* Panel principal */}
        <div className="panel">
          <h1>Pedidos</h1>

          <div className="filtros" style={{ marginBottom: 12 }}>
            <select id="filtroPedidos" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="despachado">Despachados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>

          {!user ? (
            <p className="info">Cargando…</p>
          ) : (
            <div id="listaPedidos" className="tarjetas">
              {pedidosFiltrados.length === 0 ? (
                <p className="info">No hay pedidos para mostrar.</p>
              ) : (
                pedidosFiltrados.map((p) => {
                  const raw = p.id || p.codigo || p.timestamp;
                  const pid = encodeURIComponent(String(raw).replace(/^PED-?/i, ""));
                  return (
                    <PedidoCard
                      key={raw}
                      pedido={p}
                      usuarios={usuarios}
                      onVerDetalle={() => navigate(`/admin/pedidos/${pid}`)}
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

      {/* Panel de cuenta + cortina */}
      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
