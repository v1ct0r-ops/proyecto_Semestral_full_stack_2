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
        
        setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
        setBoletas(Array.isArray(boletasData) ? boletasData : []);
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
