import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

export default function ItemModal({ isOpen, onClose, onSave, itemToEdit, categories, locations }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: categories[1] || 'Materiales Basicos',
    quantity: 0,
    minQuantity: 10,
    unit: 'unidades',
    unitPrice: 0,
    location: locations[1] || 'Almacen Central',
    notes: ''
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        sku: itemToEdit.sku || '',
        name: itemToEdit.name || '',
        category: itemToEdit.category || categories[1],
        quantity: itemToEdit.quantity ?? 0,
        minQuantity: itemToEdit.minQuantity ?? 10,
        unit: itemToEdit.unit || 'unidades',
        unitPrice: itemToEdit.unitPrice ?? 0,
        location: itemToEdit.location || locations[1],
        notes: itemToEdit.notes || ''
      });
    } else {
      setFormData({
        sku: `MAT-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        category: categories[1] || 'Materiales Basicos',
        quantity: 10,
        minQuantity: 5,
        unit: 'unidades',
        unitPrice: 10,
        location: locations[1] || 'Almacen Central',
        notes: ''
      });
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      unitPrice: Number(formData.unitPrice),
      id: itemToEdit ? itemToEdit.id : `ITEM-${Date.now()}`,
      status: Number(formData.quantity) === 0 ? 'Agotado' : Number(formData.quantity) <= Number(formData.minQuantity) ? 'Stock Bajo' : 'Disponible',
      lastUpdated: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {itemToEdit ? 'Editar Material de Construcción' : 'Nuevo Material o Equipo'}
          </h2>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Código SKU / Referencia</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ej. MAT-CEM-001"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nombre del Insumo / Equipo</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Cemento Portland Tipo I"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select 
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.filter(c => c !== 'Todos').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación / Obra Asignada</label>
              <select 
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {locations.filter(l => l !== 'Todas las Ubicaciones').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad Actual</label>
              <input 
                type="number" 
                min="0"
                className="form-control"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Mínimo (Alerta)</label>
              <input 
                type="number" 
                min="0"
                className="form-control"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unidad de Medida</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="Ej. sacos, piezas, m³, kg, m"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Precio Unitario ($)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-control"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notas / Observaciones</label>
              <textarea 
                className="form-control"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles sobre proveedores, estado, mantenimiento o especificaciones técnicas..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {itemToEdit ? 'Guardar Cambios' : 'Crear Insumo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
