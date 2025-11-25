import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtener, usuarioActual, guardar } from "../../utils/storage";
import { pedidosAPI, obtenerProductos } from "../../services/apiService";

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
  const e = (estado || "").toUpperCase();
  if (e === "DESPACHADO") return "Despachado";
  if (e === "CANCELADO") return "Cancelado";
  return "Pendiente";
};

// ===== Hook sesión con API Backend =====
function useSessionData() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
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

        // Cargar pedidos y productos desde API backend
    // Cargar pedidos y productos desde el backend
        const [pedidosData, productosData] = await Promise.all([
          pedidosAPI.getAll(),
          obtenerProductos(),
        ]);

        // Datos cargados correctamente
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
        setProductos(Array.isArray(productosData) ? productosData : []);

        setLoading(false);
      } catch (error) {
  // Si ocurre un error al cargar los datos, se guarda el mensaje en el estado
        setError(error.message);
  // Si hay error, se usan datos locales como respaldo
        setPedidos(
          Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []
        );
        setProductos(
          Array.isArray(obtener("productos", []))
            ? obtener("productos", [])
            : []
        );
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { user, pedidos, setPedidos, productos, loading, error };
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
              LEVEL<span className="up">UP</span>{" "}
              <span className="gamer">GAMER</span>
            </span>
          </a>
        </div>

        {/* NAV móvil: Mi cuenta, Inicio, Productos y Salir */}
        <nav
          id="menuLista"
          className="menu-lista"
          data-clonado="1"
          onClick={onClose}
        >
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

// ===== Página Detalle =====
export default function DetallePedidoPanel() {
  const { id: paramId } = useParams(); // viene desde /admin/pedidos/:id
  const navigate = useNavigate();
  const { user, pedidos, setPedidos, productos, loading, error } =
    useSessionData();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Modo menú móvil
  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  const [pedido, setPedido] = useState(null);
  const [loadingPedido, setLoadingPedido] = useState(true);

  // Cargar pedido específico desde la API
  useEffect(() => {
    const cargarPedidoEspecifico = async () => {
      if (!paramId) return;

      try {
        setLoadingPedido(true);
        const plain = decodeURIComponent(paramId);
  // Cargando pedido específico por ID

        const pedidoData = await pedidosAPI.getById(plain);
  // Pedido cargado correctamente
        setPedido(pedidoData);
      } catch (error) {
  // Si ocurre un error al cargar el pedido, se muestra un mensaje
        setPedido(null);
      } finally {
        setLoadingPedido(false);
      }
    };

    cargarPedidoEspecifico();
  }, [paramId]);

  if (!user) return null;

  // 🔥 CORRECCIÓN: detección robusta de administrador
  const tipo = (user?.tipoUsuario ?? user?.tipo ?? "")
    .toString()
    .trim()
    .toUpperCase();
  const isAdmin = tipo === "ADMIN";

  // Datos de cliente (vienen del backend en pedido.usuario)
  const comprador = pedido?.usuario || {};
  const nombreCompleto = `${comprador.nombres || ""} ${
    comprador.apellidos || ""
  }`.trim();
  const correo = comprador.correo || "—";

  // Dirección envío (vienen directos en el pedido)
  const dir = pedido?.direccion || "—";
  const comuna = pedido?.comuna || "—";
  const region = pedido?.region || "—";

  // Items enriquecidos con nombre de producto (ahora debe venir del backend)
  // Procesar datos del pedido y sus items

  const items = (pedido?.items || []).map((it) => {
    const prod = Array.isArray(productos)
      ? productos.find(
          (x) =>
            x.codigo ===
            (it.producto?.codigo || it.codigoProducto || it.codigo)
        )
      : null;

    return {
      ...it,
      codigo: it.producto?.codigo || it.codigoProducto || it.codigo,
      nombre:
        it.producto?.nombre || prod?.nombre || it.codigo || "Producto sin nombre",
      precio: it.precio || it.precioUnitario || 0,
      cantidad: it.cantidad || 1,
    };
  });


  const marcarDespachado = async () => {
    if (!pedido) return;
    if (pedido.estado === "DESPACHADO" || pedido.estado === "CANCELADO") return;

    try {
      // Actualizar estado en el backend
      const pedidoActualizado = await pedidosAPI.updateStatus(
        pedido.id,
        "DESPACHADO"
      );

      // Actualizar el pedido local
      setPedido(pedidoActualizado);

      // Actualizar la lista de pedidos si existe
      if (setPedidos && Array.isArray(pedidos)) {
        const nuevos = pedidos.map((p) =>
          p.id === pedido.id ? { ...p, estado: "DESPACHADO" } : p
        );
        setPedidos(nuevos);
      }

      alert("Pedido marcado como despachado.");
    } catch (error) {
      // Si ocurre un error al actualizar el estado, se muestra un mensaje al usuario
      alert("Error al actualizar el estado del pedido");
    }
  };

  // Generar (si no existe) y navegar a la boleta relacionada
  const verOMantenerBoleta = () => {
    if (!pedido) return;

    const boletasExistentes = Array.isArray(obtener("boletas", []))
      ? obtener("boletas", [])
      : [];
    // Buscar boleta existente para este pedido
    const boletaExistente = boletasExistentes.find(
      (b) => b.pedidoId === pedido.id
    );
    if (boletaExistente) {
      const numero = encodeURIComponent(boletaExistente.numero);
      navigate(`/admin/boleta/${numero}`);
      return;
    }

    // Crear nueva boleta con la misma estructura que usa el panel de Boletas
    const comprador = pedido?.comprador || pedido?.usuario || pedido?.cliente || {};
    const nombreCompleto =
      `${comprador.nombres || comprador.nombre || ""} ${
        comprador.apellidos || comprador.apellido || ""
      }`.trim() || "Cliente";
    const timestamp = Date.now();
    const numeroBoleta = `BOL-${String(timestamp).slice(-6)}`;
    const nuevaBoleta = {
      numero: numeroBoleta,
      fecha: new Date().toISOString().split("T")[0],
      cliente: nombreCompleto,
      pedidoId: pedido.id,
      // calcular total con descuentos (mismas reglas que cliente)
      // subtotal
      total: null,
      totalNumerico: 0,
      fechaCreacion: new Date().toISOString(),
    };

    // calcular subtotal a partir de items
    const productos = Array.isArray(obtener("productos"))
      ? obtener("productos")
      : [];
    const items = (pedido.items || []).map((it) => {
      const p = productos.find((x) => x.codigo === it.codigo);
      return { ...it, nombre: p ? p.nombre : it.codigo };
    });
    const subtotal = items.reduce(
      (s, it) =>
        s + Number(it.precio || 0) * Number(it.cantidad || 1),
      0
    );

    const VALOR_PUNTO = 10;
    const TOPE_DESC_POR_PUNTOS = 0.2;
    // puntos comprador (buscar en usuarios por correo si existe)
    let puntosComprador = 0;
    try {
      const usuarios = Array.isArray(obtener("usuarios"))
        ? obtener("usuarios")
        : [];
      const u = usuarios.find(
        (x) =>
          (x.correo || "").toLowerCase() ===
          (comprador.correo || "").toLowerCase()
      );
      puntosComprador = u ? Number(u.puntosLevelUp || 0) : 0;
    } catch {
      puntosComprador = 0;
    }

    const aplicaDuoc = (comprador && (comprador.correo || "")
      .toLowerCase()
      .endsWith("@duoc.cl"));
    const descuentoDuoc = aplicaDuoc ? Math.round(subtotal * 0.2) : 0;
    const valorPuntosDisponibles = Math.max(0, puntosComprador * VALOR_PUNTO);
    const maxPorPuntos = Math.round(subtotal * TOPE_DESC_POR_PUNTOS);
    const descuentoPuntos = Math.min(
      valorPuntosDisponibles,
      maxPorPuntos
    );

    const totalNumerico = Math.max(
      0,
      subtotal - descuentoDuoc - descuentoPuntos
    );
    nuevaBoleta.totalNumerico = totalNumerico;
    nuevaBoleta.total = CLP(totalNumerico);

    const todas = [...boletasExistentes, nuevaBoleta];
    guardar("boletas", todas);
    // Navegar al detalle de la boleta recién creada
    navigate(`/admin/boleta/${encodeURIComponent(numeroBoleta)}`);
  };

  const titulo = pedido
    ? `PED-${pedido.id} — ${estadoLabel(pedido.estado).toUpperCase()}`
    : "Pedido";

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
          <a href="/admin/pedidos" className="activo">
            Pedidos
          </a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1 id="tituloPedido">{titulo}</h1>

          {loading || loadingPedido ? (
            <article className="tarjeta">
              <div className="contenido">
                <p className="info">🔄 Cargando pedido desde el backend...</p>
              </div>
            </article>
          ) : error ? (
            <article className="tarjeta">
              <div className="contenido">
                <p className="info" style={{ color: "#dc2626" }}>
                  ❌ Error: {error}
                </p>
                <p>
                  <small>
                    Revisa que el backend Spring Boot esté ejecutándose en
                    puerto 8080
                  </small>
                </p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button
                    className="btn secundario"
                    onClick={() => navigate("/admin/pedidos")}
                  >
                    Volver a pedidos
                  </button>
                </div>
              </div>
            </article>
          ) : !pedido ? (
            <article className="tarjeta">
              <div className="contenido">
                <p className="info">Pedido no encontrado.</p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button
                    className="btn secundario"
                    onClick={() => navigate("/admin/pedidos")}
                  >
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
                      <strong>Cliente:</strong> {nombreCompleto || "—"} —{" "}
                      {correo}
                    </p>
                    <p>
                      <strong>Envío:</strong> {dir}, {comuna}, {region}
                    </p>
                    <p>
                      <strong>Total:</strong> {CLP(pedido.total || 0)}
                    </p>

                    <h4>Ítems del Pedido</h4>
                    {(items || []).length === 0 ? (
                      <p className="info">Sin ítems encontrados.</p>
                    ) : (
                      <div className="items-pedido">
                        {items.map((it, idx) => (
                          <div key={idx} className="item-carrito">
                            <div>
                              <strong>{it.nombre}</strong>
                              <br />
                              <small>Código: {it.codigo}</small>
                            </div>
                            <div>{CLP(it.precio || 0)}</div>
                            <div>x{it.cantidad || 1}</div>
                            <div>
                              <strong>
                                {CLP(
                                  (it.precio || 0) * (it.cantidad || 1)
                                )}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <h4 style={{ marginTop: "20px" }}>Resumen de Totales</h4>
                    <div className="totales-pedido">
                      <div className="total-row">
                        <span>Subtotal:</span>
                        <span>{CLP(pedido.subtotal || 0)}</span>
                      </div>
                      {pedido.descuentoDuoc > 0 && (
                        <div className="total-row descuento">
                          <span>Descuento Duoc (20%):</span>
                          <span>-{CLP(pedido.descuentoDuoc)}</span>
                        </div>
                      )}
                      {pedido.descuentoPuntos > 0 && (
                        <div className="total-row descuento">
                          <span>Descuento con puntos:</span>
                          <span>-{CLP(pedido.descuentoPuntos)}</span>
                        </div>
                      )}
                      <div
                        className="total-row total-final"
                        style={{
                          borderTop: "1px solid #ddd",
                          paddingTop: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <span>
                          <strong>Total Final:</strong>
                        </span>
                        <span>
                          <strong>{CLP(pedido.total || 0)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  id="btnMarcarDespachado"
                  className={
                    pedido.estado === "PENDIENTE" ? "btn exito" : "btn secundario"
                  }
                  disabled={pedido.estado !== "PENDIENTE"}
                  onClick={marcarDespachado}
                  style={{
                    cursor:
                      pedido.estado === "PENDIENTE" ? "pointer" : "default",
                  }}
                >
                  {pedido.estado === "PENDIENTE"
                    ? "Marcar como despachado"
                    : pedido.estado === "DESPACHADO"
                    ? "Pedido despachado"
                    : "Pedido cancelado"}
                </button>

                {/* Botón Generar Boleta */}
                {(pedido.estado === "PENDIENTE" ||
                  pedido.estado === "DESPACHADO") && (
                  <button
                    id="btnGenerarBoleta"
                    className="btn secundario"
                    onClick={verOMantenerBoleta}
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
      <AccountPanel
        user={user}
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </div>
  );
}
