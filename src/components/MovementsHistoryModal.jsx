import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Search, FileText } from 'lucide-react';

export default function MovementsHistoryModal({ isOpen, onClose, movements, onClearMovements }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMovements = movements.filter(m => 
    m.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.motive.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} style={{ color: 'var(--accent-amber)' }} />
              Historial Auditable de Movimientos
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Registro cronológico de entradas y salidas de material de obra.
            </p>
          </div>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div className="search-input-group" style={{ maxWidth: '400px' }}>
            <Search size={16} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Buscar por insumo, responsable u obra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {movements.length > 0 && (
            <button className="btn btn-danger" onClick={onClearMovements} style={{ fontSize: '0.8rem' }}>
              Limpiar Historial
            </button>
          )}
        </div>

        {filteredMovements.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p>No se encontraron registros de movimiento.</p>
          </div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Obra / Destino</th>
                  <th>Responsable</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mov.date}</td>
                    <td>
                      {mov.type === 'Entrada' ? (
                        <span className="badge badge-emerald">
                          <ArrowDownRight size={12} /> Entrada
                        </span>
                      ) : (
                        <span className="badge badge-amber">
                          <ArrowUpRight size={12} /> Salida
                        </span>
                      )}
                    </td>
                    <td>
                      <strong>{mov.itemName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{mov.sku}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: mov.type === 'Entrada' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                      {mov.type === 'Entrada' ? `+${mov.quantity}` : `-${mov.quantity}`} {mov.unit}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>📍 {mov.location}</td>
                    <td style={{ fontSize: '0.85rem' }}>👷 {mov.operator}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mov.motive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
