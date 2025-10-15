import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const PaginaUsuarios = ({ onNavigate }) => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Cargar usuarios desde localStorage
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Si no hay usuarios guardados, usar datos mock por defecto
    if (usuariosGuardados.length === 0) {
      const mockUsuarios = [
        { 
          run: '12.345.678-9', 
          nombres: 'Juan', 
          apellidos: 'Pérez', 
          correo: 'juan.perez@duoc.cl', 
          tipoUsuario: 'admin' 
        },
        { 
          run: '98.765.432-1', 
          nombres: 'María', 
          apellidos: 'González', 
          correo: 'maria.gonzalez@duoc.cl', 
          tipoUsuario: 'vendedor' 
        },
        { 
          run: '11.222.333-4', 
          nombres: 'Carlos', 
          apellidos: 'Silva', 
          correo: 'carlos.silva@duoc.cl', 
          tipoUsuario: 'cliente' 
        }
      ];
      localStorage.setItem("usuarios", JSON.stringify(mockUsuarios));
      setUsuarios(mockUsuarios);
    } else {
      setUsuarios(usuariosGuardados);
    }
  }, []);

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
        activeMenu="users" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Usuarios</h1>
          <div className="acciones">
            <button 
              className="btn primario" 
              onClick={() => onNavigate && onNavigate('newUser')}
            >
              Nuevo Usuario
            </button>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody id="tablaUsuarios">
              {usuarios.map((usuario, index) => (
                <tr key={usuario.run || index}>
                  <td>{usuario.run}</td>
                  <td>{usuario.nombres} {usuario.apellidos}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.tipoUsuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </div>
  );
};

export default PaginaUsuarios;