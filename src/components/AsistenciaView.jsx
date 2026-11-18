import React, { useState } from 'react';
import { Users, PlusCircle, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

const estadoColors = {
  'Presente':  { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  'Ausente':   { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  'Tardanza':  { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  'Permiso':   { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

const hoy = new Date().toISOString().split('T')[0];

const initialEmpleados = [
  { id: 'EMP-001', nombre: 'Carlos Mendoza',   cargo: 'Operario',       area: 'Bloque A', entrada: '06:00', salida: '14:00', estado: 'Presente', fecha: hoy },
  { id: 'EMP-002', nombre: 'Luis Torres',       cargo: 'Electricista',   area: 'Subestación', entrada: '07:00', salida: '15:00', estado: 'Tardanza', fecha: hoy },
  { id: 'EMP-003', nombre: 'Ana Rincón',        cargo: 'Topógrafa',      area: 'Exteriores', entrada: '06:00', salida: '14:00', estado: 'Presente', fecha: hoy },
  { id: 'EMP-004', nombre: 'Marco Díaz',        cargo: 'Soldador',       area: 'Planta Baja', entrada: '--', salida: '--', estado: 'Ausente', fecha: hoy },
  { id: 'EMP-005', nombre: 'Pedro López',       cargo: 'Maquinista',     area: 'Patio',       entrada: '06:30', salida: '14:30', estado: 'Presente', fecha: hoy },
  { id: 'EMP-006', nombre: 'Juan Pérez',        cargo: 'Albañil',        area: 'Bloque C',    entrada: '--', salida: '--', estado: 'Permiso', fecha: hoy },
];

export default function AsistenciaView() {
  const [empleados, setEmpleados] = useState(initialEmpleados);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', cargo: '', area: '', entrada: '', salida: '' });

  const filtered = empleados.filter(e => {
    const matchSearch = e.nombre.toLowerCase().includes(search.toLowerCase()) ||
                        e.cargo.toLowerCase().includes(search.toLowerCase()) ||
                        e.area.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filtroEstado === 'Todos' || e.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const cambiarEstado = (id, estado) => {
    setEmpleados(prev => prev.map(e => e.id === id ? { ...e, estado } : e));
  };

  const handleAdd = () => {
    if (!form.nombre || !form.cargo) return;
    const nuevo = {
      id: `EMP-${String(empleados.length + 1).padStart(3, '0')}`,
      ...form,
      estado: 'Presente',
      fecha: hoy,
    };
    setEmpleados(prev => [nuevo, ...prev]);
    setForm({ nombre: '', cargo: '', area: '', entrada: '', salida: '' });
    setShowForm(false);
  };

  const counts = {
    Total:    empleados.length,
    Presente: empleados.filter(e => e.estado === 'Presente').length,
    Ausente:  empleados.filter(e => e.estado === 'Ausente').length,
    Tardanza: empleados.filter(e => e.estado === 'Tardanza').length,
    Permiso:  empleados.filter(e => e.estado === 'Permiso').length,
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <div className="module-title-group">
          <div className="module-icon-badge" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
            <Users size={24} />
          </div>
          <div>
            <h2 className="module-title">Asistencia de Empleados</h2>
            <p className="module-subtitle">Control de entrada, salida y estado diario</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={17} /> Agregar Empleado
        </button>
      </div>

      {/* Stat chips */}
      <div className="stat-chips">
        <div className="stat-chip" style={{ background: 'rgba(139,92,246,0.15)', borderColor: '#8b5cf644' }}>
          <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '1.2rem' }}>{counts.Total}</span>
          <span style={{ color: '#8b5cf6', opacity: 0.8, fontSize: '0.82rem' }}>Total</span>
        </div>
        {Object.entries(estadoColors).map(([estado, cfg]) => (
          <div key={estado} className="stat-chip"
            style={{ background: cfg.bg, borderColor: cfg.color + '44', cursor: 'pointer' }}
            onClick={() => setFiltroEstado(filtroEstado === estado ? 'Todos' : estado)}>
            <span style={{ color: cfg.color, fontWeight: 700, fontSize: '1.1rem' }}>{counts[estado]}</span>
            <span style={{ color: cfg.color, opacity: 0.8, fontSize: '0.82rem' }}>{estado}</span>
          </div>
        ))}
      </div>

      {/* Form inline */}
      {showForm && (
        <div className="inline-form glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Registrar Empleado</h3>
          <div className="form-grid-3">
            <input className="input-field" placeholder="Nombre completo *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="input-field" placeholder="Cargo *" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} />
            <input className="input-field" placeholder="Área / Bloque" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            <input className="input-field" type="time" placeholder="Hora entrada" value={form.entrada} onChange={e => setForm({ ...form, entrada: e.target.value })} />
            <input className="input-field" type="time" placeholder="Hora salida" value={form.salida} onChange={e => setForm({ ...form, salida: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleAdd}>Guardar</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="search-bar">
        <Search size={16} />
        <input className="search-input" placeholder="Buscar por nombre, cargo o área..." value={search} onChange={e => setSearch(e.target.value)} />
        {filtroEstado !== 'Todos' && (
          <button className="pill-btn active" style={{ marginLeft: 'auto', fontSize: '0.8rem' }} onClick={() => setFiltroEstado('Todos')}>
            {filtroEstado} ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper glass-card">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Cargo</th><th>Área</th><th>Entrada</th><th>Salida</th><th>Fecha</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-row">No se encontraron registros</td></tr>
            ) : filtered.map(e => {
              const cfg = estadoColors[e.estado] || estadoColors['Presente'];
              return (
                <tr key={e.id}>
                  <td><code style={{ color: '#8b5cf6', fontSize: '0.78rem' }}>{e.id}</code></td>
                  <td><strong>{e.nombre}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.cargo}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.area}</td>
                  <td style={{ fontFamily: 'monospace', color: '#10b981' }}>{e.entrada}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.salida}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{e.fecha}</td>
                  <td>
                    <select className="select-mini" value={e.estado} onChange={ev => cambiarEstado(e.id, ev.target.value)}
                      style={{ color: cfg.color, borderColor: cfg.color + '66' }}>
                      {Object.keys(estadoColors).map(s => <option key={s} value={s}>{s}</option>)}
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
