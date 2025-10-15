import React, { useState } from 'react';
import SimpleLogin from './components/SimpleLogin';
import PanelAdmin from './components/PanelAdmin';
import PaginaProductos from './components/PaginaProductos';
import NuevoProducto from './components/NuevoProducto';
import EditarProducto from './components/EditarProducto';
import PaginaUsuarios from './components/PaginaUsuarios';
import NuevoUsuario from './components/NuevoUsuario';
import PaginaPedidos from './components/PaginaPedidos';
import DetallePedido from './components/DetallePedido';
import PaginaSolicitudes from './components/PaginaSolicitudes';
import DetalleSolicitud from './components/DetalleSolicitud';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'dashboard', 'products', 'newProduct', 'editProduct', 'users', 'newUser', 'orders', 'orderDetail', 'requests', 'requestDetail'
  const [editProductCode, setEditProductCode] = useState(null); // Para almacenar el código del producto a editar
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Para almacenar el ID del pedido a ver
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(null); // Para almacenar el índice de la solicitud a ver

  // Debug: vamos a ver qué está pasando
  console.log('🔍 App.jsx - Current view:', currentView);
  console.log('🔍 App.jsx - Renderizando...');

  // Función para navegar a editar producto con código específico
  const navigateToEditProduct = (productCode) => {
    setEditProductCode(productCode);
    setCurrentView('editProduct');
  };

  // Función para navegar a ver detalles de pedido
  const navigateToOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentView('orderDetail');
  };

  // Función para navegar a ver detalles de solicitud
  const navigateToRequestDetail = (requestIndex) => {
    setSelectedRequestIndex(requestIndex);
    setCurrentView('requestDetail');
  };

  if (currentView === 'login') {
    console.log('🔍 Renderizando Login');
    return <SimpleLogin onNavigate={setCurrentView} />;
  }

  if (currentView === 'dashboard') {
    console.log('🔍 Renderizando Dashboard');
    return <PanelAdmin onNavigate={setCurrentView} />;
  }

  if (currentView === 'products') {
    console.log('🔍 Renderizando Products');
    return <PaginaProductos onNavigate={setCurrentView} onEditProduct={navigateToEditProduct} />;
  }

  if (currentView === 'newProduct') {
    console.log('🔍 Renderizando New Product');
    return <NuevoProducto onNavigate={setCurrentView} />;
  }

  if (currentView === 'editProduct') {
    console.log('🔍 Renderizando Edit Product');
    return <EditarProducto onNavigate={setCurrentView} productCode={editProductCode} />;
  }

  if (currentView === 'users') {
    console.log('🔍 Renderizando Users');
    return <PaginaUsuarios onNavigate={setCurrentView} />;
  }

  if (currentView === 'newUser') {
    console.log('🔍 Renderizando New User');
    return <NuevoUsuario onNavigate={setCurrentView} />;
  }

  if (currentView === 'orders') {
    console.log('🔍 Renderizando Orders');
    return <PaginaPedidos onNavigate={setCurrentView} onViewOrder={navigateToOrderDetail} />;
  }

  if (currentView === 'orderDetail') {
    console.log('🔍 Renderizando Order Detail');
    return <DetallePedido onNavigate={setCurrentView} orderId={selectedOrderId} />;
  }

  if (currentView === 'requests') {
    console.log('🔍 Renderizando Requests');
    return <PaginaSolicitudes onNavigate={setCurrentView} onViewRequest={navigateToRequestDetail} />;
  }

  if (currentView === 'requestDetail') {
    console.log('🔍 Renderizando Request Detail');
    return <DetalleSolicitud onNavigate={setCurrentView} requestIndex={selectedRequestIndex} />;
  }

  console.log('🔍 Renderizando Home');

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        color: '#155724',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        🟢 React funcionando correctamente - Vista actual: <strong>{currentView}</strong>
      </div>
      
      <h1>🎮 Admin Level-Up Gamer - React</h1>
      <p>Migración completa del admin HTML/CSS/JS a React con diseño idéntico.</p>
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
        <h2>✅ Estado del sistema:</h2>
        <ul>
          <li>React funcionando</li>
          <li>Vite corriendo</li>
          <li>CSS original importado</li>
          <li>Componentes creados</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setCurrentView('login')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔐 Login Simple
        </button>

        <button 
          onClick={() => setCurrentView('dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📊 Dashboard Admin
        </button>

        <button 
          onClick={() => setCurrentView('products')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📦 Productos
        </button>

        <button 
          onClick={() => setCurrentView('users')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          👥 Usuarios
        </button>

        <button 
          onClick={() => setCurrentView('orders')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#fd7e14', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📋 Pedidos
        </button>

        <button 
          onClick={() => setCurrentView('requests')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#e83e8c', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📨 Solicitudes
        </button>

        <button 
          onClick={() => setCurrentView('home')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🏠 Volver al Home
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Credenciales de prueba:</strong><br/>
        Email: admin@duoc.cl<br/>
        Password: admin123<br/><br/>
        <strong>Funcionalidades implementadas:</strong><br/>
        ✅ Login con diseño original<br/>
        ✅ Dashboard con KPIs<br/>
        ✅ Panel de usuario<br/>
        ✅ Sidebar de navegación<br/>
        ✅ Roles (admin/vendedor)<br/>
        ✅ Página de productos<br/>
        ✅ Página de usuarios<br/>
        ✅ Página de pedidos<br/>
        ✅ Página de solicitudes
      </div>
    </div>
  );
}

export default App;
