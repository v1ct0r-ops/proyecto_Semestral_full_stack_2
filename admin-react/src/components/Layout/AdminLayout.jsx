import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import UserPanel from './UserPanel';

function AdminLayout({ children, activeMenu, onMenuChange }) {
  const [userPanelOpen, setUserPanelOpen] = useState(false);

  const toggleUserPanel = () => {
    setUserPanelOpen(!userPanelOpen);
  };

  const closeUserPanel = () => {
    setUserPanelOpen(false);
  };

  return (
    <div className="admin-layout">
      <AdminHeader onToggleUserPanel={toggleUserPanel} onNavigate={onMenuChange} />
      
      <main className="principal">
        <section className="admin">
          <AdminSidebar 
            activeMenu={activeMenu}
            onMenuChange={onMenuChange}
          />
          
          {/* Contenido principal del panel */}
          {children}
        </section>
      </main>

      <AdminFooter />
      
      <UserPanel 
        isOpen={userPanelOpen} 
        onClose={closeUserPanel} 
      />
    </div>
  );
}

export default AdminLayout;