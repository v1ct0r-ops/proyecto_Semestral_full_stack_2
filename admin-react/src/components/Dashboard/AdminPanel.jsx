import React, { useEffect, useMemo, useState } from "react";
import { obtener, usuarioActual } from "../../utils/storage";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// Helpers de fechas y conteos mensuales
function normalizarFechaPedido(p) {
  // intenta múltiples campos posibles
  const f = p?.fecha || p?.fechaPedido || p?.creado || p?.createdAt;
  const d = f ? new Date(f) : null;
  return isNaN(d?.getTime?.()) ? null : d;
}
function esMismoMes(d, base = new Date()) {
  return d && d.getFullYear() === base.getFullYear() && d.getMonth() === base.getMonth();
}
function mesAnterior(base = new Date()) {
  const d = new Date(base);
  d.setMonth(d.getMonth() - 1);
  return d;
}
function esMismoMesQue(d, refDate) {
  return d && d.getFullYear() === refDate.getFullYear() && d.getMonth() === refDate.getMonth();
}
function normalizarFechaUsuario(u) {
  const f = u?.fechaRegistro || u?.fecha || u?.creado || u?.createdAt;
  const d = f ? new Date(f) : null;
  return isNaN(d?.getTime?.()) ? null : d;
}

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

  const kpis = useMemo(() => {
    // Productos
    const totalProductos = productos.length;
    const inventario = productos.reduce((acc, p) => acc + (Number(p?.stock) || 0), 0);

    // Compras: estados exitosos = pendiente o despachado (según tu consigna)
    const estadosExito = new Set(["pendiente", "despachado"]);
    const comprasTotales = pedidos.filter((p) => estadosExito.has((p?.estado || "").toLowerCase())).length;

    // Probabilidad de aumento mensual (compras mes actual vs mes anterior)
    const ahora = new Date();
    const refMesAnterior = mesAnterior(ahora);
    const comprasMesActual = pedidos.filter((p) => {
      const d = normalizarFechaPedido(p);
      return estadosExito.has((p?.estado || "").toLowerCase()) && esMismoMes(d, ahora);
    }).length;
    const comprasMesAnterior = pedidos.filter((p) => {
      const d = normalizarFechaPedido(p);
      return estadosExito.has((p?.estado || "").toLowerCase()) && esMismoMesQue(d, refMesAnterior);
    }).length;
    const variacion = comprasMesActual - comprasMesAnterior;
    const probAumento = Math.max(0, Math.round((variacion / Math.max(1, comprasMesAnterior)) * 100));

    // Usuarios
    const totalUsuarios = usuarios.length;
    const nuevosUsuariosMes = usuarios.filter((u) => {
      const d = normalizarFechaUsuario(u);
      return esMismoMes(d, ahora);
    }).length;

    // Pedidos pendientes (se mantiene)
    const pendientes = pedidos.filter((p) => (p?.estado || "").toLowerCase() === "pendiente").length;

    return {
      productos: totalProductos,
      inventario,
      comprasTotales,
      probAumento,
      usuarios: totalUsuarios,
      nuevosUsuariosMes,
      pendientes,
    };
  }, [productos, usuarios, pedidos]);

  return { user, productos, usuarios, pedidos, kpis };
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

export default function AdminPanelReact() {
  const { user, kpis } = useSessionData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Cambia ícono ☰/✕ 
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
        onOpenAccount={() => setAccountOpen(true)}
      />

      <section className="admin">
        {/* Menú lateral (desktop) */}
        <aside className="menu-admin">
          <a href="/admin" className="activo">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        {/* Panel principal */}
        <div className="panel">
          <h1 id="tituloPanel">Panel</h1>
          <p id="descPanel" className="info">Accedé a la gestión según tu rol.</p>

        {/* KPIs */}
          <div className="tarjetas admin-kpis" style={{ marginTop: 12 }}>
            {/* NUEVO: Compras (antes de Productos) */}
            <div className="kpi" id="kpiComprasBox">
              <small>Compras</small>
              <span id="kpiCompras" style={{ marginTop: 10 }}>{kpis.comprasTotales}</span>
              <div className="info dashboard" style={{ fontSize: 14, marginTop: 4 }}>
                Probabilidad de aumento: <strong>{kpis.probAumento}%</strong>
              </div>
            </div>

            {/* Productos + Inventario */}
            <div className="kpi" id="kpiProductosBox">
              <small> Productos</small>
              <span id="kpiProductos" style={{ marginTop: 10 }}>{kpis.productos}</span>
              <div className="info dashboard" style={{ fontSize: 14, marginTop: 4 }}>
                Inventario actual: <strong>{kpis.inventario}</strong>
              </div>
            </div>

            {/* Usuarios + Nuevos del mes (visible solo para admin, como ya tenías) */}
            {isAdmin && (
              <div className="kpi" id="kpiUsuariosBox">
                <small>Usuarios</small>
                <span id="kpiUsuarios" style={{ marginTop: 10 }}>{kpis.usuarios}</span>
                <div className="info dashboard" style={{ fontSize: 14, marginTop: 4 }}>
                  Nuevos este mes: <strong>{kpis.nuevosUsuariosMes}</strong>
                </div>
              </div>
            )}

            {/* Pedidos pendientes (se conserva) */}
            <div className="kpi" id="kpiPedidosBox">
              <small>Pedidos pendientes</small>
              <span id="kpiPedidos" style={{ marginTop: 10 }}>{kpis.pendientes}</span>
            </div>
          </div>

          <article className="tarjeta" style={{ marginTop: 16 }}>
            <div className="contenido">
              <h3>Accesos rápidos</h3>
              <div className="acciones" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="btn secundario" href="/admin/productos">Ver productos</a>
                <a className="btn secundario" href="/admin/pedidos">Ver pedidos</a>
                {isAdmin && (
                  <>
                    <a className="btn primario solo-admin" href="/admin/producto-nuevo">Nuevo producto</a>
                    <a className="btn primario solo-admin" href="/admin/usuarios">Gestionar usuarios</a>
                  </>
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}