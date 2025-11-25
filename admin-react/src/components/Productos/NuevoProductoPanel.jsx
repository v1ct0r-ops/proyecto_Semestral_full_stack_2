// src/components/Productos/NuevoProductoPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerProductos, productosAPI } from "../../services/apiService";

// ===== helpers =====
const calcularNivel = (p) => (p >= 500 ? "Oro" : p >= 200 ? "Plata" : "Bronce");
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
    : "—";

// ===== sesión y datos base =====
function useSessionData() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Verifica usuario y permisos antes de cargar productos
    if (!user) {
      return; // Esperar a que cargue el usuario
    }
    if (user.tipoUsuario !== "admin" && user.tipo !== "ADMIN") {
      alert("Acceso no permitido.");
      window.location.href = "/index.html";
      return;
    }
    // Cargar productos desde la API
    const cargarProductos = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);
      } catch (error) {
        // Si ocurre un error, dejar productos vacío
        setProductos([]);
      }
    };
    cargarProductos();
  }, [user]);

  // categorías: intenta obtener desde productos existentes
  const categorias = useMemo(() => {
    const derivadas = Array.from(
      new Set((Array.isArray(productos) ? productos : []).map((p) => p.categoria).filter(Boolean))
    );
    return derivadas.sort();
  }, [productos]);

  return { user, productos, categorias, setProductos };
}

// ===== Header =====
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

// ===== Menú lateral móvil =====
function SideMenu({ open, onClose, onOpenAccount, isAdmin }) {
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
          <a href="../cliente/index.html" onClick={onClose}>Inicio</a>
          <a href="../cliente/productos" onClick={onClose}>Productos</a>
          <a
            href="/"
            id="linkSalirMov"
            data-bind="1"
            onClick={(e) => {
              e.preventDefault();
              logout();
              onClose();
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

// ===== Panel Mi Cuenta =====
function AccountPanel({ user, open, onClose, logout }) {
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
              onClick={logout}
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

// ===== Página: Nuevo Producto =====
export default function NuevoProductoPanel() {
  const { user, logout } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Estado para los campos del formulario
  const [codigo, setCodigo] = useState(""); // Código del producto
  const [nombre, setNombre] = useState(""); // Nombre del producto
  const [descripcion, setDescripcion] = useState(""); // Descripción del producto
  const [detalles, setDetalles] = useState(""); // Detalles adicionales
  const [precio, setPrecio] = useState(""); // Precio
  const [stock, setStock] = useState(""); // Stock
  const [stockCritico, setStockCritico] = useState(""); // Stock crítico opcional
  const [categoria, setCategoria] = useState(""); // Categoría seleccionada
  const [imagen, setImagen] = useState(""); // URL de la imagen
  // Estado para errores y mensajes
  const [errCodigo, setErrCodigo] = useState("");
  const [errNombre, setErrNombre] = useState("");
  const [errPrecio, setErrPrecio] = useState("");
  const [errStock, setErrStock] = useState("");
  const [errCategoria, setErrCategoria] = useState("");
  const [msgOk, setMsgOk] = useState("");

  // Cargar datos cuando el usuario esté disponible
  // Cargar productos y categorías cuando el usuario esté disponible
  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.tipoUsuario !== "admin" && user.tipo !== "ADMIN") {
      alert("Acceso no permitido.");
      window.location.href = "/index.html";
      return;
    }
    // Cargar productos y categorías desde la API
    const cargarProductos = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);
        // Extraer categorías únicas
        const categoriasUnicas = [...new Set(productosData.map(p => p.categoria).filter(Boolean))];
        setCategorias(categoriasUnicas.sort());
      } catch (error) {
        setProductos([]);
        setCategorias([]);
      }
    };
    cargarProductos();
  }, [user]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  useEffect(() => {
    if (!categoria && categorias.length) {
      setCategoria(categorias[0]);
    }
  }, [categorias]); // eslint-disable-line

  if (!user) {
    // Si el usuario no está cargado, no renderizar nada
    return null;
  }
  // Verifica si el usuario es admin
  const isAdmin = user.tipoUsuario === "admin" || user.tipo === "ADMIN";

  // validar + guardar
  // Maneja el envío del formulario para crear un nuevo producto
  const onSubmit = async (e) => {
    e.preventDefault();

    let ok = true;
    setErrCodigo("");
    setErrNombre("");
    setErrPrecio("");
    setErrStock("");
    setErrCategoria("");

    const c = (codigo || "").trim();
    const n = (nombre || "").trim();
    const pr = parseFloat(precio);
    const st = parseInt(stock, 10);
    const sc = stockCritico ? parseInt(stockCritico, 10) : null;
    const cat = (categoria || "").trim();

    if (!c || c.length < 3) { setErrCodigo("Código mínimo 3 caracteres."); ok = false; }
    if (!n || n.length > 100) { setErrNombre("Nombre requerido (máx 100)."); ok = false; }
    if (isNaN(pr) || pr < 0) { setErrPrecio("Precio inválido (>= 0)."); ok = false; }
    if (isNaN(st) || st < 0 || !Number.isInteger(st)) { setErrStock("Stock entero >= 0."); ok = false; }
    if (!cat) { setErrCategoria("Selecciona una categoría."); ok = false; }

    // Verifica si ya existe un producto con el mismo código
    if (ok) {
      const existe = (Array.isArray(productos) ? productos : []).some(
        (p) => (p.codigo || "").toUpperCase() === c.toUpperCase()
      );
      if (existe) {
        setErrCodigo("Ya existe un producto con este código.");
        ok = false;
      }
    }

    if (!ok) return;

    const nuevo = {
      codigo: c,
      nombre: n,
      descripcion: (descripcion || "").trim(),
      detalles: (detalles || "").trim(),
      precio: pr,
      stock: st,
      stockCritico: sc ?? null,
      categoria: cat,
      imagen: (imagen || "").trim(),
    };

    // Guardar en el backend
    try {
      await productosAPI.create(nuevo);
      setMsgOk("Producto guardado correctamente.");
      // Actualizar la lista local
      const productosActualizados = [...productos, nuevo];
      setProductos(productosActualizados);
      setTimeout(() => {
        setMsgOk("");
        window.location.href = "/admin/productos";
      }, 1000);
    } catch (error) {
      alert("Error al guardar el producto: " + (error.message || "Error desconocido"));
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
        isAdmin={isAdmin}
      />

      <section className="admin">
        {/* Menú lateral (desktop) */}
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos" className="activo">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
          <a href="/admin/boleta">Boletas</a>
          <a href="/admin/reportes">Reportes</a>
        </aside>

        <div className="panel">
          <h1>Nuevo Producto</h1>

          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="fila">
              <label htmlFor="codigoProducto">Código</label>
              <input
                id="codigoProducto"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                minLength={3}
                required
              />
              {errCodigo && <div className="error">{errCodigo}</div>}
            </div>

            <div className="fila">
              <label htmlFor="nombreProducto">Nombre</label>
              <input
                id="nombreProducto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={100}
                required
              />
              {errNombre && <div className="error">{errNombre}</div>}
            </div>

            <div className="fila">
              <label htmlFor="descripcionProducto">Descripción</label>
              <textarea
                id="descripcionProducto"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="fila">
              <label htmlFor="detallesProducto">Detalles (opcional)</label>
              <textarea
                id="detallesProducto"
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                rows={4}
                placeholder="Origen, fabricante, distribuidor, certificaciones…"
              />
              <small className="pista">Se muestra en “Ver más” del detalle.</small>
            </div>

            <div className="fila dos">
              <div>
                <label htmlFor="precioProducto">Precio</label>
                <input
                  id="precioProducto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
                {errPrecio && <div className="error">{errPrecio}</div>}
                {precio && !isNaN(parseFloat(precio)) && (
                  <small className="pista">Vista previa: {CLP(parseFloat(precio))}</small>
                )}
              </div>
              <div>
                <label htmlFor="stockProducto">Stock</label>
                <input
                  id="stockProducto"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
                {errStock && <div className="error">{errStock}</div>}
              </div>
            </div>

            <div className="fila">
              <label htmlFor="stockCriticoProducto">Stock Crítico (opcional)</label>
              <input
                id="stockCriticoProducto"
                type="number"
                min="0"
                step="1"
                value={stockCritico}
                onChange={(e) => setStockCritico(e.target.value)}
              />
            </div>

            <div className="fila">
              <label htmlFor="categoriaProducto">Categoría</label>
              <select
                id="categoriaProducto"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                {categorias.length === 0 ? (
                  <option value="">—</option>
                ) : (
                  categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))
                )}
              </select>
              {errCategoria && <div className="error">{errCategoria}</div>}
            </div>

            <div className="fila">
              <label htmlFor="imagenProducto">Imagen (URL opcional)</label>
              <input
                id="imagenProducto"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="acciones" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn primario" type="submit">Guardar</button>
              <a className="btn secundario" href="/admin/productos">Volver</a>
            </div>

            {msgOk && <p id="msgProducto" className="exito" style={{ marginTop: 8 }}>{msgOk}</p>}
          </form>
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
      </footer>

      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} logout={logout} />
    </div>
  );
}
