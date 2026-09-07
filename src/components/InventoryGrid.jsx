import React from 'react';
import { Edit3, Trash2, ArrowUpDown, MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function InventoryGrid({ items, onEdit, onDelete, onQuickStockChange, onRecordMovement }) {
  if (items.length === 0) {
    return null; // Table component already renders empty state
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="inventory-grid">
      {items.map((item) => {
        const rowTotal = item.quantity * item.unitPrice;
        const stockRatio = Math.min(100, Math.round((item.quantity / (item.minQuantity * 2 || 1)) * 100));
        
        let meterColor = 'var(--accent-emerald)';
        if (item.quantity === 0) meterColor = 'var(--accent-rose)';
        else if (item.quantity <= item.minQuantity) meterColor = 'var(--accent-amber)';

        return (
          <div key={item.id} className="glass-card item-card">
            <div>
              <div className="item-card-header">
                <span className="item-code">{item.sku || item.id}</span>
                <span className="badge badge-blue">{item.category}</span>
              </div>

              <h3 className="item-title">{item.name}</h3>
              
              <div className="item-meta">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>

              <div style={{ margin: '0.75rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stock Disponible:</span>
                  <span style={{ fontWeight: 700 }}>
                    {item.quantity} / {item.minQuantity} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.unit}</span>
                  </span>
                </div>

                <div className="stock-meter-container">
                  <div 
                    className="stock-meter-bar" 
                    style={{ width: `${stockRatio}%`, background: meterColor }}
                  />
                </div>
              </div>

              {item.notes && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                  "{item.notes}"
                </p>
              )}
            </div>

            <div className="item-card-footer">
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Valor Total</span>
                <span className="price-tag">{formatCurrency(rowTotal)}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>
                  ({formatCurrency(item.unitPrice)} / {item.unit})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  className="btn btn-outline btn-icon-only" 
                  onClick={() => onRecordMovement(item)}
                  title="Movimiento Entrada/Salida"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  <ArrowUpDown size={15} />
                </button>
                <button 
                  className="btn btn-outline btn-icon-only" 
                  onClick={() => onEdit(item)}
                  title="Editar Insumo"
                >
                  <Edit3 size={15} />
                </button>
                <button 
                  className="btn btn-danger btn-icon-only" 
                  onClick={() => onDelete(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
