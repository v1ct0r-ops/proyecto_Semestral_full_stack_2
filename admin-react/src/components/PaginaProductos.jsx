import React, { useState, useEffect } from 'react';
import AdminLayout from './Layout/AdminLayout';

const PaginaProductos = ({ onNavigate, onEditProduct }) => {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const cargarProductos = () => {
    // Cargar productos desde localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos") || "[]");
    setProductos(productosGuardados);
  };

  useEffect(() => {
    // Cargar productos desde localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos") || "[]");
    
    // Si no hay productos guardados, usar datos mock por defecto
    if (productosGuardados.length === 0) {
      const mockProductos = [
        { codigo: 'PS001', nombre: 'PlayStation 5', categoria: 'Consolas', precio: 599999, stock: 5 },
        { codigo: 'XB002', nombre: 'Xbox Series X', categoria: 'Consolas', precio: 549999, stock: 3 },
        { codigo: 'SW003', nombre: 'Nintendo Switch', categoria: 'Consolas', precio: 299999, stock: 8 }
      ];
      localStorage.setItem("productos", JSON.stringify(mockProductos));
      setProductos(mockProductos);
    } else {
      setProductos(productosGuardados);
    }
    
    setUsuario({ tipoUsuario: 'admin' }); // Mock user
  }, []);

  // Recargar productos cuando se vuelve a esta página
  useEffect(() => {
    cargarProductos();
  }, [onNavigate]);

  const esAdmin = usuario && usuario.tipoUsuario === "admin";

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
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
        activeMenu="products" 
        onMenuChange={handleMenuChange}
      >
        <div className="panel">
          <h1>Productos</h1>
          <div className="acciones">
            {esAdmin && (
              <button 
                className="btn primario solo-admin" 
                onClick={() => onNavigate && onNavigate('newProduct')}
              >
                Nuevo Producto
              </button>
            )}
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                {esAdmin && <th id="thAcciones">Acciones</th>}
              </tr>
            </thead>
            <tbody id="tablaProductos">
              {productos.map(producto => (
                <tr key={producto.codigo}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{formatoPrecio(producto.precio)}</td>
                  <td>{producto.stock ?? "—"}</td>
                  {esAdmin && (
                    <td>
                      <button 
                        className="btn secundario" 
                        onClick={() => onEditProduct && onEditProduct(producto.codigo)}
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
    </div>
  );
};

export default PaginaProductos;