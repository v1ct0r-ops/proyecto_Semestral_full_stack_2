import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const DetalleSolicitud = ({ onNavigate, requestIndex }) => {
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestIndex !== null && requestIndex !== undefined) {
      cargarSolicitud(requestIndex);
    }
  }, [requestIndex]);

  const cargarSolicitud = (index) => {
    // Función del proyecto original para obtener solicitudes
    const obtenerSolicitudes = () => {
      const storedSolicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
      return storedSolicitudes;
    };

    const solicitudes = obtenerSolicitudes();
    const solicitudEncontrada = solicitudes[index];
    
    if (!solicitudEncontrada) {
      setSolicitud(null);
      setLoading(false);
      return;
    }

    setSolicitud(solicitudEncontrada);
    setLoading(false);
  };

  const cambiarEstado = () => {
    if (!solicitud) return;

    // Obtener solicitudes del localStorage
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    
    // Cambiar estado
    const nuevoEstado = solicitud.estado === "pendiente" ? "completado" : "pendiente";
    solicitudes[requestIndex].estado = nuevoEstado;
    
    // Guardar en localStorage
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));
    
    // Actualizar estado local
    setSolicitud(prev => ({ ...prev, estado: nuevoEstado }));
    
    alert(`Solicitud marcada como ${nuevoEstado}.`);
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
          onNavigate('orders');
          break;
        case 'requests':
          onNavigate('requests');
          break;
        case 'requestDetail':
          // No hacer nada, mantener en la misma página
          break;
        case 'boletas':
          onNavigate('boletas');
          break;
        default:
          break;
      }
    }
  };

  const handleVolver = () => {
    onNavigate('requests');
  };

  const getTextoBoton = () => {
    if (!solicitud) return "Cargar estado";
    
    return solicitud.estado === "pendiente" ? "Marcar como completado" : "Marcar como pendiente";
  };

  const getClaseBoton = () => {
    if (!solicitud) return "btn secundario";
    
    return solicitud.estado === "pendiente" ? "btn exito" : "btn secundario";
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
        <AdminLayout activeMenu="requests" onMenuChange={handleMenuChange}>
          <div className="panel">
            <h1>Cargando...</h1>
          </div>
        </AdminLayout>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
        <AdminLayout activeMenu="requests" onMenuChange={handleMenuChange}>
          <div className="panel">
            <h1>Solicitud</h1>
            <p className="info">Solicitud no encontrada.</p>
            <button 
              className="btn secundario" 
              onClick={handleVolver}
            >
              Volver a Solicitudes
            </button>
          </div>
        </AdminLayout>
      </div>
    );
  }

  const fecha = solicitud.fecha && solicitud.hora 
    ? `${solicitud.fecha} ${solicitud.hora}` 
    : (solicitud.fecha || "");

  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <AdminLayout 
        activeMenu="requests" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1 id="tituloSolicitud">
            Solicitud #{requestIndex + 1}
          </h1>
          
          <div id="detalleSolicitud">
            <article className="tarjeta">
              <div className="contenido">
                <h4>Solicitud #{requestIndex + 1}</h4>
                <p className="info">{fecha}</p>
                <p><strong>Nombre:</strong> {solicitud.nombre || "-"}</p>
                <p><strong>Correo:</strong> {solicitud.correo || "-"}</p>
                <p><strong>Descripción:</strong> {solicitud.descripcion || "-"}</p>
                <p><strong>Estado:</strong> {solicitud.estado || "-"}</p>
              </div>
            </article>
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={getClaseBoton()}
              onClick={cambiarEstado}
            >
              {getTextoBoton()}
            </button>
            <button 
              className="btn secundario" 
              onClick={handleVolver}
            >
              Volver a Solicitudes
            </button>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default DetalleSolicitud;