import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const PanelAdmin = ({ onNavigate }) => {
  const [kpis, setKpis] = useState({
    productos: 10,
    usuarios: 3,
    pedidosPendientes: 2
  });

  useEffect(() => {
    // Configurar estilos de body para admin
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Por ahora datos mock hasta integrar con localStorage
    setKpis({
      productos: 10,
      usuarios: 3,
      pedidosPendientes: 2
    });

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  // Por ahora, mock de usuario hasta integrar servicios
  const esVendedor = false;

  const handleMenuChange = (menuId) => {
    if (onNavigate) {
      switch(menuId) {
        case 'dashboard':
          onNavigate('dashboard');
          break;
        case 'products':
          onNavigate('products');
          break;
        case 'newProduct':
          onNavigate('newProduct');
          break;
        case 'editProduct':
          onNavigate('editProduct');
          break;
        case 'users':
          onNavigate('users');
          break;
        case 'newUser':
          onNavigate('newUser');
          break;
        case 'orders':
          onNavigate('orders');
          break;
        case 'requests':
          onNavigate('requests');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="dashboard" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Panel</h1>
          <p>Accedé a la gestión según tu rol.</p>

          {/* KPIs idénticos al HTML original */}
          <div className="admin-kpis">
            <div className="kpi">
              <span id="kpiProductos">{kpis.productos}</span>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Productos</p>
            </div>

            {!esVendedor && (
              <div className="kpi">
                <span id="kpiUsuarios">{kpis.usuarios}</span>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Usuarios</p>
              </div>
            )}

            <div className="kpi">
              <span id="kpiPedidos">{kpis.pedidosPendientes}</span>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Pedidos pendientes</p>
            </div>
          </div>

          {/* Accesos rápidos idénticos al HTML original */}
          <h3>Accesos rápidos</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn secundario"
              onClick={() => onNavigate && onNavigate('products')}
              style={{ padding: '10px 16px' }}
            >
              Ver productos
            </button>
            <button 
              className="btn secundario"
              onClick={() => onNavigate && onNavigate('orders')}
              style={{ padding: '10px 16px' }}
            >
              Ver pedidos
            </button>
            {!esVendedor && (
              <>
                <button 
                  className="btn primario"
                  onClick={() => onNavigate && onNavigate('newProduct')}
                  style={{ padding: '10px 16px' }}
                >
                  Nuevo producto
                </button>
                <button 
                  className="btn primario"
                  onClick={() => onNavigate && onNavigate('users')}
                  style={{ padding: '10px 16px' }}
                >
                  Gestionar usuarios
                </button>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default PanelAdmin;