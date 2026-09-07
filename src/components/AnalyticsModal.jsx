import React from 'react';
import { X, PieChart, TrendingUp, AlertTriangle, Layers, DollarSign } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose, items }) {
  if (!isOpen) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Group valuation by Category
  const categoryStats = items.reduce((acc, item) => {
    const cat = item.category || 'Sin Categoría';
    const val = item.quantity * item.unitPrice;
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalVal: 0, items: [] };
    }
    acc[cat].count += 1;
    acc[cat].totalVal += val;
    acc[cat].items.push(item);
    return acc;
  }, {});

  const totalInventoryValuation = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // Group valuation by Location
  const locationStats = items.reduce((acc, item) => {
    const loc = item.location || 'Sin Ubicación';
    const val = item.quantity * item.unitPrice;
    if (!acc[loc]) {
      acc[loc] = { count: 0, totalVal: 0 };
    }
    acc[loc].count += 1;
    acc[loc].totalVal += val;
    return acc;
  }, {});

  const criticalItems = items.filter(i => i.quantity <= i.minQuantity);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={24} style={{ color: 'var(--accent-emerald)' }} />
              Analítica de Inventario & Métricas
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Resumen ejecutivo de inversión, distribución de materiales y alertas de stock.
            </p>
          </div>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Distribution by Category */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} style={{ color: 'var(--accent-amber)' }} />
              Valor por Categoría
            </h3>

            {Object.entries(categoryStats).map(([category, stat]) => {
              const percent = totalInventoryValuation > 0 ? Math.round((stat.totalVal / totalInventoryValuation) * 100) : 0;
              return (
                <div key={category} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    <span>{category} ({stat.count})</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{formatCurrency(stat.totalVal)} ({percent}%)</strong>
                  </div>
                  <div className="stock-meter-container" style={{ margin: 0 }}>
                    <div 
                      className="stock-meter-bar" 
                      style={{ width: `${percent}%`, background: 'var(--accent-blue)' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distribution by Location */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={18} style={{ color: 'var(--accent-blue)' }} />
              Inversión por Obra / Sitio
            </h3>

            {Object.entries(locationStats).map(([location, stat]) => {
              const percent = totalInventoryValuation > 0 ? Math.round((stat.totalVal / totalInventoryValuation) * 100) : 0;
              return (
                <div key={location} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                    <span>📍 {location}</span>
                    <strong style={{ color: 'var(--accent-amber)' }}>{formatCurrency(stat.totalVal)}</strong>
                  </div>
                  <div className="stock-meter-container" style={{ margin: 0 }}>
                    <div 
                      className="stock-meter-bar" 
                      style={{ width: `${percent}%`, background: 'var(--accent-amber)' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Critical Low Stock Items Panel */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={18} />
            Materiales Críticos que Requieren Reabastecimiento ({criticalItems.length})
          </h3>

          {criticalItems.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              🎉 Todo el inventario se encuentra sobre el nivel mínimo de stock.
            </p>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Insumo</th>
                    <th>Categoría</th>
                    <th>Ubicación</th>
                    <th>Stock Actual</th>
                    <th>Mínimo Requerido</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalItems.map(item => (
                    <tr key={item.id}>
                      <td><strong>{item.name}</strong> ({item.sku})</td>
                      <td>{item.category}</td>
                      <td>{item.location}</td>
                      <td style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>
                        {item.quantity} {item.unit}
                      </td>
                      <td>{item.minQuantity} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}
