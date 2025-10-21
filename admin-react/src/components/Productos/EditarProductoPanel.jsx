// src/components/Productos/EditarProductoPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { obtener, guardar, usuarioActual } from "../../utils/storage";

// === Helpers / formato
const norm = (s) => String(s || "").trim();
const toNum = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));

// === Header + SideMenu + AccountPanel (compactos – mismo look & feel)
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

function SideMenu({ open, onClose, isAdmin }) {
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
  const codigoRef = user?.codigoReferido || "";

  if (!open) return null;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codigoRef);
      alert("¡Copiado!");
    } catch {}
  };

  return (
    <>
      <aside
        id="panelCuenta"
        className="panel-cuenta panel-cuenta--abierto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panelCuentaTitulo"
      >
        <div className="panel-cuenta__cab">
          <h3 id="panelCuentaTitulo">Mi cuenta</h3>
          <button id="btnCerrarCuenta" className="panel-cuenta__cerrar" aria-label="Cerrar" onClick={onClose}>
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
              <input readOnly value={codigoRef} />
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

// === Página principal: Editar Producto
export default function EditarProductoPanel() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // seguridad básica
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // form state
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [detalles, setDetalles] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockCritico, setStockCritico] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");

  // errores & msg
  const [errNombre, setErrNombre] = useState("");
  const [errPrecio, setErrPrecio] = useState("");
  const [errStock, setErrStock] = useState("");
  const [errCategoria, setErrCategoria] = useState("");
  const [msg, setMsg] = useState("");

  // obtener código desde params o query (?codigo=)
  const codigoRuta = useMemo(() => {
    const cParam = params?.codigo;
    if (cParam) return decodeURIComponent(cParam);
    const q = new URLSearchParams(location.search).get("codigo");
    return q ? decodeURIComponent(q) : "";
  }, [params, location.search]);

  // categorías sugeridas (desde productos existentes)
  const categorias = useMemo(() => {
    const prods = Array.isArray(obtener("productos", [])) ? obtener("productos", []) : [];
    const set = new Set(prods.map((p) => p.categoria).filter(Boolean));
    return Array.from(set);
  }, []);

  // cargar sesión + producto
  useEffect(() => {
    const u = usuarioActual();
    if (!u) {
      alert("Acceso restringido.");
      window.location.href = "/index.html";
      return;
    }
    setUser(u);

    const productos = Array.isArray(obtener("productos", [])) ? obtener("productos", []) : [];
    const prod = productos.find((x) => String(x.codigo) === String(codigoRuta));
    if (!prod) {
      alert("Producto no encontrado.");
      navigate("/admin/productos", { replace: true });
      return;
    }

    setCodigo(prod.codigo || "");
    setNombre(prod.nombre || "");
    setDescripcion(prod.descripcion || "");
    setDetalles(prod.detalles || "");
    setPrecio(prod.precio ?? "");
    setStock(prod.stock ?? "");
    setStockCritico(prod.stockCritico ?? "");
    setCategoria(prod.categoria || "");
    setImagen(prod.imagen || "");
  }, [codigoRuta, navigate]);

  useEffect(() => {
    document.body.classList.toggle("menu-abierto", menuOpen);
    return () => document.body.classList.remove("menu-abierto");
  }, [menuOpen]);

  if (!user) return null;
  const isAdmin = user.tipoUsuario === "admin";

  const validar = () => {
    let ok = true;
    setErrNombre("");
    setErrPrecio("");
    setErrStock("");
    setErrCategoria("");
    setMsg("");

    if (!norm(nombre)) {
      setErrNombre("El nombre es obligatorio.");
      ok = false;
    }
    const nPrecio = toNum(precio);
    if (!Number.isFinite(nPrecio) || nPrecio < 0) {
      setErrPrecio("Precio inválido.");
      ok = false;
    }
    const nStock = Math.floor(toNum(stock));
    if (!Number.isFinite(nStock) || nStock < 0) {
      setErrStock("Stock inválido.");
      ok = false;
    }
    if (!norm(categoria)) {
      setErrCategoria("Seleccioná una categoría.");
      ok = false;
    }
    return ok;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const productos = Array.isArray(obtener("productos", [])) ? obtener("productos", []) : [];
    const idx = productos.findIndex((p) => String(p.codigo) === String(codigo));
    if (idx === -1) {
      alert("No se pudo actualizar: producto no encontrado.");
      return;
    }

    productos[idx] = {
      ...productos[idx],
      nombre: norm(nombre),
      descripcion: norm(descripcion),
      detalles: norm(detalles),
      precio: Number(precio),
      stock: Number(stock),
      stockCritico: stockCritico === "" ? undefined : Number(stockCritico),
      categoria: norm(categoria),
      imagen: norm(imagen),
    };

    guardar("productos", productos);
    setMsg("Cambios guardados correctamente.");
  };

  return (
    <div className="principal">
      <Header
        isMenuOpen={menuOpen}
        onOpenAccount={() => setAccountOpen(true)}
        onToggleMenu={() => setMenuOpen((v) => !v)}
      />

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} isAdmin={isAdmin} />

      <section className="admin">
        {/* Menú lateral (desktop) */}
        <aside className="menu-admin">
          <a href="/admin">Inicio</a>
          <a href="/admin/productos" className="activo">Productos</a>
          {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
          <a href="/admin/pedidos">Pedidos</a>
          <a href="/admin/solicitud">Solicitudes</a>
        </aside>

        {/* Panel principal */}
        <div className="panel">
          <h1>Editar Producto</h1>

          <form className="formulario" onSubmit={onSubmit} noValidate>
            <div className="fila">
              <label htmlFor="e_codigoProducto">Código</label>
              <input id="e_codigoProducto" value={codigo} readOnly />
              <small className="pista">El código no puede modificarse.</small>
            </div>

            <div className="fila">
              <label htmlFor="e_nombreProducto">Nombre</label>
              <input
                id="e_nombreProducto"
                value={nombre}
                maxLength={100}
                required
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="error">{errNombre}</div>
            </div>

            <div className="fila">
              <label htmlFor="e_descripcionProducto">Descripción</label>
              <textarea
                id="e_descripcionProducto"
                rows={3}
                maxLength={500}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="fila">
              <label htmlFor="e_detallesProducto">Detalles (opcional)</label>
              <textarea
                id="e_detallesProducto"
                rows={4}
                placeholder="Origen, fabricante, distribuidor, certificaciones…"
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
              />
              <small className="pista">Se muestra en “Ver más” del detalle.</small>
            </div>

            <div className="fila dos">
              <div>
                <label htmlFor="e_precioProducto">Precio</label>
                <input
                  id="e_precioProducto"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
                <div className="error">{errPrecio}</div>
              </div>
              <div>
                <label htmlFor="e_stockProducto">Stock</label>
                <input
                  id="e_stockProducto"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                <div className="error">{errStock}</div>
              </div>
            </div>

            <div className="fila">
              <label htmlFor="e_stockCriticoProducto">Stock Crítico (opcional)</label>
              <input
                id="e_stockCriticoProducto"
                type="number"
                min="0"
                step="1"
                value={stockCritico}
                onChange={(e) => setStockCritico(e.target.value)}
              />
            </div>

            <div className="fila">
              <label htmlFor="e_categoriaProducto">Categoría</label>
              <select
                id="e_categoriaProducto"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="error">{errCategoria}</div>
            </div>

            <div className="fila">
              <label htmlFor="e_imagenProducto">Imagen (URL)</label>
              <input
                id="e_imagenProducto"
                placeholder="https://..."
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
              />
            </div>

            <div className="acciones" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn primario" type="submit">Guardar cambios</button>
              <a className="btn secundario" href="/admin/productos">Volver</a>
            </div>

            {msg && <p id="msgEditarProducto" className="exito" style={{ marginTop: 8 }}>{msg}</p>}
          </form>
        </div>
      </section>

      <footer className="pie">
        <p>© 2025 Level-Up Gamer — Chile</p>
        <p className="pie-links">
          <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a> ·{" "}
          <a href="https://x.com" target="_blank" rel="noopener">X</a> ·{" "}
          <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
        </p>
      </footer>

      <AccountPanel user={user} open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
