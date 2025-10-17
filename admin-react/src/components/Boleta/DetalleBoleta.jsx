import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { obtenerProductosDeBoletaPorPedido } from '../../services/storageService';
import '../../styles/admin.css';

const DetalleBoleta = ({ boleta, onNavigate }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ASEGURAR que los datos base estén disponibles
        const productos = JSON.parse(localStorage.getItem("productos") || "[]");
        const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
        
        if (boleta && boleta.pedidoId) {
            // Si no hay datos, crearlos directamente aquí como fallback
            if (productos.length === 0) {
                const mockProductos = [
                    { codigo: 'PS001', nombre: 'PlayStation 5', categoria: 'Consolas', precio: 599999, stock: 5 },
                    { codigo: 'XB002', nombre: 'Xbox Series X', categoria: 'Consolas', precio: 549999, stock: 3 },
                    { codigo: 'SW003', nombre: 'Nintendo Switch', categoria: 'Consolas', precio: 299999, stock: 8 }
                ];
                localStorage.setItem("productos", JSON.stringify(mockProductos));
            }
            
            if (pedidos.length === 0) {
                const mockPedidos = [
                    {
                        id: 'PED-001',
                        items: [{ codigo: 'PS001', cantidad: 1, precio: 599999 }]
                    },
                    {
                        id: 'PED-002', 
                        items: [{ codigo: 'XB002', cantidad: 1, precio: 549999 }]
                    },
                    {
                        id: 'PED-003',
                        items: [{ codigo: 'SW003', cantidad: 1, precio: 299999 }]
                    }
                ];
                localStorage.setItem("pedidos", JSON.stringify(mockPedidos));
            }
            
            // Esperar un momento para que se guarden los datos en localStorage
            setTimeout(() => {
                // Cargar productos de la boleta basándose en el pedido
                const productosDeVenta = obtenerProductosDeBoletaPorPedido(boleta.pedidoId);
                setProductos(productosDeVenta);
            }, 100);
        }
        setLoading(false);
    }, [boleta]);

    const formatoPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(precio);
    };
    if (!boleta) {
        return (
            <AdminLayout>
                <div className="detalle-container">
                    <h2>Boleta no encontrada</h2>
                    <button className="btn secundario" onClick={() => onNavigate('boletas')}>
                        Volver a Boletas
                    </button>
                </div>
            </AdminLayout>
        );
    }

    const handleMenuChange = (menuId) => {
        if (onNavigate) {
            switch(menuId) {
                case 'dashboard':
                    onNavigate('dashboard');
                    break;
                case 'products':
                    onNavigate('products');
                    break;
                case 'users':
                    onNavigate('users');
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
                activeMenu="boletas" 
                onMenuChange={onNavigate}
            >
                <div className="panel">
                    <div className="boleta-header">
                        <h1>Detalle de Boleta: {boleta.numero}</h1>
                        <button className="btn secundario" onClick={() => onNavigate('boletas')}>
                            Volver a Boletas
                        </button>
                    </div>

                    <div className="boleta-info">
                        <div className="boleta-info-item">
                            <strong>Número:</strong> {boleta.numero}
                        </div>
                        <div className="boleta-info-item">
                            <strong>Fecha:</strong> {boleta.fecha}
                        </div>
                        <div className="boleta-info-item">
                            <strong>Cliente:</strong> {boleta.cliente}
                        </div>
                        <div className="boleta-info-item precio">
                            <strong>Total:</strong> {boleta.total}
                        </div>
                    </div>

                    <div className="boleta-productos">
                        <h3>Productos Comprados</h3>
                        {loading ? (
                            <p>Cargando productos...</p>
                        ) : productos.length > 0 ? (
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto, index) => (
                                        <tr key={index}>
                                            <td>{producto.codigo}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.categoria}</td>
                                            <td>{producto.cantidad}</td>
                                            <td className="precio">{formatoPrecio(producto.precioUnitario)}</td>
                                            <td className="precio">{formatoPrecio(producto.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p><em>No se encontraron productos para esta boleta.</em></p>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </div>
    );
};

export default DetalleBoleta;