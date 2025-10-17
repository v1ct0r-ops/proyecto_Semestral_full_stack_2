import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layout/AdminLayout';

const Boleta = ({ onNavigate, onViewDetail }) => {

    const [boletas, setBoletas] = useState(null);

    useEffect(() => {
        const boletasGuardadas = JSON.parse(localStorage.getItem("boletas") || "[]");
        
        // Si no hay boletas o no tienen pedidoId, crear datos mock para probar
        if (boletasGuardadas.length === 0 || !boletasGuardadas[0]?.pedidoId) {
            const mockBoletas = [
                {
                    numero: "BOL-001",
                    fecha: "2025-01-15",
                    cliente: "Juan Pérez",
                    pedidoId: "PED-001", // ← Referencia al pedido
                    total: "$599.999"
                },
                {
                    numero: "BOL-002",
                    fecha: "2025-01-14",
                    cliente: "María González",
                    pedidoId: "PED-002", // ← Referencia al pedido
                    total: "$549.999"
                },
                {
                    numero: "BOL-003",
                    fecha: "2025-01-13",
                    cliente: "Carlos Silva",
                    pedidoId: "PED-003", // ← Referencia al pedido
                    total: "$299.999"
                }
            ];

            // Guardar en localStorage para la próxima vez
            localStorage.setItem("boletas", JSON.stringify(mockBoletas));
            setBoletas(mockBoletas);
        } else {
            setBoletas(boletasGuardadas);
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
                    <h1>Boletas Emitidas</h1>
                    {boletas && boletas.length > 0 ? (
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Número de Boleta</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boletas.map((boleta, index) => (
                                    <tr key={index}>
                                        <td>{boleta.numero}</td>
                                        <td>{boleta.fecha}</td>
                                        <td>{boleta.cliente}</td>
                                        <td className="precio">{boleta.total}</td>
                                        <td>
                                            <button 
                                                className="btn secundario" 
                                                onClick={() => onViewDetail(boleta)}
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay boletas emitidas.</p>
                    )}
                </div>
            </AdminLayout>
        </div>
    );
};

export default Boleta;