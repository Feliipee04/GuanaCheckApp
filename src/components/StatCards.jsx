import React from 'react';
import { Package, AlertTriangle, AlertOctagon, DollarSign, MapPin } from 'lucide-react';

export default function StatCards({ items }) {
  const totalItems = items.length;

  const totalValuation = items.reduce((acc, item) => {
    return acc + (Number(item.quantity || 0) * Number(item.unitPrice || 0));
  }, 0);

  const lowStockCount = items.filter(item => item.quantity > 0 && item.quantity <= item.minQuantity).length;
  const outOfStockCount = items.filter(item => item.quantity === 0).length;

  const uniqueLocationsCount = new Set(items.map(i => i.location)).size;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="stats-grid">
      <div className="glass-card stat-card amber">
        <div className="stat-icon-wrapper amber">
          <Package size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Insumos</span>
          <span className="stat-value">{totalItems} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ítems</span></span>
        </div>
      </div>

      <div className="glass-card stat-card emerald">
        <div className="stat-icon-wrapper emerald">
          <DollarSign size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Valor del Inventario</span>
          <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{formatCurrency(totalValuation)}</span>
        </div>
      </div>

      <div className="glass-card stat-card rose">
        <div className="stat-icon-wrapper rose">
          <AlertTriangle size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Stock Bajo / Alerta</span>
          <span className="stat-value" style={{ color: lowStockCount > 0 ? 'var(--accent-amber)' : 'inherit' }}>
            {lowStockCount}
          </span>
        </div>
      </div>

      <div className="glass-card stat-card rose">
        <div className="stat-icon-wrapper rose" style={{ background: 'rgba(239,68,68,0.25)', color: '#ef4444' }}>
          <AlertOctagon size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Agotados</span>
          <span className="stat-value" style={{ color: outOfStockCount > 0 ? 'var(--accent-rose)' : 'inherit' }}>
            {outOfStockCount}
          </span>
        </div>
      </div>

      <div className="glass-card stat-card blue">
        <div className="stat-icon-wrapper blue">
          <MapPin size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-label">Puntos / Obras</span>
          <span className="stat-value">{uniqueLocationsCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ubicaciones</span></span>
        </div>
      </div>
    </div>
  );
}
