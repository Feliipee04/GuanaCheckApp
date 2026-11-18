import React, { useState } from 'react';
import { ClipboardList, PlusCircle, Search, CheckCircle2, XCircle, Clock, ChevronDown, ArrowLeft } from 'lucide-react';

const estadoColors = {
  'Aprobado':  { bg: 'rgba(16,185,129,0.15)', color: '#10b981', icon: CheckCircle2 },
  'Pendiente': { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b', icon: Clock },
  'Rechazado': { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444', icon: XCircle },
};

const initialPermisos = [
  { id: 'PW-001', tipo: 'Trabajo en Altura',   solicitante: 'Carlos Mendoza',  area: 'Bloque A - Piso 5', fecha: '2026-11-15', estado: 'Aprobado',  responsable: 'Ing. Reyes' },
  { id: 'PW-002', tipo: 'Trabajo Eléctrico',   solicitante: 'Luis Torres',     area: 'Subestación Norte',  fecha: '2026-11-16', estado: 'Pendiente', responsable: 'Ing. Mora' },
  { id: 'PW-003', tipo: 'Espacio Confinado',   solicitante: 'Juan Pérez',      area: 'Cisterna B',         fecha: '2026-11-17', estado: 'Rechazado', responsable: 'Ing. Reyes' },
  { id: 'PW-004', tipo: 'Soldadura / Corte',   solicitante: 'Marco Díaz',      area: 'Planta Baja',        fecha: '2026-11-18', estado: 'Pendiente', responsable: 'Ing. Mora' },
];

export default function PermisosView({ onBack }) {
  const [permisos, setPermisos] = useState(initialPermisos);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: '', solicitante: '', area: '', responsable: '' });

  const filtered = permisos.filter(p => {
    const matchSearch = p.tipo.toLowerCase().includes(search.toLowerCase()) ||
                        p.solicitante.toLowerCase().includes(search.toLowerCase()) ||
                        p.area.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const handleAdd = () => {
    if (!form.tipo || !form.solicitante || !form.area) return;
    const nuevo = {
      id: `PW-${String(permisos.length + 1).padStart(3, '0')}`,
      tipo: form.tipo,
      solicitante: form.solicitante,
      area: form.area,
      responsable: form.responsable,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
    };
    setPermisos(prev => [nuevo, ...prev]);
    setForm({ tipo: '', solicitante: '', area: '', responsable: '' });
    setShowForm(false);
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setPermisos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  const counts = {
    Aprobado:  permisos.filter(p => p.estado === 'Aprobado').length,
    Pendiente: permisos.filter(p => p.estado === 'Pendiente').length,
    Rechazado: permisos.filter(p => p.estado === 'Rechazado').length,
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <div className="module-title-group">
          {onBack && (
            <button className="btn btn-outline back-btn" onClick={onBack} title="Volver al Menú Principal">
              <ArrowLeft size={18} />
              <span>Módulos</span>
            </button>
          )}
          <div className="module-icon-badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
            <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="module-title">Permisos de Trabajo</h2>
            <p className="module-subtitle">Gestión y control de permisos HSE</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={17} /> Nuevo Permiso
        </button>
      </div>

      {/* Stat chips */}
      <div className="stat-chips">
        {Object.entries(counts).map(([estado, n]) => {
          const cfg = estadoColors[estado];
          const Icon = cfg.icon;
          return (
            <div key={estado} className="stat-chip" style={{ background: cfg.bg, borderColor: cfg.color + '44' }}
              onClick={() => setFiltroEstado(filtroEstado === estado ? 'Todos' : estado)}>
              <Icon size={16} color={cfg.color} />
              <span style={{ color: cfg.color, fontWeight: 700 }}>{n}</span>
              <span style={{ color: cfg.color, opacity: 0.8, fontSize: '0.82rem' }}>{estado}</span>
            </div>
          );
        })}
      </div>

      {/* Form inline */}
      {showForm && (
        <div className="inline-form glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Nuevo Permiso de Trabajo</h3>
          <div className="form-grid-2">
            <input className="input-field" placeholder="Tipo de trabajo *" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} />
            <input className="input-field" placeholder="Solicitante *" value={form.solicitante} onChange={e => setForm({ ...form, solicitante: e.target.value })} />
            <input className="input-field" placeholder="Área / Ubicación *" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            <input className="input-field" placeholder="Responsable HSE" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleAdd}>Guardar Permiso</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <Search size={16} />
        <input className="search-input" placeholder="Buscar por tipo, solicitante o área..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-wrapper glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Tipo de Trabajo</th><th>Solicitante</th><th>Área</th><th>Fecha</th><th>Responsable</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-row">No se encontraron permisos</td></tr>
            ) : filtered.map(p => {
              const cfg = estadoColors[p.estado];
              const Icon = cfg.icon;
              return (
                <tr key={p.id}>
                  <td><code style={{ color: '#f59e0b', fontSize: '0.78rem' }}>{p.id}</code></td>
                  <td><strong>{p.tipo}</strong></td>
                  <td>{p.solicitante}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.area}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.fecha}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.responsable}</td>
                  <td>
                    <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                      <Icon size={12} /> {p.estado}
                    </span>
                  </td>
                  <td>
                    <select className="select-mini" value={p.estado} onChange={e => cambiarEstado(p.id, e.target.value)}>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobado">Aprobado</option>
                      <option value="Rechazado">Rechazado</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
