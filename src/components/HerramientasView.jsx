import React, { useState } from 'react';
import { Wrench, PlusCircle, Search, CheckCircle2, AlertTriangle, XCircle, ArrowLeft } from 'lucide-react';

const estadoColors = {
  'Disponible':    { bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
  'En Uso':        { bg: 'rgba(59,130,246,0.15)',   color: '#3b82f6' },
  'Mantenimiento': { bg: 'rgba(245,158,11,0.15)',   color: '#f59e0b' },
  'Dañada':        { bg: 'rgba(239,68,68,0.15)',    color: '#ef4444' },
};

const initialHerramientas = [
  { id: 'HER-001', nombre: 'Taladro Percutor Bosch',    codigo: 'T-001', categoria: 'Eléctrica',    ubicacion: 'Bodega A',    responsable: 'Miguel Ruiz',   estado: 'Disponible',    cantidad: 3 },
  { id: 'HER-002', nombre: 'Pulidora Angular 7"',       codigo: 'T-002', categoria: 'Eléctrica',    ubicacion: 'Bloque B',    responsable: 'Pedro López',   estado: 'En Uso',        cantidad: 2 },
  { id: 'HER-003', nombre: 'Nivel Láser Autonivelante', codigo: 'T-003', categoria: 'Medición',     ubicacion: 'Bodega A',    responsable: 'Ana Rincón',    estado: 'Disponible',    cantidad: 1 },
  { id: 'HER-004', nombre: 'Compresor 50L',             codigo: 'T-004', categoria: 'Neumática',    ubicacion: 'Área Mecánica', responsable: 'Carlos Vega', estado: 'Mantenimiento', cantidad: 1 },
  { id: 'HER-005', nombre: 'Martillo Demoledor',        codigo: 'T-005', categoria: 'Eléctrica',    ubicacion: 'Bloque C',    responsable: 'Luis Torres',   estado: 'Dañada',        cantidad: 1 },
  { id: 'HER-006', nombre: 'Juego de Llaves Mixtas',    codigo: 'T-006', categoria: 'Manual',       ubicacion: 'Bodega B',    responsable: 'Sin asignar',   estado: 'Disponible',    cantidad: 5 },
];

const categorias = ['Todas', 'Eléctrica', 'Manual', 'Medición', 'Neumática', 'Corte'];

export default function HerramientasView({ onBack }) {
  const [herramientas, setHerramientas] = useState(initialHerramientas);
  const [search, setSearch] = useState('');
  const [filtroCat, setFiltroCat] = useState('Todas');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', codigo: '', categoria: 'Eléctrica', ubicacion: '', responsable: '', cantidad: 1 });

  const filtered = herramientas.filter(h => {
    const matchSearch = h.nombre.toLowerCase().includes(search.toLowerCase()) ||
                        h.codigo.toLowerCase().includes(search.toLowerCase()) ||
                        h.responsable.toLowerCase().includes(search.toLowerCase());
    const matchCat = filtroCat === 'Todas' || h.categoria === filtroCat;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    if (!form.nombre || !form.codigo) return;
    const nueva = {
      id: `HER-${String(herramientas.length + 1).padStart(3, '0')}`,
      ...form,
      estado: 'Disponible',
    };
    setHerramientas(prev => [nueva, ...prev]);
    setForm({ nombre: '', codigo: '', categoria: 'Eléctrica', ubicacion: '', responsable: '', cantidad: 1 });
    setShowForm(false);
  };

  const cambiarEstado = (id, estado) => {
    setHerramientas(prev => prev.map(h => h.id === id ? { ...h, estado } : h));
  };

  const counts = Object.fromEntries(
    Object.keys(estadoColors).map(e => [e, herramientas.filter(h => h.estado === e).length])
  );

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
          <div className="module-icon-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <Wrench size={24} />
          </div>
          <div>
            <h2 className="module-title">Herramientas</h2>
            <p className="module-subtitle">Control y estado del parque de herramientas</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={17} /> Nueva Herramienta
        </button>
      </div>

      {/* Stat chips */}
      <div className="stat-chips">
        {Object.entries(counts).map(([estado, n]) => {
          const cfg = estadoColors[estado];
          return (
            <div key={estado} className="stat-chip" style={{ background: cfg.bg, borderColor: cfg.color + '44' }}>
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: '1.1rem' }}>{n}</span>
              <span style={{ color: cfg.color, opacity: 0.8, fontSize: '0.82rem' }}>{estado}</span>
            </div>
          );
        })}
      </div>

      {/* Category pills */}
      <div className="pill-row">
        {categorias.map(c => (
          <button key={c} className={`pill-btn ${filtroCat === c ? 'active' : ''}`} onClick={() => setFiltroCat(c)}
            style={filtroCat === c ? { '--pill-active': '#10b981' } : {}}>
            {c}
          </button>
        ))}
      </div>

      {/* Form inline */}
      {showForm && (
        <div className="inline-form glass-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Registrar Herramienta</h3>
          <div className="form-grid-3">
            <input className="input-field" placeholder="Nombre *" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            <input className="input-field" placeholder="Código *" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
            <select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
              {categorias.filter(c => c !== 'Todas').map(c => <option key={c}>{c}</option>)}
            </select>
            <input className="input-field" placeholder="Ubicación" value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} />
            <input className="input-field" placeholder="Responsable" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} />
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
        <input className="search-input" placeholder="Buscar herramienta, código o responsable..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-wrapper glass-card">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Herramienta</th><th>Código</th><th>Categoría</th><th>Ubicación</th><th>Responsable</th><th>Cant.</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-row">No se encontraron herramientas</td></tr>
            ) : filtered.map(h => {
              const cfg = estadoColors[h.estado] || estadoColors['Disponible'];
              return (
                <tr key={h.id}>
                  <td><code style={{ color: '#10b981', fontSize: '0.78rem' }}>{h.id}</code></td>
                  <td><strong>{h.nombre}</strong></td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{h.codigo}</td>
                  <td><span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{h.categoria}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{h.ubicacion}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{h.responsable}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{h.cantidad}</td>
                  <td>
                    <select className="select-mini" value={h.estado} onChange={e => cambiarEstado(h.id, e.target.value)}
                      style={{ color: cfg.color, borderColor: cfg.color + '66' }}>
                      {Object.keys(estadoColors).map(e => <option key={e} value={e}>{e}</option>)}
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
