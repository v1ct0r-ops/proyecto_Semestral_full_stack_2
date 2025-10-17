import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const PaginaSolicitudes = ({ onNavigate, onViewRequest }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    const cargarSolicitudes = () => {
      // Primero intentamos cargar desde localStorage
      const storedSolicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
      
      if (storedSolicitudes.length === 0) {
        // Si no hay solicitudes almacenadas, creamos algunas de ejemplo
        const mockSolicitudes = [
          {
            id: 1,
            fecha: '2025-01-15',
            hora: '10:30',
            estado: 'pendiente',
            nombre: 'Juan Pérez',
            correo: 'juan.perez@duoc.cl',
            descripcion: 'Solicitud de información sobre productos gaming para PC'
          },
          {
            id: 2,
            fecha: '2025-01-14',
            hora: '15:45',
            estado: 'completado',
            nombre: 'María González',
            correo: 'maria.gonzalez@duoc.cl',
            descripcion: 'Consulta sobre disponibilidad de consolas PlayStation 5'
          },
          {
            id: 3,
            fecha: '2025-01-13',
            hora: '09:15',
            estado: 'pendiente',
            nombre: 'Carlos Silva',
            correo: 'carlos.silva@duoc.cl',
            descripcion: 'Problema con pedido realizado la semana pasada'
          }
        ];
        
        // Guardamos las solicitudes mock en localStorage
        localStorage.setItem("solicitudes", JSON.stringify(mockSolicitudes));
        setSolicitudes(mockSolicitudes);
      } else {
        setSolicitudes(storedSolicitudes);
      }
    };

    cargarSolicitudes();
  }, []);

  const solicitudesFiltradas = solicitudes.filter(solicitud => {
    if (!filtroEstado) return true;
    return solicitud.estado === filtroEstado;
  });

  const cambiarEstado = (index, nuevoEstado) => {
    const nuevasSolicitudes = [...solicitudes];
    nuevasSolicitudes[index] = {
      ...nuevasSolicitudes[index],
      estado: nuevoEstado
    };
    
    // Guardar en localStorage
    localStorage.setItem("solicitudes", JSON.stringify(nuevasSolicitudes));
    setSolicitudes(nuevasSolicitudes);
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
        case 'boletas':
          onNavigate('boletas');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="requests" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel-solicitud">
          <h1>Solicitudes</h1>
          <div className="filtros" style={{ marginBottom: '12px' }}>
            <select 
              id="filtroSolicitudes" 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <div id="listaSolicitud" className="tarjeta-solicitud tarjetas">
            {solicitudesFiltradas.length === 0 ? (
              <p className="info">No hay solicitudes para este filtro.</p>
            ) : (
              solicitudesFiltradas.map((solicitud, idx) => {
                const fechaCompleta = solicitud.fecha && solicitud.hora 
                  ? `${solicitud.fecha} ${solicitud.hora}` 
                  : (solicitud.fecha || "");
                
                return (
                  <article key={solicitud.id || idx} className="tarjeta">
                    <div className="contenido">
                      <h4>Solicitud {idx + 1}</h4>
                      <p className="info">{fechaCompleta}</p>
                      <p><strong>Nombre:</strong> {solicitud.nombre || "-"}</p>
                      <p><strong>Correo:</strong> {solicitud.correo || "-"}</p>
                      <p><strong>Descripción:</strong> {solicitud.descripcion || "-"}</p>
                      <div className="acciones" style={{ 
                        marginTop: '12px', 
                        display: 'flex', 
                        gap: '8px', 
                        flexWrap: 'wrap' 
                      }}>
                        <button 
                          className="btn secundario btn-estado"
                          onClick={() => {
                            const nuevoEstado = solicitud.estado === 'pendiente' ? 'completado' : 'pendiente';
                            cambiarEstado(idx, nuevoEstado);
                          }}
                        >
                          {solicitud.estado}
                        </button>
                        <button 
                          className="btn secundario"
                          onClick={() => onViewRequest && onViewRequest(idx)}
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

export default PaginaSolicitudes;