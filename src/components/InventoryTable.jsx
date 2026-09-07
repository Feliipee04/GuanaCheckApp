import React from 'react';
import { Edit3, Trash2, ArrowUpDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function InventoryTable({ items, onEdit, onDelete, onQuickStockChange, onRecordMovement }) {
  if (items.length === 0) {
    return (
      <div className="glass-card empty-state">
        <AlertTriangle size={48} style={{ color: 'var(--accent-amber)' }} />
        <h3>No se encontraron insumos de construcción</h3>
        <p>Intenta ajustar la búsqueda o agrega un nuevo material a tu inventario.</p>
      </div>
    );
  }

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(val);
  };

  const getStatusBadge = (item) => {
    if (item.quantity === 0) {
      return (
        <span className="badge badge-rose">
          <XCircle size={13} /> Agotado
        </span>
      );
    }
    if (item.quantity <= item.minQuantity) {
      return (
        <span className="badge badge-amber animate-pulse">
          <AlertTriangle size={13} /> Stock Bajo ({item.quantity}/{item.minQuantity})
        </span>
      );
    }
    return (
      <span className="badge badge-emerald">
        <CheckCircle size={13} /> Disponible
      </span>
    );
  };

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>SKU / Código</th>
            <th>Material / Insumo</th>
            <th>Categoría</th>
            <th>Ubicación / Obra</th>
            <th>Stock Actual</th>
            <th>Precio Unit.</th>
            <th>Total ($)</th>
            <th>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const rowTotal = item.quantity * item.unitPrice;
            return (
              <tr key={item.id}>
                <td>
                  <span className="item-code">{item.sku || item.id}</span>
                </td>
                <td>
                  <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                  {item.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {item.notes}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-blue">{item.category}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📍 {item.location}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline btn-icon-only" 
                      onClick={() => onQuickStockChange(item.id, -1)}
                      title="Disminuir -1"
                      style={{ width: '26px', height: '26px', padding: 0 }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                      {item.quantity} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.unit}</span>
                    </span>
                    <button 
                      className="btn btn-outline btn-icon-only" 
                      onClick={() => onQuickStockChange(item.id, 1)}
                      title="Aumentar +1"
                      style={{ width: '26px', height: '26px', padding: 0 }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  {formatCurrency(rowTotal)}
                </td>
                <td>{getStatusBadge(item)}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    <button 
                      className="btn btn-outline btn-icon-only" 
                      onClick={() => onRecordMovement(item)}
                      title="Registrar Movimiento (Entrada/Salida)"
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
                      title="Eliminar Insumo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
