import React from 'react';
import { ClipboardList, Package, Wrench, Users, ShieldAlert } from 'lucide-react';

const modules = [
  { id: 'permisos',    label: 'Permisos de Trabajo',      icon: ClipboardList,  color: '#f59e0b' },
  { id: 'inventario',  label: 'Inventario',                icon: Package,        color: '#3b82f6' },
  { id: 'herramientas',label: 'Herramientas',              icon: Wrench,         color: '#10b981' },
  { id: 'asistencia',  label: 'Asistencia de Empleados',  icon: Users,          color: '#8b5cf6' },
  { id: 'alturas',     label: 'Equipos de Alturas',       icon: ShieldAlert,    color: '#ef4444' },
];

export { modules };

export default function Sidebar({ activeModule, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ShieldAlert size={22} color="#f59e0b" />
        </div>
        <div>
          <span className="sidebar-logo-title">Guana<span style={{ color: '#f59e0b' }}>Check</span></span>
          <span className="sidebar-logo-sub">App</span>
        </div>
      </div>

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

      <div className="sidebar-footer">
        <span>GuanaCheckApp v1.0</span>
      </div>
    </aside>
  );
}
