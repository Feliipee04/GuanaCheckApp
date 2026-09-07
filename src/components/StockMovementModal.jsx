import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function StockMovementModal({ isOpen, onClose, items, preSelectedItem, onSaveMovement, locations }) {
  const [selectedItemId, setSelectedItemId] = useState(preSelectedItem ? preSelectedItem.id : (items[0]?.id || ''));
  const [type, setType] = useState('Salida'); // Entrada / Salida
  const [quantity, setQuantity] = useState(1);
  const [operator, setOperator] = useState('');
  const [siteLocation, setSiteLocation] = useState(locations[1] || 'Obra Central');
  const [motive, setMotive] = useState('');

  if (!isOpen) return null;

  const currentItem = items.find(i => i.id === selectedItemId) || items[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentItem || quantity <= 0) return;

    onSaveMovement({
      id: `MOV-${Date.now()}`,
      itemId: currentItem.id,
      itemName: currentItem.name,
      sku: currentItem.sku,
      type, // 'Entrada' or 'Salida'
      quantity: Number(quantity),
      unit: currentItem.unit,
      operator: operator || 'Operador General',
      location: siteLocation,
      motive: motive || (type === 'Entrada' ? 'Compra / Proveedor' : 'Uso en Obra'),
      date: new Date().toLocaleString('es-MX')
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Registrar Movimiento de Inventario
          </h2>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Seleccionar Material / Equipo</label>
            <select 
              className="form-control"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) - Stock actual: {item.quantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Tipo de Movimiento</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <button 
                  type="button" 
                  className={`btn ${type === 'Entrada' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, background: type === 'Entrada' ? 'var(--accent-emerald)' : undefined, color: type === 'Entrada' ? '#ffffff' : undefined }}
                  onClick={() => setType('Entrada')}
                >
                  <ArrowDownRight size={16} />
                  Entrada (Ingreso)
                </button>

                <button 
                  type="button" 
                  className={`btn ${type === 'Salida' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, background: type === 'Salida' ? 'var(--accent-amber)' : undefined, color: type === 'Salida' ? '#0f172a' : undefined }}
                  onClick={() => setType('Salida')}
                >
                  <ArrowUpRight size={16} />
                  Salida (Despacho)
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cantidad ({currentItem?.unit || 'unidades'})</label>
              <input 
                type="number" 
                min="1"
                max={type === 'Salida' ? currentItem?.quantity : 999999}
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              {type === 'Salida' && currentItem && Number(quantity) > currentItem.quantity && (
                <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>
                  Advertencia: Cantidad supera stock disponible ({currentItem.quantity})
                </span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Obra / Destino</label>
              <select 
                className="form-control"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
              >
                {locations.filter(l => l !== 'Todas las Ubicaciones').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Responsable / Operador</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Ej. Ing. Carlos Pérez"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Motivo o N° de Vale de Despacho</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Ej. Vale #4021 para Vaciado de cimientos"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={18} />
              Confirmar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
