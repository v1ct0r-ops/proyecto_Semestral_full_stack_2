// Componente Boleta: muestra las boletas emitidas y su información relacionada
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioActual } from "../../utils/storage";
import { boletasAPI, pedidosAPI } from "../../services/apiService";

// Header del panel de boletas
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

// Función para formatear moneda chilena
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      })
    : "—";

const Boleta = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapa de pedidos por id para mostrar el nombre del cliente
  const [pedidosMap, setPedidosMap] = useState({});

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // Estado para panel de cuenta (futuro)

  // Cargar usuario y boletas desde el backend
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

        const data = await boletasAPI.getAll();
        const lista = Array.isArray(data) ? data : [];
        setBoletas(lista);
        setLoading(false);
      } catch (err) {
  // Si ocurre un error al cargar la sesión o boletas, lo mostramos en consola para depuración
  // console.error("Error cargando sesión/boletas en Boleta.jsx:", err);
        setError(err.message || "Error cargando boletas");
        setLoading(false);
      }
    };

    load();
  }, []);

  // Cargar pedidos relacionados a las boletas (para obtener el nombre del cliente)
  useEffect(() => {
    const loadPedidosRelacionados = async () => {
      try {
        if (!Array.isArray(boletas) || boletas.length === 0) return;

  // Obtener IDs de pedido únicos presentes en las boletas
        const ids = Array.from(
          new Set(
            boletas
              .map((b) => b.pedidoId || b.pedido?.id || null)
              .filter(Boolean)
          )
        );

        if (ids.length === 0) return;

        const resultados = await Promise.all(
          ids.map((id) =>
            pedidosAPI
              .getById(id)
              .then((p) => p)
              .catch((err) => {
                // console.warn("No se pudo cargar pedido", id, err); // Solo para depuración
                return null;
              })
          )
        );

        const nuevoMapa = {};
        resultados.forEach((p) => {
          if (p && p.id != null) {
            nuevoMapa[p.id] = p;
          }
        });

        setPedidosMap(nuevoMapa);
      } catch (err) {
  // console.error("Error cargando pedidos relacionados a boletas:", err); // Solo para depuración
      }
    };

    loadPedidosRelacionados();
  }, [boletas]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  const boletasCompletas = useMemo(
    () => (Array.isArray(boletas) ? boletas : []),
    [boletas]
  );

  const verDetallePedido = (boleta) => {
    const pedidoIdRaw = boleta.pedidoId || boleta.pedido?.id || "";
    if (!pedidoIdRaw) return;
    const pedidoId = encodeURIComponent(String(pedidoIdRaw).replace(/^PED-?/i, ""));
    navigate(`/admin/pedidos/${pedidoId}`);
  };

  const verBoleta = (boleta) => {
    const numero = encodeURIComponent(boleta.numero);
    navigate(`/admin/boleta/${numero}`);
  };

  // Mientras se carga usuario inicial, no renderizamos nada
  if (!user && loading) return null;

  const tipo = (user?.tipoUsuario ?? user?.tipo ?? "")
    .toString()
    .trim()
    .toUpperCase();
  const isAdmin = tipo === "ADMIN";
  const canSeeBoletas = tipo === "ADMIN" || tipo === "VENDEDOR";

  return (
    <div className="principal">
      {/* Barra superior de navegación */}
      <Header
        isMenuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <section className="admin">
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

        {/* Panel principal con contenido de boletas */}
        <div className="panel">
          <h1>Boletas Emitidas</h1>

          {loading ? (
            <p className="info">Cargando boletas desde el backend...</p>
          ) : error ? (
            <div className="tarjeta">
              <div className="contenido">
                <p className="info" style={{ color: "#dc2626" }}>
                  Error: {error}
                </p>
                <p>
                  <small>
                    Verifica que el backend Spring Boot esté corriendo y el
                    endpoint de boletas esté disponible.
                  </small>
                </p>
              </div>
            </div>
          ) : boletasCompletas.length > 0 ? (
            <div id="listaBoletas" className="tarjetas">
              {boletasCompletas.map((boleta, index) => {
                // Obtenemos el pedido relacionado desde el mapa cargado aparte
                const pedidoRelacionado =
                  pedidosMap[boleta.pedidoId] ||
                  pedidosMap[boleta.pedido?.id] ||
                  null;

                // Intentar obtener el comprador desde el pedido si existe
                const comprador =
                  pedidoRelacionado?.usuario ||
                  pedidoRelacionado?.cliente ||
                  boleta.pedido?.usuario ||
                  boleta.pedido?.cliente ||
                  {};

                const nombreComprador = `${comprador.nombres || comprador.nombre || ""} ${
                  comprador.apellidos || comprador.apellido || ""
                }`.trim();

                // Si el backend no envía boleta.cliente, lo reconstruimos desde el pedidoRelacionado
                const nombreCliente =
                  boleta.cliente && boleta.cliente.trim() !== ""
                    ? boleta.cliente
                    : nombreComprador || "—";

                const totalNum =
                  typeof boleta.totalNumerico === "number"
                    ? boleta.totalNumerico
                    : boleta.total;

                return (
                  <article
                    key={boleta.id || boleta.numero || index}
                    className="tarjeta"
                    style={{ marginTop: 12 }}
                  >
                    <div className="contenido">
                      <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                        {boleta.numero}
                      </h3>
                      <p
                        className="info"
                        style={{ margin: "6px 0 10px" }}
                      >
                        <strong>Fecha:</strong>{" "}
                        {boleta.fecha || boleta.fechaEmision || "—"}
                      </p>
                      <p className="info" style={{ margin: "6px 0" }}>
                        <strong>Cliente:</strong> {nombreCliente}
                      </p>
                      <p className="info" style={{ margin: "6px 0" }}>
                        <strong>Pedido:</strong>{" "}
                        {boleta.pedidoId || boleta.pedido?.id || "—"}
                      </p>
                      <p style={{ margin: "8px 0 12px" }}>
                        <strong>Total:</strong>{" "}
                        <span className="precio">
                          {typeof totalNum === "number"
                            ? CLP(totalNum)
                            : totalNum || "—"}
                        </span>
                      </p>
                      <div className="acciones" style={{ gap: 8 }}>
                        <button
                          className="btn secundario"
                          onClick={() => verDetallePedido(boleta)}
                          style={{ cursor: "pointer" }}
                        >
                          Ver Pedido Relacionado
                        </button>
                        <button
                          className="btn primario"
                          onClick={() => verBoleta(boleta)}
                          style={{ cursor: "pointer" }}
                        >
                          Ver boleta
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="tarjeta">
              <div className="contenido">
                <p className="info">No hay boletas emitidas.</p>

                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn secundario"
                    onClick={() => navigate("/admin/pedidos")}
                  >
                    Ir a Pedidos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>
    </div>
  );
};

export default Boleta;
