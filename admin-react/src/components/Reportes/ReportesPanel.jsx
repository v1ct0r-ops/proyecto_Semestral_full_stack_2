import React, { useEffect, useMemo, useState } from "react";
import { obtener, usuarioActual } from "../../utils/storage";

/* ===================== Helpers comunes ===================== */
const CLP = (n) =>
  (Number(n) || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

const fechaCorta = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).toString().padStart(2, "0");
  const yy = d.getFullYear();
  const hh = String(d.getHours()).toString().padStart(2, "0");
  const mi = String(d.getMinutes()).toString().padStart(2, "0");
  return `${dd}-${mm}-${yy} / ${hh}:${mi}`;
};

/* Pedidos: campos tolerantes */
const getFechaPedido = (p) => p?.fecha || p?.fechaPedido || p?.creado || p?.createdAt || null;
const getEstadoPedido = (p) => p?.estado || p?.status || "Pendiente";
const getItemsPedido = (p) => (Array.isArray(p?.items) ? p.items : []);
const getTotalPedido = (p) =>
  Number(p?.total) ||
  getItemsPedido(p).reduce((a, it) => a + (Number(it.precio) || 0) * (Number(it.cantidad) || 0), 0);
const getComprador = (p) => p?.comprador || {};

/* Usuario ↔ Pedido matching flexible */
function extraerClavesPedido(p) {
  const c = getComprador(p);
  return {
    run: p?.runUsuario ?? p?.clienteRun ?? p?.run ?? p?.usuarioRun ?? c?.run ?? null,
    correo: p?.correoUsuario ?? p?.email ?? p?.correo ?? c?.correo ?? null,
    usuarioId: p?.usuarioId ?? p?.userId ?? p?.idUsuario ?? null,
  };
}
function perteneceAPersona(pedido, usuario) {
  const k = extraerClavesPedido(pedido);
  return (
    (k.run && norm(k.run) === norm(usuario?.run)) ||
    (k.correo && norm(k.correo) === norm(usuario?.correo)) ||
    (k.usuarioId && norm(k.usuarioId) === norm(usuario?.id))
  );
}

/* ===================== Shell de Admin (Header / Side / Account) ===================== */
function Header({ onOpenAccount, onToggleMenu, isMenuOpen }) {
  return (
    <header className="encabezado">
      <a className="logo" href="/admin">
        <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
      </a>
      <button
        id="btnAbrirMenu"
        type="button"
        className="btn-menu"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
        <button id="btnPerfilDesk" type="button" className="perfil-desk" aria-label="Mi cuenta" onClick={onOpenAccount}>
          <img src="/img/imgPerfil.png" alt="" loading="lazy" />
        </button>
      </nav>
    </header>
  );
}

function SideMenu({ open, onClose, onOpenAccount }) {
  const handleClose = () => {
    onClose();
    const btn = document.getElementById("btnAbrirMenu");
    if (btn) btn.focus();
  };
  return (
    <>
      <aside
        id="menuLateral"
        className={`menu-lateral ${open ? "abierto" : ""}`}
        role="dialog"
        aria-modal="true"
        {...(!open ? { inert: true } : {})}
        //{...(!open ? { inert: "" } : {})}
      >
        <div className="menu-cabecera">
          <a className="logo" href="/admin">
            <span className="marca">LEVEL<span className="up">UP</span> <span className="gamer">GAMER</span></span>
          </a>
        </div>
        <nav id="menuLista" className="menu-lista" data-clonado="1">
          <a href="#" id="linkMiCuentaMov" onClick={(e) => { e.preventDefault(); handleClose(); onOpenAccount(); }}>
            Mi cuenta
          </a>
          <a href="/cliente/index.html" onClick={handleClose}>Inicio</a>
          <a href="/cliente/productos.html" onClick={handleClose}>Productos</a>
          <a
            href="/cliente/index.html"
            id="linkSalirMov"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem("sesion");
              handleClose();
              window.location.href = "/cliente/index.html";
            }}
          >
            Salir
          </a>
        </nav>
      </aside>
      <div id="cortina" className="cortina" hidden={!open} onClick={handleClose} />
    </>
  );
}

function AccountPanel({ user, open, onClose }) {
  const puntos = user?.puntosLevelUp ?? 0;
  const nivel = calcularNivel(puntos);
  const codigo = user?.codigoReferido || "";
  if (!open) return null;
  return (
    <>
      <aside className="panel-cuenta panel-cuenta--abierto" role="dialog" aria-modal="true" aria-labelledby="panelCuentaTitulo">
        <div className="panel-cuenta__cab">
          <h3 id="panelCuentaTitulo">Mi cuenta</h3>
          <button className="panel-cuenta__cerrar" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>
        <div className="panel-cuenta__contenido">
          <div className="panel-cuenta__avatar"><img src="/img/imgPerfil.png" alt="Foto de perfil" /></div>
          <p><strong>Nombre:</strong> {`${user?.nombres || ""} ${user?.apellidos || ""}`.trim() || "—"}</p>
          <p><strong>Correo:</strong> {user?.correo || "—"}</p>
          <a className="btn secundario" href="/cliente/perfil.html">Editar Perfil</a>
          <div className="panel-cuenta__bloque">
            <label><strong>Código de referido</strong></label>
            <div className="panel-cuenta__ref">
              <input readOnly value={codigo} />
              <button className="btn secundario" type="button" onClick={async () => { try { await navigator.clipboard.writeText(codigo); alert("¡Copiado!"); } catch {} }}>
                Copiar
              </button>
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
            <button className="btn" onClick={() => { localStorage.removeItem("sesion"); window.location.href = "/cliente/index.html"; }}>
              Salir
            </button>
          </div>
        </div>
      </aside>
      <div id="cortinaCuenta" className="cortina" onClick={onClose} />
    </>
  );
}

/* ===================== Reportes ===================== */
export default function ReportesPanel() {
  /* --- Shell / sesión --- */
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  /* --- Datos base desde localStorage (memo para no recalcular) --- */
  const productos = useMemo(
    () => (Array.isArray(obtener("productos", [])) ? obtener("productos", []) : []),
    []
  );
  const pedidos = useMemo(
    () => (Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []),
    []
  );
  const usuarios = useMemo(
    () => (Array.isArray(obtener("usuarios", [])) ? obtener("usuarios", []) : []),
    []
  );

  /* --- Efecto de sesión y clase del body --- */
  useEffect(() => {
    const u = usuarioActual();
    if (!u) { alert("Acceso restringido."); window.location.href = "/index.html"; return; }
    setUser(u);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  /* --- UI states (deben ir ANTES de cualquier return) --- */
  // 1) Boletas
  const [qBoleta, setQBoleta] = useState("");
  // 2) Productos críticos
  const [umbral, setUmbral] = useState(5);
  // 4) Historial por usuario
  const [qUsuario, setQUsuario] = useState("");
  const [usuarioSel, setUsuarioSel] = useState(null);

  /* --- Derivados (useMemo) --- */
  // 1) Boletas/órdenes filtradas
  const boletasFiltradas = useMemo(() => {
    const q = norm(qBoleta);
    if (!q) return pedidos;
    return pedidos.filter((p) => {
      const c = getComprador(p);
      return (
        norm(p?.id).includes(q) ||
        norm(p?.codigo).includes(q) ||
        norm(c?.correo).includes(q) ||
        norm(c?.run).includes(q)
      );
    });
  }, [pedidos, qBoleta]);

  // 2) Productos críticos
  const productosCriticos = useMemo(
    () => productos.filter((p) => (Number(p?.stock) || 0) <= Number(umbral || 0)),
    [productos, umbral]
  );

  // 3) Reporte general productos
  const ventasPorCodigo = useMemo(() => {
    const map = new Map();
    pedidos.forEach((p) =>
      getItemsPedido(p).forEach((it) => {
        const cant = Number(it.cantidad) || 0;
        map.set(it.codigo, (map.get(it.codigo) || 0) + cant);
      })
    );
    return map;
  }, [pedidos]);

  const productosEnriquecidos = useMemo(
    () => productos.map((p) => ({ ...p, vendidos: ventasPorCodigo.get(p.codigo) || 0 })),
    [productos, ventasPorCodigo]
  );

  const topVendidos = useMemo(
    () => [...productosEnriquecidos].sort((a, b) => b.vendidos - a.vendidos).slice(0, 10),
    [productosEnriquecidos]
  );

  const sinRotacion = useMemo(
    () => productosEnriquecidos.filter((p) => (p.vendidos || 0) === 0),
    [productosEnriquecidos]
  );

  const inventarioTotal = useMemo(
    () => productos.reduce((acc, p) => acc + (Number(p?.stock) || 0), 0),
    [productos]
  );

  // 4) Historial por usuario
  const usuariosFiltrados = useMemo(() => {
    const q = norm(qUsuario);
    if (!q) return usuarios;
    return usuarios.filter(
      (u) =>
        norm(u.run).includes(q) ||
        norm(u.correo).includes(q) ||
        norm(`${u.nombres} ${u.apellidos}`).includes(q)
    );
  }, [usuarios, qUsuario]);

  const comprasUsuarioSel = useMemo(() => {
    if (!usuarioSel) return [];
    return pedidos.filter((p) => perteneceAPersona(p, usuarioSel));
  }, [pedidos, usuarioSel]);

  /* --- NO retornar antes de aquí; todos los hooks ya están declarados --- */
  if (!user) return null;
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
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitud</a>
          <a href="/admin/reportes" className="activo">Reportes</a>
        </aside>

        <div className="panel">
          <h1>Reportes</h1>

          {/* ====== 1) Órdenes/Boletas ====== */}
          <article className="tarjeta">
            <div className="contenido">
              <h3>Órdenes / Boletas</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <input
                  placeholder="Buscar por ID, RUN o correo…"
                  value={qBoleta}
                  onChange={(e) => setQBoleta(e.target.value)}
                />
              </div>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {boletasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <p className="info" style={{ margin: 0 }}>Sin boletas.</p>
                      </td>
                    </tr>
                  ) : (
                    boletasFiltradas.map((p) => {
                      const c = getComprador(p);
                      return (
                        <tr key={p.id || p.codigo}>
                          <td>{p.id || p.codigo || "—"}</td>
                          <td>{fechaCorta(getFechaPedido(p))}</td>
                          <td>
                            {`${c?.nombres || ""} ${c?.apellidos || ""}`.trim()}{" "}
                            <small>({c?.correo || "—"})</small>
                          </td>
                          <td
                            style={{
                              color:
                                getEstadoPedido(p) === "Despachado"
                                  ? "green"
                                  : getEstadoPedido(p) === "Cancelado"
                                  ? "red"
                                  : getEstadoPedido(p) === "Pendiente"
                                  ? "orange"
                                  : "inherit",
                              fontWeight: "bold",
                            }}
                          >
                            {getEstadoPedido(p)}
                          </td>
                          <td>{CLP(getTotalPedido(p))}</td>
                          <td style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <a
                              className="btn secundario"
                              href={`/admin/pedidos/${encodeURIComponent(p.id || p.codigo || "")}`}
                            >
                              Ver
                            </a>
                            <button className="btn" onClick={() => window.print()}>
                              Imprimir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* ====== 2) Productos críticos ====== */}
          <article className="tarjeta">
            <div className="contenido">
              <h3>Listado de productos críticos</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <label>Umbral:</label>
                <input
                  type="number"
                  min={0}
                  value={umbral}
                  onChange={(e) => setUmbral(e.target.value)}
                  style={{ width: 90 }}
                />
              </div>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Sugerencia</th>
                  </tr>
                </thead>
                <tbody>
                  {productosCriticos.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <p className="info" style={{ margin: 0 }}>Sin productos críticos.</p>
                      </td>
                    </tr>
                  ) : (
                    productosCriticos.map((p) => (
                      <tr key={p.codigo}>
                        <td>{p.codigo}</td>
                        <td>{p.nombre}</td>
                        <td>{p.categoria || "—"}</td>
                        <td>{Number(p.stock) || 0}</td>
                        <td>{(Number(p.stock) || 0) <= 0 ? "Reponer urgente" : "Reponer pronto"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* ====== 3) Reporte general de productos ====== */}
          <article className="tarjeta">
            <div className="contenido">
              <h3>Reporte general de productos</h3>
              <div
                className="tarjetas"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div className="kpi">
                  <small>Inventario disponible</small>
                  <span style={{ marginTop: 8 }}>{inventarioTotal}</span>
                </div>
                <div className="kpi">
                  <small>SKU con ventas</small>
                  <span style={{ marginTop: 8 }}>
                    {productosEnriquecidos.filter((p) => p.vendidos > 0).length}
                  </span>
                </div>
                <div className="kpi">
                  <small>SKU sin rotación</small>
                  <span style={{ marginTop: 8 }}>{sinRotacion.length}</span>
                </div>
              </div>

              <h4 style={{ marginTop: 8 }}>Top 10 más vendidos</h4>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Vendidos</th>
                  </tr>
                </thead>
                <tbody>
                  {topVendidos.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <p className="info" style={{ margin: 0 }}>Sin ventas.</p>
                      </td>
                    </tr>
                  ) : (
                    topVendidos.map((p, i) => (
                      <tr key={p.codigo}>
                        <td>{i + 1}</td>
                        <td>{p.codigo}</td>
                        <td>{p.nombre}</td>
                        <td>{p.vendidos}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <h4 style={{ marginTop: 12 }}>Sin rotación</h4>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {sinRotacion.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <p className="info" style={{ margin: 0 }}>Todos tienen ventas.</p>
                      </td>
                    </tr>
                  ) : (
                    sinRotacion.map((p) => (
                      <tr key={p.codigo}>
                        <td>{p.codigo}</td>
                        <td>{p.nombre}</td>
                        <td>{Number(p.stock) || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          {/* ====== 4) Historial de compras por usuario ====== */}
          <article className="tarjeta">
            <div className="contenido">
              <h3>Historial de compras por usuario</h3>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Buscar usuario por RUN, correo o nombre…"
                  value={qUsuario}
                  onChange={(e) => setQUsuario(e.target.value)}
                />
                <select
                  value={usuarioSel?.run || ""}
                  onChange={(e) => {
                    const run = e.target.value;
                    const u = usuarios.find((x) => String(x.run) === String(run));
                    setUsuarioSel(u || null);
                  }}
                >
                  <option value="">Elegir usuario…</option>
                  {usuariosFiltrados.map((u) => (
                    <option key={u.run} value={u.run}>
                      {`${u.nombres || ""} ${u.apellidos || ""}`.trim()} — {u.run} — {u.correo}
                    </option>
                  ))}
                </select>
              </div>

              {!usuarioSel ? (
                <p className="info" style={{ marginTop: 8 }}>
                  Seleccioná un usuario para ver sus compras.
                </p>
              ) : (
                <>
                  <p className="info" style={{ marginTop: 8 }}>
                    <strong>Usuario:</strong>{" "}
                    {`${usuarioSel.nombres || ""} ${usuarioSel.apellidos || ""}`.trim()} ·{" "}
                    <strong>RUN:</strong> {usuarioSel.run} · <strong>Correo:</strong> {usuarioSel.correo}
                  </p>

                  <table className="tabla">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprasUsuarioSel.length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            <p className="info" style={{ margin: 0 }}>Sin compras.</p>
                          </td>
                        </tr>
                      ) : (
                        comprasUsuarioSel.map((p) => (
                          <tr key={p.id || p.codigo}>
                            <td>{p.id || p.codigo || "—"}</td>
                            <td>{fechaCorta(getFechaPedido(p))}</td>
                            <td
                              style={{
                                color:
                                  getEstadoPedido(p) === "Despachado"
                                    ? "green"
                                    : getEstadoPedido(p) === "Cancelado"
                                    ? "red"
                                    : getEstadoPedido(p) === "Pendiente"
                                    ? "orange"
                                    : "inherit",
                                fontWeight: "bold",
                              }}
                            >
                              {getEstadoPedido(p)}
                            </td>
                            <td>{CLP(getTotalPedido(p))}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Detalle expandible de items */}
                  {comprasUsuarioSel.map((p) => (
                    <details key={`det-${p.id || p.codigo}`} style={{ marginTop: 8 }}>
                      <summary>Ver ítems de {p.id || p.codigo}</summary>
                      <table className="tabla" style={{ marginTop: 8 }}>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getItemsPedido(p).map((it, idx) => (
                            <tr key={idx}>
                              <td>{it.codigo}</td>
                              <td>{it.nombre}</td>
                              <td>{it.cantidad}</td>
                              <td>{CLP(it.precio)}</td>
                              <td>{CLP((Number(it.precio) || 0) * (Number(it.cantidad) || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </details>
                  ))}
                </>
              )}
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
