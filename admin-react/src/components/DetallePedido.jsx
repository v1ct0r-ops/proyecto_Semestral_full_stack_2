import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const DetallePedido = ({ onNavigate, orderId }) => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      cargarPedido(orderId);
    }
  }, [orderId]);

  const cargarPedido = (id) => {
    // Función del proyecto original para obtener pedidos
    const obtenerPedidos = () => {
      const storedPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
      return storedPedidos;
    };

    const pedidos = obtenerPedidos();
    const pedidoEncontrado = pedidos.find(p => p.id === id);
    
    if (!pedidoEncontrado) {
      setPedido(null);
      setLoading(false);
      return;
    }

    setPedido(pedidoEncontrado);
    setLoading(false);
  };

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const marcarComoDespachado = () => {
    if (!pedido || pedido.estado !== "pendiente") return;

    // Actualizar estado del pedido
    const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    const pedidoIndex = pedidos.findIndex(p => p.id === pedido.id);
    
    if (pedidoIndex !== -1) {
      pedidos[pedidoIndex].estado = "despachado";
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      
      // Actualizar estado local
      setPedido(prev => ({ ...prev, estado: "despachado" }));
      
      alert("Pedido marcado como despachado.");
    }
  };

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
        case 'orderDetail':
          // No hacer nada, mantener en la misma página
          break;
        case 'requests':
          onNavigate('requests');
          break;
        default:
          break;
      }
    }
  };

  const handleVolver = () => {
    onNavigate('orders');
  };

  const getBotonEstado = () => {
    if (!pedido) return null;

    if (pedido.estado === "pendiente") {
      return (
        <button 
          className="btn exito"
          onClick={marcarComoDespachado}
        >
          Marcar como despachado
        </button>
      );
    } else if (pedido.estado === "despachado") {
      return (
        <button 
          className="btn secundario"
          disabled
        >
          Pedido despachado
        </button>
      );
    } else { // cancelado
      return (
        <button 
          className="btn secundario"
          disabled
        >
          Pedido cancelado
        </button>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
        <AdminLayout activeMenu="orders" onMenuChange={handleMenuChange}>
          <div className="panel">
            <h1>Cargando...</h1>
          </div>
        </AdminLayout>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
        <AdminLayout activeMenu="orders" onMenuChange={handleMenuChange}>
          <div className="panel">
            <h1>Pedido</h1>
            <p className="info">Pedido no encontrado.</p>
            <button 
              className="btn secundario" 
              onClick={handleVolver}
            >
              Volver a Pedidos
            </button>
          </div>
        </AdminLayout>
      </div>
    );
  }

  // Obtener productos para mostrar nombres completos
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="orders" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1 id="tituloPedido">
            Pedido {pedido.id} — {pedido.estado.toUpperCase()}
          </h1>
          
          <div id="detallePedido">
            <article className="tarjeta">
              <div className="contenido">
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString("es-CL")}</p>
                <p><strong>Cliente:</strong> {pedido.comprador.nombres} {pedido.comprador.apellidos} — {pedido.comprador.correo}</p>
                <p><strong>Envío:</strong> {pedido.envio.direccion}, {pedido.envio.comuna}, {pedido.envio.region}</p>
                <p><strong>Total:</strong> {formatoPrecio(pedido.total)}</p>
                
                <h4>Ítems</h4>
                {pedido.items.map((item, index) => {
                  const producto = productos.find(p => p.codigo === item.codigo);
                  const nombre = producto ? producto.nombre : item.codigo;
                  
                  return (
                    <div key={index} className="item-carrito">
                      <div>
                        <strong>{nombre}</strong><br />
                        <small>{item.codigo}</small>
                      </div>
                      <div>{formatoPrecio(item.precio)}</div>
                      <div>x{item.cantidad}</div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {getBotonEstado()}
            <button 
              className="btn secundario" 
              onClick={handleVolver}
            >
              Volver a Pedidos
            </button>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default DetallePedido;