// src/components/usuarios/EditarUsuarioPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usuariosAPI } from "../../services/apiService";

const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");

// ================== HEADER ==================
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

// ================== SIDE MENU ==================
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

// ================== ACCOUNT PANEL ==================
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

// ================== MAIN COMPONENT ==================
export default function EditarUsuarioPanel({ runParam }) {
  const { user, isAuthenticated } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editRun, setEditRun] = useState(runParam || "");

  // 🧠 Usuario completo que viene del backend
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  // Solo los campos que se editan en el formulario
  const [form, setForm] = useState({
    correo: "",
    tipoUsuario: "cliente",
    direccion: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [cargado, setCargado] = useState(false);

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
      alert("Solo administradores pueden editar usuarios.");
      window.location.href = "/admin";
      return;
    }
    setIsAdmin(esAdmin);

    // Obtener RUN desde la URL si no viene por props
    const runFromPath =
      runParam || (window?.location?.pathname?.split("/")?.pop() ?? "");
    setEditRun(runFromPath);

    const load = async () => {
      try {
        const encontrado = await usuariosAPI.getById(runFromPath);
        if (!encontrado) {
          alert("Usuario no encontrado.");
          window.location.href = "/admin/usuarios";
          return;
        }

        // Guardamos el usuario completo
        setUsuarioEdit(encontrado);

        // Pre-cargamos solo los campos que se pueden editar aquí
        setForm({
          correo: encontrado.correo || encontrado.email || "",
          tipoUsuario: (encontrado.tipoUsuario || "CLIENTE").toLowerCase(),
          direccion: encontrado.direccion || "",
          password: "",
        });

        setCargado(true);
      } catch (err) {
        alert("No se pudo cargar el usuario.");
        window.location.href = "/admin/usuarios";
      }
    };

    load();
  }, [runParam, isAuthenticated, user]);

  if (!user || !cargado || !usuarioEdit) return null;

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      // Armamos el payload con los datos editados
      const payload = {
        ...usuarioEdit, // trae run, nombres, apellidos, puntos, fechaRegistro, activo, etc.
        correo: form.correo.trim(),
        direccion: form.direccion.trim(),
        tipoUsuario: form.tipoUsuario.toUpperCase(), // ADMIN / VENDEDOR / CLIENTE
      };

      // Password: si el admin no escribe nada, dejamos la misma que venía del backend
      if (form.password && form.password.trim().length > 0) {
        payload.password = form.password.trim();
      }

      await usuariosAPI.update(editRun, payload);
      setMsg("Usuario actualizado correctamente.");

      setTimeout(() => {
        window.location.href = "/admin/usuarios";
      }, 800);
    } catch (err) {
      // Si ocurre un error al actualizar usuario, mostramos mensaje de error
      setMsg(
        "No se pudo actualizar el usuario. Revisa la consola y las validaciones del backend."
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
          <h1>Editar Usuario</h1>
          <p className="info">
            RUN: <strong>{editRun}</strong>
          </p>
          <p className="info">
            Nombre:{" "}
            <strong>
              {(usuarioEdit.nombres || "") + " " + (usuarioEdit.apellidos || "")}
            </strong>
          </p>

          <form className="formulario" onSubmit={onSubmit} noValidate>
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
              <label htmlFor="tipoUsuario">Rol</label>
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
                maxLength={200}
                value={form.direccion}
                onChange={onChange}
              />
            </div>

            <div className="fila">
              <label htmlFor="password">Nueva contraseña (opcional)</label>
              <input
                id="password"
                name="password"
                type="password"
                maxLength={255}
                value={form.password}
                onChange={onChange}
              />
            </div>

            <button className="btn primario" type="submit">
              Guardar cambios
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
