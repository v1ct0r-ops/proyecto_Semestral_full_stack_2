import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtener, usuarioActual } from "../../utils/storage";

// ===== Helpers =====
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

const estadoLabel = (estado) => {
  const e = (estado || "").toLowerCase();
  if (e === "despachado") return "Despachado";
  if (e === "cancelado") return "Cancelado";
  return "Pendiente";
};

// ===== Hook sesión simple =====
function useSessionData() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);
    setPedidos(Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []);
    setProductos(Array.isArray(obtener("productos", [])) ? obtener("productos", []) : []);
  }, []);

  return { user, pedidos, setPedidos, productos };
}

// ===== Header / SideMenu / AccountPanel (idénticos a lo que ya usas) =====
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
              LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

        {/* NAV móvil: Mi cuenta, Inicio, Productos y Salir */}
        <nav id="menuLista" className="menu-lista" data-clonado="1" onClick={onClose}>
          <a
            href="#"
            id="linkMiCuentaMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              onOpenAccount();
            }}
          >
            Mi cuenta
          </a>
          <a href="/cliente/index.html">Inicio</a>
          <a href="/cliente/productos.html">Productos</a>
          <a
            href="/index.html"
            id="linkSalirMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("sesion");
              window.location.href = "/index.html";
            }}
          >
            Salir
          </a>
        </nav>
      </aside>

      <div id="cortina" className="cortina" hidden={!open} onClick={onClose} />
    </>
  );
}

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
              <button className="btn secundario" type="button" onClick={copyCode}>
                Copiar
              </button>
            </div>
            <small className="pista">Compartí este código para ganar puntos.</small>
          </div>

          <div className="panel-cuenta__bloque">
            <p>
              <strong>Puntos LevelUp:</strong> <span>{puntos}</span>
            </p>
            <p>
              <strong>Nivel:</strong> <span>{nivel}</span>
            </p>
            <small className="pista">Bronce: 0–199 · Plata: 200–499 · Oro: 500+</small>
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

// ===== Página Detalle =====
export default function DetallePedidoPanel() {
  const { id: paramId } = useParams(); // viene desde /admin/pedidos/:id
  const navigate = useNavigate();
  const { user, pedidos, setPedidos, productos } = useSessionData();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Modo menú móvil
  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  // Normaliza id (en la lista le quitamos el prefijo PED- al navegar)
  const pedido = useMemo(() => {
    if (!Array.isArray(pedidos)) return null;
    if (!paramId) return null;

    // Puede venir con o sin "PED-"
    const plain = decodeURIComponent(paramId);
    const match = pedidos.find(
      (p) =>
        String(p.id).toLowerCase() === plain.toLowerCase() ||
        String(p.id).toLowerCase() === `ped-${plain}`.toLowerCase() ||
        String(plain).toLowerCase() === `ped-${String(p.id)}`.toLowerCase()
    );
    return match || null;
  }, [pedidos, paramId]);

  if (!user) return null;

  const isAdmin = user.tipoUsuario === "admin";

  // Datos de cliente
  const comprador = pedido?.comprador || pedido?.usuario || pedido?.cliente || {};
  const nombreCompleto = `${comprador.nombres || comprador.nombre || ""} ${
    comprador.apellidos || comprador.apellido || ""
  }`.trim();
  const correo = comprador.correo || comprador.email || "—";

  // Dirección envío
  const envio = pedido?.envio || {};
  const dir = envio.direccion || envio.calle || envio.detalle || "—";
  const comuna = envio.comuna || "—";
  const region = envio.region || "—";

  // Items enriquecidos con nombre de producto
  const items = (pedido?.items || []).map((it) => {
    const prod = Array.isArray(productos)
      ? productos.find((x) => x.codigo === it.codigo)
      : null;
    return {
      ...it,
      nombre: prod?.nombre || it.codigo,
    };
  });

  const marcarDespachado = () => {
    if (!pedido) return;
    if (pedido.estado === "despachado" || pedido.estado === "cancelado") return;

    const nuevos = pedidos.map((p) =>
      p.id === pedido.id ? { ...p, estado: "despachado" } : p
    );
    setPedidos(nuevos);
    localStorage.setItem("pedidos", JSON.stringify(nuevos));
    alert("Pedido marcado como despachado.");
  };

  const titulo =
    pedido ? `Pedido ${pedido.id} — ${estadoLabel(pedido.estado).toUpperCase()}` : "Pedido";

  return (
    <div className="principal">
      {/* Header */}
      <Header
        isMenuOpen={menuOpen}
        onOpenAccount={() => setAccountOpen(true)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />

      {/* Menú lateral móvil */}
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      {/* Cuerpo */}
      <section className="admin">
        {/* Lateral escritorio */}
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos" className="activo">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1 id="tituloPedido">{titulo}</h1>

          {!pedido ? (
            <article className="tarjeta">
              <div className="contenido">
                <p className="info">Pedido no encontrado.</p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button className="btn secundario" onClick={() => navigate("/admin/pedidos")}>
                    Volver a pedidos
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <>
              <div id="detallePedido">
                <article className="tarjeta">
                  <div className="contenido">
                    <p>
                      <strong>Fecha:</strong> {fechaHoraLarga(pedido.fecha)}
                    </p>
                    <p>
                      <strong>Cliente:</strong> {nombreCompleto || "—"} — {correo}
                    </p>
                    <p>
                      <strong>Envío:</strong> {dir}, {comuna}, {region}
                    </p>
                    <p>
                      <strong>Total:</strong> {CLP(pedido.total || 0)}
                    </p>

                    <h4>Ítems</h4>
                    {(items || []).length === 0 ? (
                      <p className="info">Sin ítems.</p>
                    ) : (
                      items.map((it, idx) => (
                        <div key={idx} className="item-carrito">
                          <div>
                            <strong>{it.nombre}</strong>
                            <br />
                            <small>{it.codigo}</small>
                          </div>
                          <div>{CLP(it.precio || 0)}</div>
                          <div>x{it.cantidad || 1}</div>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  id="btnMarcarDespachado"
                  className={
                    pedido.estado === "pendiente" ? "btn exito" : "btn secundario"
                  }
                  disabled={pedido.estado !== "pendiente"}
                  onClick={marcarDespachado}
                  style={{ cursor: pedido.estado === "pendiente" ? "pointer" : "default" }}
                >
                  {pedido.estado === "pendiente"
                    ? "Marcar como despachado"
                    : pedido.estado === "despachado"
                    ? "Pedido despachado"
                    : "Pedido cancelado"}
                </button>

                {/* Nuevo botón Generar Boleta */}
                {(pedido.estado === "pendiente" || pedido.estado === "despachado") && (
                  <button 
                    style={{ paddingLeft: 16, marginLeft: 8 }}
                    id="btnGenerarBoleta"
                    className="btn secundario"
                    onClick={() => {
                      const dlg = document.getElementById("dlgBoleta");
                      const hid = document.getElementById("boletaPedidoId");
                      const resumen = document.getElementById("boletaResumen");
                      
                      if (dlg && hid && resumen) {
                        hid.value = pedido.id;
                        resumen.innerHTML = `<p>Boleta del pedido ${pedido.id}</p>`;
                        dlg.showModal();
                      }
                    }}
                  >
                    Generar boleta
                  </button>
                )}

              </div>
            </>
          )}
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      {/* Panel cuenta + cortina */}
      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
