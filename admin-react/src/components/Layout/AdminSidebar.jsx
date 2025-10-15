import React from 'react';

function AdminSidebar({ activeMenu, onMenuChange }) {
  // Por ahora, assumimos admin por defecto hasta integrar servicios
  const esAdmin = true;

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', showTo: 'all' },
    { id: 'products', label: 'Productos', showTo: 'all' },
    { id: 'users', label: 'Usuarios', showTo: 'admin' }, // Solo admin
    { id: 'orders', label: 'Pedidos', showTo: 'all' },
    { id: 'requests', label: 'Solicitudes', showTo: 'all' },
  ];

  return (
    <aside className="menu-admin">
      {menuItems.map((item) => {
        // Filtrar elementos según permisos
        if (item.showTo === 'admin' && !esAdmin) {
          return null;
        }

        const isActive = activeMenu === item.id;
        
        return (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onMenuChange(item.id);
            }}
            className={isActive ? 'activo' : ''}
          >
            {item.label}
          </a>
        );
      })}
    </aside>
  );
}

export default AdminSidebar;