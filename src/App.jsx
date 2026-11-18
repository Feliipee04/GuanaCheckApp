import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import HomeView from './components/HomeView';

// Los 5 módulos principales configurados
import PermisosView from './components/PermisosView';
import InventoryModule from './components/InventoryModule';
import HerramientasView from './components/HerramientasView';
import AsistenciaView from './components/AsistenciaView';
import AlturasView from './components/AlturasView';

import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('guanacheck_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeModule, setActiveModule] = useState('inicio');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (user, remember) => {
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem('guanacheck_user', JSON.stringify(user));
    }
    setActiveModule('inicio');
    showToast(`👷 Bienvenido, ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('guanacheck_user');
    setActiveModule('inicio');
    showToast('👋 Sesión cerrada correctamente');
  };

  // Si no hay sesión iniciada, mostrar pantalla de Login
  if (!currentUser) {
    return (
      <div className="layout login-layout">
        <LoginView onLogin={handleLogin} />
        {toastMessage && (
          <div className="toast">
            <CheckCircle2 size={20} style={{ color: 'var(--accent-amber)' }} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Renderizar la vista activa (Inicio con los 5 items principales o cualquiera de los módulos)
  const renderModule = () => {
    switch (activeModule) {
      case 'inicio':
        return <HomeView onSelectModule={setActiveModule} currentUser={currentUser} />;
      case 'permisos':
        return <PermisosView onBack={() => setActiveModule('inicio')} />;
      case 'inventario':
        return <InventoryModule showToast={showToast} onBack={() => setActiveModule('inicio')} />;
      case 'herramientas':
        return <HerramientasView onBack={() => setActiveModule('inicio')} />;
      case 'asistencia':
        return <AsistenciaView onBack={() => setActiveModule('inicio')} />;
      case 'alturas':
        return <AlturasView onBack={() => setActiveModule('inicio')} />;
      default:
        return <HomeView onSelectModule={setActiveModule} currentUser={currentUser} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar
        activeModule={activeModule}
        onSelect={setActiveModule}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {renderModule()}
      </main>

      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={20} style={{ color: 'var(--accent-amber)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
