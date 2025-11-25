// src/components/boleta/DetalleBoleta.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usuarioActual } from "../../utils/storage";
import { pedidosAPI, boletasAPI, obtenerProductos } from "../../services/apiService";

// ===== Helpers =====
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      })
    : "—";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ===== Header / SideMenu / AccountPanel =====
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

// ===== Página DetalleBoleta (100% backend) =====
const DetalleBoleta = () => {
  const { numero } = useParams();
  const navigate = useNavigate();

  // --- Hooks SIEMPRE en el mismo orden ---
  const [user, setUser] = useState(null);
  const [boleta, setBoleta] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

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

        const plainNumero = decodeURIComponent(numero || "");

        // 1) Boleta desde backend
        const boletaData = await boletasAPI.getByNumero(plainNumero);
        setBoleta(boletaData || null);

        // 2) Pedido asociado
        if (boletaData) {
          const pedidoId = boletaData.pedido?.id ?? boletaData.pedidoId;
          if (pedidoId) {
            const pedidoData = await pedidosAPI.getById(pedidoId);
            setPedido(pedidoData || null);
          }
        }

        // 3) Productos
        const productosData = await obtenerProductos();
        setProductos(Array.isArray(productosData) ? productosData : []);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Error al cargar boleta");
        setLoading(false);
      }
    };

    loadData();
  }, [numero]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  // Items enriquecidos (hook, debe estar SIEMPRE arriba, nunca dentro de if)
  const items = useMemo(() => {
    if (!pedido || !Array.isArray(pedido.items)) return [];
    return pedido.items.map((item) => {
      const producto = Array.isArray(productos)
        ? productos.find(
            (p) =>
              p.codigo === item.codigo ||
              p.codigo === item.producto?.codigo
          )
        : null;

      return {
        ...item,
        codigo: item.codigo || item.producto?.codigo,
        nombre:
          producto?.nombre ||
          item.producto?.nombre ||
          item.codigo ||
          "Producto no encontrado",
        precio: item.precio || item.precioUnitario || 0,
        cantidad: item.cantidad || 1,
      };
    });
  }, [pedido, productos]);

  // Datos del cliente
  const comprador = pedido?.comprador || pedido?.usuario || pedido?.cliente || {};
  const nombreCompleto = `${comprador.nombres || comprador.nombre || ""} ${
    comprador.apellidos || comprador.apellido || ""
  }`.trim();
  const correo = comprador.correo || comprador.email || "—";

  // Rol del usuario logueado
  const tipo = (user?.tipoUsuario ?? user?.tipo ?? "")
    .toString()
    .trim()
    .toUpperCase();
  const isAdmin = tipo === "ADMIN";
  const canSeeBoletas = tipo === "ADMIN" || tipo === "VENDEDOR";

  // Subtotales y descuentos (si todavía no los calculas en backend)
  const VALOR_PUNTO = 10;
  const TOPE_DESC_POR_PUNTOS = 0.2;

  const subtotalNum = (items || []).reduce(
    (s, it) => s + Number(it.precio || 0) * Number(it.cantidad || 1),
    0
  );

  const aplicaDuoc = (comprador && (comprador.correo || "").toLowerCase().endsWith("@duoc.cl"));
  const descuentoDuocNum = aplicaDuoc ? Math.round(subtotalNum * 0.2) : 0;

  const puntosComprador = 0; // si luego quieres, lo traes desde backend
  const valorPuntosDisponibles = Math.max(0, puntosComprador * VALOR_PUNTO);
  const maxPorPuntos = Math.round(subtotalNum * TOPE_DESC_POR_PUNTOS);
  const descuentoPuntosNum = Math.min(valorPuntosDisponibles, maxPorPuntos);

  const totalNum =
    typeof boleta?.totalNumerico === "number"
      ? boleta.totalNumerico
      : subtotalNum - descuentoDuocNum - descuentoPuntosNum;

  const imprimirBoleta = () => {
    if (!boleta) return;

    const fechaStr =
      pedido?.fecha || boleta.fecha || boleta.fechaEmision
        ? new Date(pedido?.fecha || boleta.fecha || boleta.fechaEmision).toLocaleString(
            "es-CL"
          )
        : new Date().toLocaleString("es-CL");

    let subtotalLocal = 0;
    const filas = (items || [])
      .map((it) => {
        const precioNum = Number(it.precio || 0);
        const cantidad = Number(it.cantidad || 1);
        const sub = precioNum * cantidad;
        subtotalLocal += sub;
        return `
          <tr>
            <td>${it.nombre}<br><small>${it.codigo || ""}</small></td>
            <td style="text-align:right">${CLP(precioNum)}</td>
            <td style="text-align:center">x${cantidad}</td>
            <td style="text-align:right">${CLP(sub)}</td>
          </tr>`;
      })
      .join("");

    const pedidoId = pedido?.id || boleta.pedidoId || boleta.numero || "--";

    const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Boleta ${pedidoId}</title>
<style>
  body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; padding:20px; }
  h1{ margin:0 0 6px 0; font-size:20px; }
  table{ width:100%; border-collapse:collapse; }
  th, td{ padding:6px 0; border-bottom:1px solid #ddd; font-size:14px; }
  tfoot td{ border-bottom:0; }
  .enc{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
  .enc .icon{ font-size:28px; }
  .small{ color:#555; font-size:12px; }
  .descuentos{ margin-top:8px; font-size:14px; }
</style>
</head>
<body>
  <div class="enc">
    <div>
      <h1>Level-Up Gamer</h1>
      <div class="small">Boleta electrónica</div>
      <div class="small">Pedido: ${pedidoId}</div>
      <div class="small">Fecha: ${fechaStr}</div>
      <div class="small">Cliente: ${nombreCompleto || boleta.cliente || "—"} ${
      correo !== "—" ? "— " + correo : ""
    }</div>
    </div>
    <div class="icon">📄</div>
  </div>
  <hr>
  <table>
    <thead>
      <tr>
        <th style="text-align:left">Producto</th>
        <th style="text-align:right">Precio</th>
        <th style="text-align:center">Cant</th>
        <th style="text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
    </tbody>
  </table>

  <div class="descuentos">
    <div><strong>Subtotal:</strong> ${CLP(subtotalLocal)}</div>
    ${descuentoDuocNum > 0 ? `<div>Descuento DUOC: -${CLP(descuentoDuocNum)}</div>` : ""}
    ${descuentoPuntosNum > 0 ? `<div>Descuento Puntos: -${CLP(
      descuentoPuntosNum
    )} (${puntosComprador} pts)</div>` : ""}
    <div style="margin-top:8px"><strong>Total:</strong> ${CLP(
      Math.max(0, subtotalLocal - descuentoDuocNum - descuentoPuntosNum)
    )}</div>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`.trim();

    const w = window.open("", "_blank");
    if (!w) {
      alert(
        "Bloqueado por el navegador. Permití ventanas emergentes para generar el PDF."
      );
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
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
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          {canSeeBoletas && (
            <a href="/admin/boleta" className="activo">
              Boletas
            </a>
          )}
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1>Detalle de Boleta</h1>

          {loading ? (
            <p className="info">🔄 Cargando boleta desde el backend...</p>
          ) : error ? (
            <div className="tarjeta">
              <div className="contenido">
                <p className="info" style={{ color: "#dc2626" }}>
                  ❌ Error: {error}
                </p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button
                    className="btn secundario"
                    onClick={() => navigate("/admin/boleta")}
                  >
                    Volver a Boletas
                  </button>
                </div>
              </div>
            </div>
          ) : !boleta ? (
            <div className="tarjeta">
              <div className="contenido">
                <p className="info">Boleta no encontrada.</p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button
                    className="btn secundario"
                    onClick={() => navigate("/admin/boleta")}
                  >
                    Volver a Boletas
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Información de la boleta */}
              <div className="tarjeta" style={{ marginBottom: 16 }}>
                <div className="contenido">
                  <h2 style={{ marginTop: 0, color: "var(--azul)" }}>
                    Boleta {boleta.numero}
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <p>
                        <strong>Fecha de Emisión:</strong>
                      </p>
                      <p>{boleta.fecha || boleta.fechaEmision || "—"}</p>
                    </div>
                    <div>
                      <p>
                        <strong>Cliente:</strong>
                      </p>
                      <p>{boleta.cliente || nombreCompleto || "—"}</p>
                      {correo !== "—" && (
                        <p>
                          <small>{correo}</small>
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong>Pedido Relacionado:</strong>
                      </p>
                      <p>{boleta.pedidoId || pedido?.id || "—"}</p>
                    </div>
                    <div>
                      <p>
                        <strong>Subtotal:</strong>
                      </p>
                      <p>{CLP(subtotalNum)}</p>
                    </div>
                    <div>
                      <p>
                        <strong>Descuentos:</strong></p>
                      <div style={{ fontSize: "0.95em" }}>
                        {descuentoDuocNum > 0 && (
                          <div>Descuento DUOC: -{CLP(descuentoDuocNum)}</div>
                        )}
                        {descuentoPuntosNum > 0 && (
                          <div>
                            Descuento Puntos: -{CLP(descuentoPuntosNum)}{" "}
                            <small>({puntosComprador} pts)</small>
                          </div>
                        )}
                        {descuentoDuocNum === 0 && descuentoPuntosNum === 0 && (
                          <div>
                            <small>Sin descuentos aplicables</small>
                          </div>
                        )}
                      </div>
                      <p style={{ marginTop: 8 }}>
                        <strong>Total:</strong>
                      </p>
                      <p style={{ fontSize: "1.2em", color: "var(--verde)" }}>
                        {CLP(totalNum)}
                      </p>
                    </div>
                  </div>

                  <div className="acciones" style={{ gap: 8 }}>
                    <button
                      className="btn secundario"
                      onClick={() => navigate("/admin/boleta")}
                    >
                      Volver a Boletas
                    </button>
                    {pedido && (
                      <button
                        className="btn secundario"
                        onClick={() => {
                          const pedidoId = encodeURIComponent(
                            String(pedido.id).replace(/^PED-?/i, "")
                          );
                          navigate(`/admin/pedidos/${pedidoId}`);
                        }}
                      >
                        Ver Pedido
                      </button>
                    )}
                    <button className="btn exito" onClick={imprimirBoleta}>
                      Imprimir Boleta
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalle de items */}
              {items.length > 0 && (
                <div className="tarjeta">
                  <div className="contenido">
                    <h3>Detalle de Productos</h3>

                    <div style={{ overflowX: "auto" }}>
                      <table className="tabla" style={{ width: "100%", marginTop: 12 }}>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Código</th>
                            <th>Precio Unit.</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.nombre}</td>
                              <td>
                                <small>{item.codigo}</small>
                              </td>
                              <td>{CLP(item.precio || 0)}</td>
                              <td>{item.cantidad || 1}</td>
                              <td>
                                {CLP((item.precio || 0) * (item.cantidad || 1))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr
                            style={{
                              borderTop: "2px solid var(--borde)",
                              fontWeight: "bold",
                            }}
                          >
                            <td colSpan="4">TOTAL</td>
                            <td style={{ color: "var(--verde)" }}>
                              {CLP(totalNum)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
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
};

export default DetalleBoleta;
