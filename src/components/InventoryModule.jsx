import React, { useState, useEffect, useRef } from 'react';
import { initialCategories, initialLocations } from '../data/initialData';
import {
  Package,
  PlusCircle,
  Search,
  ArrowLeft,
  Edit3,
  Trash2,
  ArrowUpDown,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';

export default function InventoryModule({ showToast, onBack }) {
  // Limpieza de datos antiguos de muestra (ITEM-101 a ITEM-108) para arrancar limpio
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('guanacheck_inventory');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      const cleaned = parsed.filter(i => !['ITEM-101', 'ITEM-102', 'ITEM-103', 'ITEM-104', 'ITEM-105', 'ITEM-106', 'ITEM-107', 'ITEM-108'].includes(i.id));
      return cleaned;
    } catch {
      return [];
    }
  });

  const [categories] = useState(initialCategories);
  const [locations] = useState(initialLocations);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas las Ubicaciones');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: 'Materiales Básicos',
    location: 'Almacén Central',
    quantity: 10,
    minQuantity: 5,
    unit: 'unidades',
    notes: ''
  });

  // Modal de Movimiento (Entrada / Salida)
  const [movementModal, setMovementModal] = useState({
    isOpen: false,
    item: null,
    type: 'Entrada',
    quantity: 1,
    operator: 'Ing. Supervisor',
    motive: ''
  });

  const fileInputRef = useRef(null);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('guanacheck_inventory', JSON.stringify(items));
  }, [items]);

  // Manejo de formulario
  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      name: '',
      sku: `MAT-${String(items.length + 1).padStart(3, '0')}`,
      category: 'Materiales Básicos',
      location: 'Almacén Central',
      quantity: 10,
      minQuantity: 5,
      unit: 'unidades',
      notes: ''
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku || '',
      category: item.category || 'Materiales Básicos',
      location: item.location || 'Almacén Central',
      quantity: item.quantity,
      minQuantity: item.minQuantity || 5,
      unit: item.unit || 'unidades',
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const calculateStatus = (qty, minQty) => {
    if (qty === 0) return 'Agotado';
    if (qty <= minQty) return 'Stock Bajo';
    return 'Disponible';
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const qty = Number(form.quantity) || 0;
    const minQty = Number(form.minQuantity) || 0;
    const status = calculateStatus(qty, minQty);

    if (editingId) {
      setItems(prev => prev.map(item => {
        if (item.id !== editingId) return item;
        return {
          ...item,
          name: form.name.trim(),
          sku: form.sku.trim() || item.sku,
          category: form.category,
          location: form.location,
          quantity: qty,
          minQuantity: minQty,
          unit: form.unit,
          status,
          notes: form.notes.trim(),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }));
      showToast && showToast(`✏️ Material "${form.name}" actualizado`);
    } else {
      const newItem = {
        id: `MAT-${String(items.length + 1).padStart(3, '0')}`,
        name: form.name.trim(),
        sku: form.sku.trim() || `MAT-${String(items.length + 1).padStart(3, '0')}`,
        category: form.category,
        location: form.location,
        quantity: qty,
        minQuantity: minQty,
        unit: form.unit,
        status,
        notes: form.notes.trim(),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [newItem, ...prev]);
      showToast && showToast(`✅ Material "${form.name}" registrado`);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`¿Eliminar material "${name}" del inventario?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      showToast && showToast(`🗑️ Material eliminado`);
    }
  };

  const handleQuickDelta = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(0, item.quantity + delta);
      return {
        ...item,
        quantity: newQty,
        status: calculateStatus(newQty, item.minQuantity),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }));
  };

  // Movimientos de Entrada / Salida
  const handleOpenMovement = (item) => {
    setMovementModal({
      isOpen: true,
      item,
      type: 'Entrada',
      quantity: 1,
      operator: 'Ing. Supervisor',
      motive: ''
    });
  };

  const handleConfirmMovement = (e) => {
    e.preventDefault();
    const { item, type, quantity, motive } = movementModal;
    if (!item || quantity <= 0) return;

    const delta = type === 'Entrada' ? Number(quantity) : -Number(quantity);

    setItems(prev => prev.map(i => {
      if (i.id !== item.id) return i;
      const newQty = Math.max(0, i.quantity + delta);
      return {
        ...i,
        quantity: newQty,
        status: calculateStatus(newQty, i.minQuantity),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }));

    showToast && showToast(`📦 ${type}: ${quantity} ${item.unit} de "${item.name}"`);
    setMovementModal({ isOpen: false, item: null, type: 'Entrada', quantity: 1, operator: '', motive: '' });
  };

  // Exportar / Importar
  const handleExportCSV = () => {
    if (items.length === 0) {
      alert('No hay materiales para exportar.');
      return;
    }
    const headers = ['ID', 'SKU', 'Nombre', 'Categoria', 'Ubicacion', 'Stock', 'Minimo', 'Unidad', 'Estado', 'Notas'];
    const rows = items.map(i => [
      i.id,
      `"${i.sku}"`,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.location}"`,
      i.quantity,
      i.minQuantity,
      `"${i.unit}"`,
      `"${i.status}"`,
      `"${i.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `guanacheck-inventario-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast && showToast('📥 Inventario exportado en CSV');
  };

  const handleImportJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          setItems(data);
          showToast && showToast(`✅ Importados ${data.length} materiales`);
        } else {
          alert('Formato de archivo no válido.');
        }
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Filtrado
  const filteredItems = items.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchLoc = selectedLocation === 'Todas las Ubicaciones' || item.location === selectedLocation;
    let matchStatus = true;
    if (statusFilter === 'Disponible') matchStatus = item.status === 'Disponible';
    else if (statusFilter === 'Bajo') matchStatus = item.status === 'Stock Bajo';
    else if (statusFilter === 'Agotado') matchStatus = item.status === 'Agotado';
    return matchSearch && matchCat && matchLoc && matchStatus;
  });

  const counts = {
    Total: items.length,
    Disponible: items.filter(i => i.status === 'Disponible').length,
    'Stock Bajo': items.filter(i => i.status === 'Stock Bajo').length,
    Agotado: items.filter(i => i.status === 'Agotado').length,
  };

  const statusStyles = {
    Disponible: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', icon: CheckCircle2 },
    'Stock Bajo': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', icon: AlertTriangle },
    Agotado: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', icon: XCircle },
  };

  return (
    <div className="module-view">
      {/* Header */}
      <div className="module-header">
        <div className="module-title-group">
          {onBack && (
            <button className="btn btn-outline back-btn" onClick={onBack} title="Volver al Menú Principal">
              <ArrowLeft size={18} />
              <span>Módulos</span>
            </button>
          )}
          <div className="module-icon-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 className="module-title">Inventario</h2>
            <p className="module-subtitle">Control de materiales, insumos y existencias en obra</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleOpenNew}>
            <PlusCircle size={17} /> Nuevo Material
          </button>
          <button className="btn btn-outline" onClick={handleExportCSV} title="Exportar CSV">
            <Download size={17} /> Exportar
          </button>
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} title="Importar JSON">
            <Upload size={17} /> Importar
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => {
              if (e.target.files[0]) {
                handleImportJSON(e.target.files[0]);
                e.target.value = '';
              }
            }}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Stat chips */}
      <div className="stat-chips">
        <div className="stat-chip" style={{ background: 'rgba(59,130,246,0.15)', borderColor: '#3b82f644' }}>
          <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.1rem' }}>{counts.Total}</span>
          <span style={{ color: '#3b82f6', opacity: 0.8, fontSize: '0.82rem' }}>Total Materiales</span>
        </div>
        {Object.entries(statusStyles).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={status}
              className="stat-chip"
              style={{ background: cfg.bg, borderColor: cfg.color + '44', cursor: 'pointer' }}
              onClick={() => setStatusFilter(statusFilter === status ? 'Todos' : status)}
            >
              <Icon size={15} color={cfg.color} />
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: '1.05rem' }}>{counts[status]}</span>
              <span style={{ color: cfg.color, opacity: 0.8, fontSize: '0.82rem' }}>{status}</span>
            </div>
          );
        })}
      </div>

      {/* Formulario Inline para Nuevo / Editar Material */}
      {showForm && (
        <div className="inline-form glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>
              {editingId ? 'Editar Material' : 'Registrar Nuevo Material'}
            </h3>
            <button className="btn btn-outline btn-icon-only" onClick={() => setShowForm(false)}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveForm}>
            <div className="form-grid-3">
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Nombre del Material *</label>
                <input
                  className="input-field"
                  placeholder="ej. Cemento Gris 50kg"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Código / SKU</label>
                <input
                  className="input-field"
                  placeholder="ej. MAT-001"
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Categoría</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {categories.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Ubicación / Obra</label>
                <select
                  className="input-field"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                >
                  {locations.filter(l => l !== 'Todas las Ubicaciones').map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Cantidad Inicial</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Unidad de Medida</label>
                <select
                  className="input-field"
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="unidades">Unidades</option>
                  <option value="sacos">Sacos</option>
                  <option value="piezas">Piezas</option>
                  <option value="m³">m³ (Metros cúbicos)</option>
                  <option value="kg">kg (Kilogramos)</option>
                  <option value="metros">Metros</option>
                  <option value="cubetas">Cubetas</option>
                  <option value="rollos">Rollos</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Stock Mínimo (Alerta)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  value={form.minQuantity}
                  onChange={e => setForm({ ...form, minQuantity: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Notas / Especificaciones</label>
                <input
                  className="input-field"
                  placeholder="Detalles técnicos, proveedor o recomendaciones..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar Material' : 'Guardar Material'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Pills */}
      <div className="pill-row">
        {categories.map(cat => (
          <button
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={selectedCategory === cat ? { '--pill-active': '#3b82f6' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="search-bar">
        <Search size={16} />
        <input
          className="search-input"
          placeholder="Buscar material por nombre, código o notas..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {statusFilter !== 'Todos' && (
          <button
            className="pill-btn active"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.6rem' }}
            onClick={() => setStatusFilter('Todos')}
          >
            Estado: {statusFilter} ✕
          </button>
        )}
      </div>

      {/* Tabla de Materiales */}
      <div className="table-wrapper glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Material / Insumo</th>
              <th>Código</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th>Unidad</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-row">
                  {items.length === 0 ? (
                    <div>
                      <Package size={40} style={{ color: 'var(--accent-blue)', opacity: 0.5, marginBottom: '0.5rem' }} />
                      <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        No hay materiales registrados en el inventario
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Haz clic en el botón <strong>"Nuevo Material"</strong> para comenzar a registrar tus existencias.
                      </p>
                    </div>
                  ) : (
                    'No se encontraron materiales con los filtros seleccionados.'
                  )}
                </td>
              </tr>
            ) : (
              filteredItems.map(item => {
                const cfg = statusStyles[item.status] || statusStyles['Disponible'];
                const Icon = cfg.icon;
                return (
                  <tr key={item.id}>
                    <td>
                      <code style={{ color: '#3b82f6', fontSize: '0.78rem' }}>{item.id}</code>
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                      {item.notes && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {item.sku}
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      📍 {item.location}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                          onClick={() => handleQuickDelta(item.id, -1)}
                          title="Restar 1"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                          onClick={() => handleQuickDelta(item.id, 1)}
                          title="Sumar 1"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {item.unit}
                    </td>
                    <td>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color }}>
                        <Icon size={12} /> {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                          onClick={() => handleOpenMovement(item)}
                          title="Entrada / Salida"
                        >
                          <ArrowUpDown size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                          onClick={() => handleOpenEdit(item)}
                          title="Editar"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem', color: '#ef4444', borderColor: '#ef444433' }}
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Movimiento de Stock (Entrada / Salida) */}
      {movementModal.isOpen && movementModal.item && (
        <div className="modal-overlay" onClick={() => setMovementModal({ ...movementModal, isOpen: false })}>
          <div className="modal-content glass-card" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowUpDown size={20} color="#3b82f6" />
                Registrar Movimiento de Stock
              </h3>
              <button
                className="btn btn-outline btn-icon-only"
                onClick={() => setMovementModal({ ...movementModal, isOpen: false })}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmMovement} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Material</label>
                <input className="input-field" value={movementModal.item.name} disabled style={{ opacity: 0.8 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Tipo de Movimiento</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn ${movementModal.type === 'Entrada' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMovementModal({ ...movementModal, type: 'Entrada' })}
                  >
                    📥 Entrada (Compra / Recepción)
                  </button>
                  <button
                    type="button"
                    className={`btn ${movementModal.type === 'Salida' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMovementModal({ ...movementModal, type: 'Salida' })}
                  >
                    📤 Salida (Despacho a Obra)
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Cantidad ({movementModal.item.unit})
                </label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  value={movementModal.quantity}
                  onChange={e => setMovementModal({ ...movementModal, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Motivo / Justificación</label>
                <input
                  className="input-field"
                  placeholder="ej. Recepción proveedor o Despacho a Torre A"
                  value={movementModal.motive}
                  onChange={e => setMovementModal({ ...movementModal, motive: e.target.value })}
                />
              </div>

              <div className="form-actions" style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setMovementModal({ ...movementModal, isOpen: false })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar {movementModal.type}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
