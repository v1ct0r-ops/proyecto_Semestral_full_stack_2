import React, { useState, useEffect, useMemo } from 'react';
// Importar Header desde SolicitudesPanel.jsx
// Componente Header local, igual que en otros paneles
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
import { useNavigate } from 'react-router-dom';
import { obtener, usuarioActual } from "../../utils/storage";

// Helper para formatear moneda
const CLP = (n) =>
  typeof n === "number"
    ? n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
    : "—";

const Boleta = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [boletas, setBoletas] = useState([]);
    const [productos, setProductos] = useState([]);

    // Cargar datos del localStorage
    useEffect(() => {
        const u = usuarioActual();
        if (!u) {
            alert("Acceso restringido.");
            window.location.href = "/index.html";
            return;
        }
        setUser(u);
        
        // Cargar pedidos y boletas existentes
        const pedidosData = obtener("pedidos", []);
        const boletasData = obtener("boletas", []);
        const productosData = obtener("productos", []);

        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
        setBoletas(Array.isArray(boletasData) ? boletasData : []);
        setProductos(Array.isArray(productosData) ? productosData : []);
    }, []);

    
    const boletasCompletas = useMemo(() => {
        return Array.isArray(boletas) ? boletas : [];
    }, [boletas]);

    const verDetallePedido = (boleta) => {
        const pedidoId = encodeURIComponent(String(boleta.pedidoId).replace(/^PED-?/i, ""));
        navigate(`/admin/pedidos/${pedidoId}`);
    };

    const verBoleta = (boleta) => {
        const numero = encodeURIComponent(boleta.numero);
        navigate(`/admin/boleta/${numero}`);
    };

        // Recalcula total aplicando descuentos (DUOC + puntos) si la boleta no tiene total
        const calcularTotalParaBoleta = (boleta) => {
                try {
                        // Buscar pedido relacionado
                        const pedido = Array.isArray(pedidos)
                                ? pedidos.find(p => String(p.id) === String(boleta.pedidoId))
                                : (Array.isArray(obtener('pedidos', [])) ? obtener('pedidos', []) : []).find(p => String(p.id) === String(boleta.pedidoId));

                        const items = (pedido?.items || []).map(it => {
                                const p = productos.find(x => x.codigo === it.codigo) || {};
                                return { ...it, precio: Number(it.precio ?? p.precio ?? 0) };
                        });

                        const subtotal = items.reduce((s, it) => s + (Number(it.precio || 0) * Number(it.cantidad || 1)), 0);

                        const VALOR_PUNTO = 10;
                        const TOPE_DESC_POR_PUNTOS = 0.20;

                        // Obtener correo comprador desde pedido
                        const comprador = pedido?.comprador || pedido?.usuario || pedido?.cliente || {};
                        const correo = (comprador?.correo || comprador?.email || "").toLowerCase();

                        let puntosComprador = 0;
                        try {
                                const usuarios = Array.isArray(obtener('usuarios', [])) ? obtener('usuarios', []) : [];
                                const u = usuarios.find(x => (x.correo || '').toLowerCase() === correo);
                                puntosComprador = u ? Number(u.puntosLevelUp || 0) : 0;
                        } catch { puntosComprador = 0; }

                        const aplicaDuoc = correo.endsWith('@duoc.cl');
                        const descuentoDuoc = aplicaDuoc ? Math.round(subtotal * 0.20) : 0;
                        const valorPuntosDisponibles = Math.max(0, puntosComprador * VALOR_PUNTO);
                        const maxPorPuntos = Math.round(subtotal * TOPE_DESC_POR_PUNTOS);
                        const descuentoPuntos = Math.min(valorPuntosDisponibles, maxPorPuntos);

                        const totalNum = Math.max(0, subtotal - descuentoDuoc - descuentoPuntos);
                        return { totalNum, subtotal, descuentoDuoc, descuentoPuntos };
                } catch (e) {
                        return null;
                }
        };

        const imprimirBoletaDesdeLista = (boleta) => {
                // Reconstruir info y utilizar ventana emergente similar a DetalleBoleta
                const pedido = Array.isArray(pedidos)
                        ? pedidos.find(p => String(p.id) === String(boleta.pedidoId))
                        : null;

                const items = (pedido?.items || []).map(it => {
                        const p = productos.find(x => x.codigo === it.codigo) || {};
                        return { ...it, nombre: p.nombre || it.codigo, precio: Number(it.precio ?? p.precio ?? 0) };
                });

                const calc = calcularTotalParaBoleta(boleta) || { totalNum: 0, subtotal: 0, descuentoDuoc: 0, descuentoPuntos: 0 };

                const rows = items.map(it => `
                        <tr>
                            <td>${it.nombre || '-'}</td>
                            <td><small>${it.codigo || '-'}</small></td>
                            <td style="text-align:right">${CLP(Number(it.precio || 0))}</td>
                            <td style="text-align:center">${Number(it.cantidad || 1)}</td>
                            <td style="text-align:right">${CLP(Number(it.precio || 0) * Number(it.cantidad || 1))}</td>
                        </tr>
                `).join('');

                        const totalToShow = calc.totalNum;
                        const fecha = boleta.fecha ? new Date(boleta.fecha).toLocaleString('es-CL') : '';

                        const html = `<!doctype html>
                        <html lang="es">
                        <head>
                            <meta charset="utf-8">
                            <title>Boleta ${boleta.numero}</title>
                            <style>
                                body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; padding:20px; }
                                h1{ margin:0 0 6px 0; font-size:20px; }
                                table{ width:100%; border-collapse:collapse; }
                                th, td{ padding:6px 0; border-bottom:1px solid #ddd; font-size:14px; }
                                tfoot td{ border-bottom:0; }
                                .enc{ display:flex; justify-content:space-between; align-items:center; gap:12px; }
                                .enc .icon{ font-size:28px; }
                                .small{ color:#555; font-size:12px; }
                            </style>
                        </head>
                        <body>
                            <div class="enc">
                                <div>
                                    <h1>Level-Up Gamer</h1>
                                    <div class="small">Boleta electrónica</div>
                                    <div class="small">Pedido: ${boleta.pedidoId || ''}</div>
                                    <div class="small">Fecha: ${fecha}</div>
                                    <div class="small">Cliente: ${boleta.cliente || ''}</div>
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
                                    ${rows}
                                </tbody>
                                <tfoot>
                                    <tr><td colspan="3" style="text-align:right"><strong>Total</strong></td><td style="text-align:right"><strong>${CLP(totalToShow)}</strong></td></tr>
                                </tfoot>
                            </table>
                            <script>window.onload = () => window.print();</script>
                        </body>
                        </html>`;

                const w = window.open('', '_blank', 'noopener');
                if (!w) { alert('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para continuar.'); return; }
                w.document.open(); w.document.write(html); w.document.close();
        };

    if (!user) return null;

    const isAdmin = user?.tipoUsuario === "admin";

    return (
        <div className="principal">
            {/* Barra superior */}
            <Header />
            <section className="admin">
                <aside className="menu-admin">
                    <a href="/admin">Inicio</a>
                    <a href="/admin/productos">Productos</a>
                    {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
                    <a href="/admin/pedidos">Pedidos</a>
                    <a href="/admin/solicitud">Solicitudes</a>
                    <a href="/admin/boleta" className="activo">Boletas</a>
                    <a href="/admin/reportes">Reportes</a>
                </aside>
                {/* Panel principal con contenido de boletas */}
                <div className="panel">
                    <h1>Boletas Emitidas</h1>
                    <div className="filtros" style={{ marginBottom: 12 }}>
                        <p className="info">
                            
                        </p>
                    </div>
                    {boletasCompletas && boletasCompletas.length > 0 ? (
                        <div id="listaBoletas" className="tarjetas">
                            {boletasCompletas.map((boleta, index) => (
                                <article key={boleta.numero || index} className="tarjeta" style={{ marginTop: 12 }}>
                                    <div className="contenido">
                                        <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                                            {boleta.numero}
                                        </h3>
                                        <p className="info" style={{ margin: "6px 0 10px" }}>
                                            <strong>Fecha:</strong> {boleta.fecha}
                                        </p>
                                        <p className="info" style={{ margin: "6px 0" }}>
                                            <strong>Cliente:</strong> {boleta.cliente}
                                        </p>
                                        <p className="info" style={{ margin: "6px 0" }}>
                                            <strong>Pedido:</strong> {boleta.pedidoId}
                                        </p>
                                        <p style={{ margin: "8px 0 12px" }}>
                                            <strong>Total:</strong> <span className="precio">{boleta.total}</span>
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
                            ))}
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
