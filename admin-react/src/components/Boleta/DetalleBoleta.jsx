import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ===== Hook de sesión =====
function useSessionData() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [boletas, setBoletas] = useState([]);
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
    setBoletas(Array.isArray(obtener("boletas", [])) ? obtener("boletas", []) : []);
    setProductos(Array.isArray(obtener("productos", [])) ? obtener("productos", []) : []);
  }, []);

  return { user, pedidos, boletas, productos };
}

// ===== Components Header/SideMenu/AccountPanel =====
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

const DetalleBoleta = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  const { user, pedidos, boletas, productos } = useSessionData();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Buscar la boleta y el pedido relacionado
  const boleta = useMemo(() => {
    if (!Array.isArray(boletas) || !numero) return null;
    return boletas.find(b => b.numero === decodeURIComponent(numero));
  }, [boletas, numero]);

  const pedido = useMemo(() => {
    if (!boleta || !Array.isArray(pedidos)) return null;
    return pedidos.find(p => p.id === boleta.pedidoId);
  }, [boleta, pedidos]);

  // Items del pedido enriquecidos con información del producto
  const items = useMemo(() => {
    if (!pedido || !Array.isArray(productos)) return [];
    return (pedido.items || []).map(item => {
      const producto = productos.find(p => p.codigo === item.codigo);
      return {
        ...item,
        nombre: producto?.nombre || item.codigo || "Producto no encontrado"
      };
    });
  }, [pedido, productos]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  if (!user) return null;

  const isAdmin = user?.tipoUsuario === "admin";

  // Datos del cliente para mostrar en la boleta
  const comprador = pedido?.comprador || pedido?.usuario || pedido?.cliente || {};
  const nombreCompleto = `${comprador.nombres || comprador.nombre || ""} ${comprador.apellidos || comprador.apellido || ""}`.trim();
  const correo = comprador.correo || comprador.email || "—";

  const imprimirBoleta = () => {
    window.print();
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
          <a href="/admin/boleta" className="activo">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        {/* Panel principal */}
        <div className="panel">
          <h1>Detalle de Boleta</h1>

          {!boleta ? (
            <div className="tarjeta">
              <div className="contenido">
                <p className="info">Boleta no encontrada.</p>
                <div className="acciones" style={{ marginTop: 8 }}>
                  <button className="btn secundario" onClick={() => navigate("/admin/boleta")}>
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
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
                    <div>
                      <p><strong>Fecha de Emisión:</strong></p>
                      <p>{boleta.fecha}</p>
                    </div>
                    <div>
                      <p><strong>Cliente:</strong></p>
                      <p>{boleta.cliente}</p>
                      {correo !== "—" && <p><small>{correo}</small></p>}
                    </div>
                    <div>
                      <p><strong>Pedido Relacionado:</strong></p>
                      <p>{boleta.pedidoId}</p>
                    </div>
                    <div>
                      <p><strong>Total:</strong></p>
                      <p style={{ fontSize: "1.2em", color: "var(--verde)" }}>{boleta.total}</p>
                    </div>
                  </div>

                  {/* Acciones */}
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
                          const pedidoId = encodeURIComponent(String(pedido.id).replace(/^PED-?/i, ""));
                          navigate(`/admin/pedidos/${pedidoId}`);
                        }}
                      >
                        Ver Pedido
                      </button>
                    )}
                    <button 
                      className="btn exito" 
                      onClick={imprimirBoleta}
                    >
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
                              <td><small>{item.codigo}</small></td>
                              <td>{CLP(item.precio || 0)}</td>
                              <td>{item.cantidad || 1}</td>
                              <td>{CLP((item.precio || 0) * (item.cantidad || 1))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: "2px solid var(--borde)", fontWeight: "bold" }}>
                            <td colSpan="4">TOTAL</td>
                            <td style={{ color: "var(--verde)" }}>{boleta.total}</td>
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

      {/* Panel de cuenta + cortina */}
      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
};

export default DetalleBoleta;