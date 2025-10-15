import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const PaginaPedidos = ({ onNavigate, onViewOrder }) => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    const cargarPedidos = () => {
      // Primero intentamos cargar desde localStorage
      const storedPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
      
      if (storedPedidos.length === 0) {
        // Si no hay pedidos almacenados, creamos algunos de ejemplo con items
        const mockPedidos = [
          {
            id: 'PED-001',
            fecha: '2025-01-15T10:30:00',
            estado: 'pendiente',
            comprador: {
              nombres: 'Juan',
              apellidos: 'Pérez',
              correo: 'juan.perez@duoc.cl'
            },
            envio: {
              direccion: 'Av. Siempre Viva 123',
              comuna: 'Santiago',
              region: 'Metropolitana'
            },
            items: [
              {
                codigo: 'PROD001',
                cantidad: 2,
                precio: 149999
              },
              {
                codigo: 'PROD002',
                cantidad: 1,
                precio: 299999
              }
            ],
            total: 599997
          },
          {
            id: 'PED-002',
            fecha: '2025-01-14T15:45:00',
            estado: 'despachado',
            comprador: {
              nombres: 'María',
              apellidos: 'González',
              correo: 'maria.gonzalez@duoc.cl'
            },
            envio: {
              direccion: 'Los Pinos 456',
              comuna: 'Valparaíso',
              region: 'Valparaíso'
            },
            items: [
              {
                codigo: 'PROD003',
                cantidad: 1,
                precio: 199999
              }
            ],
            total: 199999
          },
          {
            id: 'PED-003',
            fecha: '2025-01-13T09:15:00',
            estado: 'pendiente',
            comprador: {
              nombres: 'Carlos',
              apellidos: 'Silva',
              correo: 'carlos.silva@duoc.cl'
            },
            envio: {
              direccion: 'El Bosque 789',
              comuna: 'Concepción',
              region: 'Biobío'
            },
            items: [
              {
                codigo: 'PROD001',
                cantidad: 1,
                precio: 149999
              }
            ],
            total: 149999
          }
        ];
        
        // Guardamos los pedidos mock en localStorage
        localStorage.setItem("pedidos", JSON.stringify(mockPedidos));
        setPedidos(mockPedidos);
      } else {
        setPedidos(storedPedidos);
      }
    };

    cargarPedidos();
  }, []);

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (!filtroEstado) return true;
    return pedido.estado === filtroEstado;
  }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const getBadgeClass = (estado) => {
    switch(estado) {
      case 'pendiente': return 'btn peligro';
      case 'despachado': return 'btn exito';
      case 'cancelado': return 'btn secundario';
      default: return 'btn secundario';
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
        activeMenu="orders" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Pedidos</h1>
          <div className="filtros" style={{ marginBottom: '12px' }}>
            <select 
              id="filtroPedidos" 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="despachado">Despachados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>

          <div id="listaPedidos" className="tarjetas">
            {pedidosFiltrados.length === 0 ? (
              <p className="info">No hay pedidos para este filtro.</p>
            ) : (
              pedidosFiltrados.map(pedido => {
                const fecha = new Date(pedido.fecha).toLocaleString("es-CL");
                return (
                  <article key={pedido.id} className="tarjeta">
                    <div className="contenido">
                      <h4>{pedido.id}</h4>
                      <p className="info">
                        {fecha} · {pedido.comprador.nombres} {pedido.comprador.apellidos} ({pedido.comprador.correo})
                      </p>
                      <p>
                        <small>
                          Envío: {pedido.envio.direccion}, {pedido.envio.comuna}, {pedido.envio.region}
                        </small>
                      </p>
                      <p><strong>Total:</strong> {formatoPrecio(pedido.total)}</p>
                      <div>
                        <a 
                          className={getBadgeClass(pedido.estado)} 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onViewOrder && onViewOrder(pedido.id);
                          }}
                        >
                          {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                        </a>
                        {' '}
                        <button 
                          className="btn secundario" 
                          onClick={() => onViewOrder && onViewOrder(pedido.id)}
                        >
                          Ver detalle
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default PaginaPedidos;