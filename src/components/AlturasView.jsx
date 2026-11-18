import React, { useState } from 'react';
import { ShieldAlert, PlusCircle, Search, CheckCircle2, AlertTriangle, XCircle, Calendar } from 'lucide-react';

const estadoColors = {
  'Operativo':       { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  'En Inspección':   { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  'Fuera de Servicio': { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  'Vencido':         { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6' },
};

const initialEquipos = [
  { id: 'EA-001', nombre: 'Arnés de Cuerpo Completo',   marca: 'MSA',       codigo: 'AH-001', responsable: 'Carlos Mendoza', ultimaInsp: '2026-10-01', proxInsp: '2026-11-01', estado: 'Vencido',         cantidad: 4 },
  { id: 'EA-002', nombre: 'Línea de Vida Autorretráctil', marca: '3M',       codigo: 'LV-002', responsable: 'Luis Torres',    ultimaInsp: '2026-10-15', proxInsp: '2027-01-15', estado: 'Operativo',       cantidad: 2 },
  { id: 'EA-003', nombre: 'Casco Dieléctrico clase E',  marca: 'Honeywell', codigo: 'CD-003', responsable: 'Ana Rincón',     ultimaInsp: '2026-11-01', proxInsp: '2027-02-01', estado: 'Operativo',       cantidad: 10 },
  { id: 'EA-004', nombre: 'Eslinga con Absorbedor',     marca: 'MSA',       codigo: 'ES-004', responsable: 'Marco Díaz',     ultimaInsp: '2026-09-20', proxInsp: '2026-11-20', estado: 'En Inspección',   cantidad: 3 },
  { id: 'EA-005', nombre: 'Cuerda de Seguridad 15m',    marca: 'Petzl',     codigo: 'CS-005', responsable: 'Pedro López',    ultimaInsp: '2026-10-10', proxInsp: '2026-12-10', estado: 'Operativo',       cantidad: 2 },
  { id: 'EA-006', nombre: 'Punto de Anclaje Portátil',  marca: 'Falltech',  codigo: 'PA-006', responsable: 'Sin asignar',    ultimaInsp: '2026-08-01', proxInsp: '2026-11-01', estado: 'Fuera de Servicio', cantidad: 1 },
];

export default function AlturasView() {
  const [equipos, setEquipos] = useState(initialEquipos);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', marca: '', codigo: '', responsable: '', ultimaInsp: '', proxInsp: '', cantidad: 1 });

  const filtered = equipos.filter(e =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.codigo.toLowerCase().includes(search.toLowerCase()) ||
    e.responsable.toLowerCase().includes(search.toLowerCase()) ||
    e.marca.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.nombre || !form.codigo) return;
    const nuevo = {
      id: `EA-${String(equipos.length + 1).padStart(3, '0')}`,
      ...form,
      estado: 'En Inspección',
    };
    setEquipos(prev => [nuevo, ...prev]);
    setForm({ nombre: '', marca: '', codigo: '', responsable: '', ultimaInsp: '', proxInsp: '', cantidad: 1 });
    setShowForm(false);
  };

  const cambiarEstado = (id, estado) => {
    setEquipos(prev => prev.map(e => e.id === id ? { ...e, estado } : e));
  };

  const counts = Object.fromEntries(
    Object.keys(estadoColors).map(e => [e, equipos.filter(eq => eq.estado === e).length])
  );

  const isVencido = (proxInsp) => {
    if (!proxInsp) return false;
    return new Date(proxInsp) < new Date();
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <div className="module-title-group">
          <div className="module-icon-badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="module-title">Equipos de Alturas</h2>
            <p className="module-subtitle">Inspección y control de EPP para trabajo en alturas</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={17} /> Registrar Equipo
        </button>
      </div>

      {/* Stat chips */}
      <div className="stat-chips">
        {Object.entries(counts).map(([estado, n]) => {
          const cfg = estadoColors[estado];
          return (
            <div key={estado} className="stat-chip" style={{ background: cfg.bg, borderColor: cfg.color + '44' }}>
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: '1.1rem' }}>{n}</span>
              <span style={{ color: cfg.color, opacity: 0.8, fontSize: '0.78rem' }}>{estado}</span>
            </div>
          );
        })}
      </div>

      {/* Alert banner */}
      {counts['Vencido'] > 0 && (
        <div className="alert-banner" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid #8b5cf644', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8b5cf6', fontSize: '0.9rem' }}>
          <AlertTriangle size={18} />
          <strong>{counts['Vencido']} equipo(s) con inspección vencida.</strong> Revisar y actualizar antes de usar.
        </div>
      )}

      {/* Form inline */}
      {showForm && (
        <div className="inline-form glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Registrar Equipo de Alturas</h3>
          <div className="form-grid-3">
            <input className="input-field" placeholder="Nombre del equipo *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="input-field" placeholder="Código *" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
            <input className="input-field" placeholder="Marca" value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} />
            <input className="input-field" placeholder="Responsable" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} />
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Última inspección</label>
              <input className="input-field" type="date" value={form.ultimaInsp} onChange={e => setForm({ ...form, ultimaInsp: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'block' }}>Próxima inspección</label>
              <input className="input-field" type="date" value={form.proxInsp} onChange={e => setForm({ ...form, proxInsp: e.target.value })} />
            </div>
            <input className="input-field" type="number" min={1} placeholder="Cantidad" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: parseInt(e.target.value) || 1 })} />
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
        <input className="search-input" placeholder="Buscar por nombre, código, marca o responsable..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-wrapper glass-card">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Equipo</th><th>Código</th><th>Marca</th><th>Responsable</th><th>Última Insp.</th><th>Próx. Insp.</th><th>Cant.</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="empty-row">No se encontraron equipos</td></tr>
            ) : filtered.map(eq => {
              const cfg = estadoColors[eq.estado] || estadoColors['Operativo'];
              const vencido = isVencido(eq.proxInsp);
              return (
                <tr key={eq.id} style={vencido && eq.estado !== 'Fuera de Servicio' ? { background: 'rgba(139,92,246,0.05)' } : {}}>
                  <td><code style={{ color: '#ef4444', fontSize: '0.78rem' }}>{eq.id}</code></td>
                  <td><strong>{eq.nombre}</strong></td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{eq.codigo}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{eq.marca}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{eq.responsable}</td>
                  <td style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{eq.ultimaInsp}</td>
                  <td style={{ fontSize: '0.83rem', color: vencido ? '#8b5cf6' : 'var(--text-muted)', fontWeight: vencido ? 700 : 400 }}>
                    {vencido && <AlertTriangle size={12} style={{ marginRight: 4 }} />}{eq.proxInsp}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{eq.cantidad}</td>
                  <td>
                    <select className="select-mini" value={eq.estado} onChange={e => cambiarEstado(eq.id, e.target.value)}
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
