import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StorageService } from '../services/storageService';

const Dashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState({
    productos: 0,
    usuarios: 0,
    pedidosPendientes: 0
  });

  useEffect(() => {
    // Calcular KPIs igual que en el JavaScript original
    const productos = StorageService.obtener("productos", []);
    const usuarios = StorageService.obtener("usuarios", []);
    const pedidos = StorageService.obtenerPedidos();
    const pedidosPendientes = pedidos.filter(p => p.estado === "pendiente");

    setKpis({
      productos: productos.length,
      usuarios: usuarios.length,
      pedidosPendientes: pedidosPendientes.length
    });
  }, []);

  const isVendedor = user?.rol === 'vendedor';

  return (
    <div className="panel">
      <h1 id="tituloPanel">Panel</h1>
      <p id="descPanel" className="info">Accedé a la gestión según tu rol.</p>

      <div className="tarjetas admin-kpis" style={{marginTop: '12px'}}>
        <div className="kpi">
          <span id="kpiProductos">{kpis.productos}</span>
          <small>Productos</small>
        </div>
        
        {!isVendedor && (
          <div className="kpi" id="kpiUsuariosBox">
            <span id="kpiUsuarios">{kpis.usuarios}</span>
            <small>Usuarios</small>
          </div>
        )}
        
        <div className="kpi" id="kpiPedidosBox">
          <span id="kpiPedidos">{kpis.pedidosPendientes}</span>
          <small>Pedidos pendientes</small>
        </div>
      </div>

      <article className="tarjeta" style={{marginTop: '16px'}}>
        <div className="contenido">
          <h3>Accesos rápidos</h3>
          <div className="acciones" style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
            <Link className="btn secundario" to="/admin/productos">Ver productos</Link>
            <Link className="btn secundario" to="/admin/pedidos">Ver pedidos</Link>
            
            {!isVendedor && (
              <>
                <Link className="btn primario solo-admin" to="/admin/productos/nuevo">Nuevo producto</Link>
                <Link className="btn primario solo-admin" to="/admin/usuarios">Gestionar usuarios</Link>
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default Dashboard;