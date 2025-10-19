// src/components/productos/ReportesProductosPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { obtener, usuarioActual } from "../../utils/storage";

// === Helpers ===
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
    : "—";

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

// ===== Página: Reportes de Productos =====
export default function ReportesProductosPanel() {
  // Hooks al tope
  const [user, setUser] = useState(null);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Cargar datos base
  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);
    setProductos(Array.isArray(obtener("productos", [])) ? obtener("productos", []) : []);
    setPedidos(Array.isArray(obtener("pedidos", [])) ? obtener("pedidos", []) : []);
  }, []);

  // Agregación de ventas por producto (excluye cancelados)
  const ventasMap = useMemo(() => {
    const map = new Map();
    const prods = Array.isArray(productos) ? productos : [];
    const pedidosValidos = (Array.isArray(pedidos) ? pedidos : []).filter(
      (p) => p && p.estado !== "cancelado" && Array.isArray(p.items)
    );

    for (const ped of pedidosValidos) {
      for (const it of ped.items) {
        const codigo = it.codigo;
        const cantidad = Number(it.cantidad) || 0;
        const precio = Number(it.precio) || 0;

        if (!map.has(codigo)) {
          const prod = prods.find((x) => x.codigo === codigo);
          map.set(codigo, {
            codigo,
            nombre: prod?.nombre || codigo,
            cantidad: 0,
            ingresos: 0,
          });
        }
        const acc = map.get(codigo);
        acc.cantidad += cantidad;
        acc.ingresos += cantidad * precio;
      }
    }
    return map;
  }, [productos, pedidos]);

  const ventasArr = useMemo(() => Array.from(ventasMap.values()), [ventasMap]);

  // Top 10 más vendidos (por cantidad desc)
  const topMasVendidos = useMemo(() => {
    const arr = ventasArr.slice().sort((a, b) => b.cantidad - a.cantidad);
    return arr.slice(0, 10);
  }, [ventasArr]);

  // Top 10 menos vendidos (cantidad > 0, asc)
  const topMenosVendidos = useMemo(() => {
    const arr = ventasArr
      .filter((x) => x.cantidad > 0)
      .slice()
      .sort((a, b) => a.cantidad - b.cantidad);
    return arr.slice(0, 10);
  }, [ventasArr]);

  // Top 10 por ingresos
  const topIngresos = useMemo(() => {
    const arr = ventasArr.slice().sort((a, b) => b.ingresos - a.ingresos);
    return arr.slice(0, 10);
  }, [ventasArr]);

  // Productos sin ventas
  const sinVentas = useMemo(() => {
    const prods = Array.isArray(productos) ? productos : [];
    const setVendidos = new Set(ventasArr.filter(v => v.cantidad > 0).map(v => v.codigo));
    return prods
      .filter((p) => !setVendidos.has(p.codigo))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [productos, ventasArr]);

  // Efecto visual menú
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
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
        </aside>

        <div className="panel">
          <h1>Reportes de Productos</h1>

          {/* Más vendidos */}
          <h3 style={{ marginTop: 16 }}>Top 10 — Más vendidos</h3>
          {topMasVendidos.length === 0 ? (
            <p className="info">No hay ventas registradas.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topMasVendidos.map((r) => (
                  <tr key={r.codigo}>
                    <td>{r.codigo}</td>
                    <td>{r.nombre}</td>
                    <td>{r.cantidad}</td>
                    <td>{CLP(r.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Menos vendidos */}
          <h3 style={{ marginTop: 16 }}>Top 10 — Menos vendidos</h3>
          {topMenosVendidos.length === 0 ? (
            <p className="info">No hay ventas registradas.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topMenosVendidos.map((r) => (
                  <tr key={r.codigo}>
                    <td>{r.codigo}</td>
                    <td>{r.nombre}</td>
                    <td>{r.cantidad}</td>
                    <td>{CLP(r.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Mayores ingresos */}
          <h3 style={{ marginTop: 16 }}>Top 10 — Mayores ingresos</h3>
          {topIngresos.length === 0 ? (
            <p className="info">No hay ventas registradas.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topIngresos.map((r) => (
                  <tr key={r.codigo}>
                    <td>{r.codigo}</td>
                    <td>{r.nombre}</td>
                    <td>{r.cantidad}</td>
                    <td>{CLP(r.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Sin ventas */}
          <h3 style={{ marginTop: 16 }}>Productos sin ventas</h3>
          {sinVentas.length === 0 ? (
            <p className="info">Todos los productos tienen al menos una venta.</p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {sinVentas.map((p) => (
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria || "—"}</td>
                    <td>{CLP(p.precio)}</td>
                    <td>{typeof p.stock === "number" ? p.stock : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
