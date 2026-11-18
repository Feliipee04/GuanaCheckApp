import React from 'react';
import { ClipboardList, Package, Wrench, Users, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

const mainModules = [
  {
    id: 'permisos',
    name: 'Permisos de Trabajo',
    badge: 'HSE & Seguridad',
    desc: 'Gestión, emisión y aprobación de permisos para trabajos en alturas, eléctricos, en caliente y espacios confinados.',
    icon: ClipboardList,
    color: '#f59e0b',
    lightBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    actionText: 'Ingresar a Permisos'
  },
  {
    id: 'inventario',
    name: 'Inventario',
    badge: 'Materiales & Insumos',
    desc: 'Control y despacho de materiales de construcción, registro de entradas y salidas, catálogo de existencias.',
    icon: Package,
    color: '#3b82f6',
    lightBg: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    actionText: 'Ingresar a Inventario'
  },
  {
    id: 'herramientas',
    name: 'Herramientas',
    badge: 'Equipos & Maquinaria',
    desc: 'Control del parque de herramientas manuales, eléctricas y neumáticas, asignaciones a operarios y estado operativo.',
    icon: Wrench,
    color: '#10b981',
    lightBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    actionText: 'Ingresar a Herramientas'
  },
  {
    id: 'asistencia',
    name: 'Asistencia de Empleados',
    badge: 'Personal en Obra',
    desc: 'Control diario de asistencia de trabajadores y cuadrillas, registros de horas de ingreso, salida, ausencias y permisos.',
    icon: Users,
    color: '#8b5cf6',
    lightBg: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    actionText: 'Ingresar a Asistencia'
  },
  {
    id: 'alturas',
    name: 'Equipos de Alturas',
    badge: 'EPP Crítico',
    desc: 'Inspección técnica de seguridad, trazabilidad de arneses, eslingas, líneas de vida y control de fechas de vencimiento.',
    icon: ShieldAlert,
    color: '#ef4444',
    lightBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    actionText: 'Ingresar a Alturas'
  }
];

export default function HomeView({ onSelectModule, currentUser }) {
  return (
    <div className="home-dashboard">
      {/* Bienvenida */}
      <div className="home-hero glass-card">
        <div className="home-hero-text">
          <div className="home-badge">
            <Sparkles size={14} color="#f59e0b" />
            <span>Módulos Principales Configurados</span>
          </div>
          <h1 className="home-title">
            Panel Principal <span style={{ color: '#f59e0b' }}>GuanaCheckApp</span>
          </h1>
          <p className="home-subtitle">
            Hola, <strong>{currentUser?.name || 'Supervisor'}</strong>. Selecciona cualquiera de los 5 módulos principales para gestionar tus operaciones:
          </p>
        </div>
      </div>

      {/* Grid de los 5 items principales */}
      <div className="home-modules-grid">
        {mainModules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="home-module-card glass-card"
              onClick={() => onSelectModule(mod.id)}
              style={{ '--mod-accent': mod.color }}
            >
              <div className="home-card-header">
                <div
                  className="home-card-icon"
                  style={{
                    background: mod.lightBg,
                    border: `1px solid ${mod.borderColor}`,
                    color: mod.color
                  }}
                >
                  <Icon size={26} />
                </div>
                <div className="home-card-meta">
                  <span
                    className="home-card-tag"
                    style={{
                      background: mod.lightBg,
                      color: mod.color,
                      border: `1px solid ${mod.borderColor}`
                    }}
                  >
                    {mod.badge}
                  </span>
                  <span className="home-card-index">Item 0{index + 1}</span>
                </div>
              </div>

              <div className="home-card-body">
                <h3 className="home-card-title">{mod.name}</h3>
                <p className="home-card-desc">{mod.desc}</p>
              </div>

              <div className="home-card-footer">
                <span className="home-card-action" style={{ color: mod.color }}>
                  {mod.actionText}
                </span>
                <div
                  className="home-card-arrow"
                  style={{
                    background: mod.lightBg,
                    color: mod.color,
                    border: `1px solid ${mod.borderColor}`
                  }}
                >
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
