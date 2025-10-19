import React, { useState, useEffect, useMemo } from 'react';
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

    // Generar boletas automáticamente para pedidos despachados sin boleta
    const boletasCompletas = useMemo(() => {
        if (!Array.isArray(pedidos) || !Array.isArray(boletas)) return boletas;

        const pedidosDespachados = pedidos.filter(p => p.estado === "despachado");
        const nuevasBoletas = [];

        pedidosDespachados.forEach(pedido => {
            // Verificar si ya existe una boleta para este pedido
            const boletaExistente = boletas.find(b => b.pedidoId === pedido.id);
            
            if (!boletaExistente) {
                // Obtener datos del cliente
                const comprador = pedido.comprador || pedido.usuario || pedido.cliente || {};
                const nombreCompleto = `${comprador.nombres || comprador.nombre || ""} ${comprador.apellidos || comprador.apellido || ""}`.trim();
                
                // Generar número de boleta único
                const timestamp = Date.now();
                const numeroBoleta = `BOL-${String(timestamp).slice(-6)}`;
                
                const nuevaBoleta = {
                    numero: numeroBoleta,
                    fecha: new Date().toISOString().split('T')[0],
                    cliente: nombreCompleto || "Cliente",
                    pedidoId: pedido.id,
                    total: CLP(pedido.total || 0),
                    totalNumerico: pedido.total || 0,
                    fechaCreacion: new Date().toISOString()
                };

                nuevasBoletas.push(nuevaBoleta);
            }
        });

        // Si hay nuevas boletas, guardarlas en localStorage
        if (nuevasBoletas.length > 0) {
            const todasLasBoletas = [...boletas, ...nuevasBoletas];
            localStorage.setItem("boletas", JSON.stringify(todasLasBoletas));
            setBoletas(todasLasBoletas);
            return todasLasBoletas;
        }

        return boletas;
    }, [pedidos, boletas]);

    const verDetallePedido = (boleta) => {
        const pedidoId = encodeURIComponent(String(boleta.pedidoId).replace(/^PED-?/i, ""));
        navigate(`/admin/pedidos/${pedidoId}`);
    };

    if (!user) return null;

    const isAdmin = user?.tipoUsuario === "admin";

    return (
        <div className="principal">
            {/* Usando la misma estructura que tus otros paneles */}
            <section className="admin">
                {/* Menú lateral igual al de otros paneles */}
                <aside className="menu-admin">
                    <a href="/admin">Inicio</a>
                    <a href="/admin/productos">Productos</a>
                    {isAdmin && <a href="/admin/usuarios">Usuarios</a>}
                    <a href="/admin/pedidos">Pedidos</a>
                    <a href="/admin/solicitud">Solicitud</a>
                    <a href="/admin/boleta" className="activo">Boletas</a>
                </aside>

                {/* Panel principal con contenido de boletas */}
                <div className="panel">
                    <h1>Boletas Emitidas</h1>
                    
                    <div className="filtros" style={{ marginBottom: 12 }}>
                        <p className="info">
                            Las boletas se generan automáticamente cuando los pedidos son marcados como "despachados"
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
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="tarjeta">
                            <div className="contenido">
                                <p className="info">No hay boletas emitidas.</p>
                                <p className="info">Las boletas se generan automáticamente cuando marcas pedidos como "despachados".</p>
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
