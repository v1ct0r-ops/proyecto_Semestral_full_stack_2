// src/components/usuarios/HistorialUsuarioPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosAPI, pedidosAPI } from "../../services/apiService";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// === UI comunes ===
function Header({ onOpenAccount, onToggleMenu, isMenuOpen }) {
  return (
    <header className="encabezado">
      <a className="logo" href="/admin">
        <img src="/img/LOGO.png" alt="Logo" className="logoBase" />
      </a>

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
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      onClose();
      window.location.href = "/cliente/";
    } catch (error) {
      localStorage.clear();
      onClose();
      window.location.href = "/cliente/";
    }
  };

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
            href="/cliente/index.html"
            id="linkSalirMov"
            data-bind="1"
            onClick={handleLogout}
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
  const { logout } = useAuth();
  const puntos = user?.puntosLevelUp ?? 0;
  const nivel = calcularNivel(puntos);
  const codigo = user?.codigoReferido || "";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      alert("¡Copiado!");
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      localStorage.clear();
    } finally {
      window.location.href = "/cliente/";
    }
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
            <strong>Correo:</strong> {user?.correo || user?.email || "—"}
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
              <button
                className="btn secundario"
                type="button"
                onClick={copyCode}
              >
                Copiar
              </button>
            </div>
            <small className="pista">
              Compartí este código para ganar puntos.
            </small>
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
              onClick={handleLogout}
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

// === Helpers de pedidos ===
function extraerClavesPedido(p) {
  // nuevo: considerar también p.usuario (relación típica ManyToOne en backend)
  const u = p?.usuario || {};
  const c = p?.comprador || {};

  return {
    run:
      p?.runUsuario ??
      p?.clienteRun ??
      p?.run ??
      p?.usuarioRun ??
      u.run ??
      c.run ??
      null,
    correo:
      p?.correoUsuario ??
      p?.email ??
      p?.correo ??
      u.correo ??
      c.correo ??
      null,
    usuarioId: p?.usuarioId ?? p?.userId ?? p?.idUsuario ?? u.id ?? null,
  };
}

const norm = (v) => (v ?? "").toString().trim().toLowerCase();

function perteneceAPersona(pedido, usuario) {
  const k = extraerClavesPedido(pedido);
  return (
    (k.run && norm(k.run) === norm(usuario?.run)) ||
    (k.correo && norm(k.correo) === norm(usuario?.correo)) ||
    (k.usuarioId && norm(k.usuarioId) === norm(usuario?.id))
  );
}

const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      })
    : "—";

function formatearFecha(fechaISO) {
  if (!fechaISO) return "—";
  const d = new Date(fechaISO);
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${dia}-${mes}-${anio} / ${horas}:${mins}`;
}

export default function HistorialUsuarioPanel({ runParam }) {
  const { user, isAuthenticated } = useAuth();
  const [run, setRun] = useState(runParam || "");
  const [usuarioData, setUsuarioData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      alert("Acceso restringido.");
      window.location.href = "/cliente/";
      return;
    }

    const esAdmin =
      user.tipo === "ADMIN" ||
      user.tipo === "admin" ||
      user.tipoUsuario === "ADMIN" ||
      user.tipoUsuario === "admin";

    if (!esAdmin) {
      alert("Solo administradores pueden ver el historial de usuarios.");
      window.location.href = "/admin";
      return;
    }

    setIsAdmin(esAdmin);

    const runFromPath =
      runParam || (window?.location?.pathname?.split("/")?.pop() ?? "");
    setRun(runFromPath);

    // Carga los datos del usuario y sus pedidos desde el backend
    const load = async () => {
      try {
        const uData = await usuariosAPI.getById(runFromPath);
        if (!uData) {
          setUsuarioData(null);
          setPedidos([]);
          return;
        }
        setUsuarioData(uData);

        const todosPedidos = await pedidosAPI.getAll();
        // Filtramos los pedidos que pertenecen al usuario
        const delUsuario = (Array.isArray(todosPedidos) ? todosPedidos : []).filter(
          (p) => perteneceAPersona(p, uData)
        );

        setPedidos(delUsuario);
      } catch (err) {
        // Si ocurre un error al cargar historial, dejamos los datos vacíos
        setUsuarioData(null);
        setPedidos([]);
      }
    };

    load();
  }, [runParam, isAuthenticated, user]);

  if (!user) return null;

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
          {isAdmin && (
            <a href="/admin/usuarios" className="activo">
              Usuarios
            </a>
          )}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>
        <div className="panel">
          <h1>Historial del usuario</h1>

          {!usuarioData ? (
            <p className="info">Usuario no encontrado (RUN: {run}).</p>
          ) : (
            <>
              <article className="tarjeta" style={{ marginBottom: 12 }}>
                <div className="contenido">
                  <h3>Datos</h3>
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {`${usuarioData.nombres || ""} ${
                      usuarioData.apellidos || ""
                    }`.trim()}
                  </p>
                  <p>
                    <strong>RUN:</strong> {usuarioData.run || "—"}
                  </p>
                  <p>
                    <strong>Correo:</strong>{" "}
                    {usuarioData.correo || usuarioData.email || "—"}
                  </p>
                  {usuarioData.direccion && (
                    <p>
                      <strong>Dirección:</strong> {usuarioData.direccion}
                    </p>
                  )}
                </div>
              </article>

              <h3>Compras realizadas</h3>
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
                  {Array.isArray(pedidos) && pedidos.length > 0 ? (
                    pedidos.map((p) => (
                      <tr
                        key={
                          p.id || p.codigo || `${p.fecha || p.creado}-${Math.random()}`
                        }
                      >
                        <td>{p.id || p.codigo || "—"}</td>
                        <td>{formatearFecha(p.fecha || p.fechaPedido || p.creado)}</td>
                        <td
                          style={{
                            color:
                              p.estado === "despachado"
                                ? "#44aa68ff"
                                : p.estado === "cancelado"
                                ? "#da4343ff"
                                : p.estado === "pendiente"
                                ? "#f19a16ff"
                                : "inherit",
                            fontWeight: "bold",
                          }}
                        >
                          {p.estado || "—"}
                        </td>
                        <td>{CLP(Number(p.total) || 0)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <p className="info" style={{ margin: 0 }}>
                          No hay compras para este usuario.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
}
