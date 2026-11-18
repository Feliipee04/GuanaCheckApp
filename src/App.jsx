import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

// Module views
import InventoryModule from './components/InventoryModule';
import PermisosView    from './components/PermisosView';
import HerramientasView from './components/HerramientasView';
import AsistenciaView  from './components/AsistenciaView';
import AlturasView     from './components/AlturasView';

import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState('inventario');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'permisos':     return <PermisosView />;
      case 'inventario':   return <InventoryModule showToast={showToast} />;
      case 'herramientas': return <HerramientasView />;
      case 'asistencia':   return <AsistenciaView />;
      case 'alturas':      return <AlturasView />;
      default:             return <InventoryModule showToast={showToast} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeModule={activeModule} onSelect={setActiveModule} />

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
