import React from 'react';
import { LayoutDashboard, ClipboardList, Package, Wrench, Users, ShieldAlert, LogOut, User } from 'lucide-react';

const modules = [
  { id: 'inicio',       label: 'Menú Principal',            icon: LayoutDashboard, color: '#38bdf8' },
  { id: 'permisos',     label: 'Permisos de Trabajo',       icon: ClipboardList,   color: '#f59e0b' },
  { id: 'inventario',   label: 'Inventario',                icon: Package,         color: '#3b82f6' },
  { id: 'herramientas', label: 'Herramientas',              icon: Wrench,          color: '#10b981' },
  { id: 'asistencia',   label: 'Asistencia de Empleados',   icon: Users,           color: '#8b5cf6' },
  { id: 'alturas',      label: 'Equipos de Alturas',        icon: ShieldAlert,     color: '#ef4444' },
];

export { modules };

export default function Sidebar({ activeModule, onSelect, currentUser, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => onSelect('inicio')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-icon">
          <ShieldAlert size={22} color="#f59e0b" />
        </div>
        <div>
          <span className="sidebar-logo-title">Guana<span style={{ color: '#f59e0b' }}>Check</span></span>
          <span className="sidebar-logo-sub">App</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {modules.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            className={`sidebar-item ${activeModule === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
            style={{ '--mod-color': color }}
          >
            <span className="sidebar-item-icon">
              <Icon size={20} />
            </span>
            <span className="sidebar-item-label">{label}</span>
            {activeModule === id && <span className="sidebar-active-bar" />}
          </button>
        ))}
      </nav>

      {/* Footer con Usuario y Cerrar Sesión */}
      <div className="sidebar-footer">
        {currentUser && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              <User size={16} />
            </div>
            <div className="sidebar-user-text">
              <span className="sidebar-user-name">{currentUser.name || 'Supervisor'}</span>
              <span className="sidebar-user-role">{currentUser.role || 'HSE / Obra'}</span>
            </div>
          </div>
        )}
        <button
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Cerrar Sesión"
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
        <span className="sidebar-version">GuanaCheckApp v1.0</span>
      </div>
    </aside>
  );
}
