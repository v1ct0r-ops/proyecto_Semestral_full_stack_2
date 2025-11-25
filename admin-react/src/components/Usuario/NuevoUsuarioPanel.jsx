// src/components/usuarios/NuevoUsuarioPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosAPI } from "../../services/apiService";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

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
      // Si ocurre un error durante logout, limpiamos el storage y redirigimos igual
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

  // Cierra sesión y redirige al usuario al home de cliente
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Si ocurre un error durante logout, limpiamos el storage
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

export default function NuevoUsuarioPanel() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    run: "",
    nombres: "",
    apellidos: "",
    correo: "",
    tipoUsuario: "cliente",
    direccion: "",
    password: "",
  });

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
      alert("Solo administradores pueden crear usuarios.");
      window.location.href = "/admin";
      return;
    }

    setIsAdmin(esAdmin);
  }, [isAuthenticated, user]);

  if (!user) return null;

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const payload = {
        run: form.run.trim(),
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        direccion: form.direccion.trim(),
        tipoUsuario: form.tipoUsuario.toUpperCase(), // CLIENTE / VENDEDOR / ADMIN
        password: form.password || null,
      };

      await usuariosAPI.create(payload);
      setMsg("Usuario guardado correctamente en backend.");
      setTimeout(() => {
        window.location.href = "/admin/usuarios";
      }, 600);
    } catch (err) {
      setMsg(
        "No se pudo crear el usuario. Revisa el backend (RUN/correo duplicado, etc.)."
      );
    }
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
          <h1>Nuevo Usuario</h1>
          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="fila">
              <label htmlFor="run">RUN</label>
              <input
                id="run"
                name="run"
                maxLength={9}
                required
                value={form.run}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="nombres">Nombres</label>
              <input
                id="nombres"
                name="nombres"
                maxLength={50}
                required
                value={form.nombres}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                name="apellidos"
                maxLength={100}
                required
                value={form.apellidos}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                name="correo"
                type="email"
                maxLength={100}
                required
                value={form.correo}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="tipoUsuario">Tipo de Usuario</label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                required
                value={form.tipoUsuario}
                onChange={onChange}
              >
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="fila">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                name="direccion"
                maxLength={300}
                required
                value={form.direccion}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                maxLength={100}
                required
                value={form.password}
                onChange={onChange}
              />
            </div>

            <button className="btn primario" type="submit">
              Guardar
            </button>
            {msg && (
              <p className="exito" style={{ marginTop: 8 }}>
                {msg}
              </p>
            )}
          </form>
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
