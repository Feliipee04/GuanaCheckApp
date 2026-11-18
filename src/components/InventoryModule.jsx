import React, { useState, useEffect } from 'react';
import InventoryTable from './InventoryTable';
import InventoryGrid from './InventoryGrid';
import ItemModal from './ItemModal';
import StockMovementModal from './StockMovementModal';
import MovementsHistoryModal from './MovementsHistoryModal';
import AnalyticsModal from './AnalyticsModal';
import StatCards from './StatCards';

import { initialInventory, initialCategories, initialLocations } from '../data/initialData';
import { Package, PlusCircle, Search, LayoutGrid, List, ArrowUpDown, History, BarChart3, Download, Upload, RotateCcw } from 'lucide-react';

export default function InventoryModule({ showToast }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('guanacheck_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem('guanacheck_movements');
    return saved ? JSON.parse(saved) : [{
      id: 'MOV-001', itemId: 'ITEM-101',
      itemName: 'Cemento Portland Tipo I (50kg)', sku: 'MAT-CEM-001',
      type: 'Entrada', quantity: 50, unit: 'sacos',
      operator: 'Ing. Mateo Gómez', location: 'Almacen Central',
      motive: 'Recepción Factura #9812', date: new Date(Date.now() - 86400000).toLocaleString('es-MX')
    }];
  });

  const [categories] = useState(initialCategories);
  const [locations]  = useState(initialLocations);

  const [searchTerm, setSearchTerm]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas las Ubicaciones');
  const [statusFilter, setStatusFilter]         = useState('Todos');
  const [viewMode, setViewMode]                 = useState('table');

  const [isItemModalOpen, setIsItemModalOpen]   = useState(false);
  const [itemToEdit, setItemToEdit]             = useState(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [preSelectedItem, setPreSelectedItem]   = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen]   = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  useEffect(() => { localStorage.setItem('guanacheck_inventory', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('guanacheck_movements', JSON.stringify(movements)); }, [movements]);

  const handleSaveItem = (savedItem) => {
    if (itemToEdit) {
      setItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i));
      showToast(`✏️ Se actualizó "${savedItem.name}"`);
    } else {
      setItems(prev => [savedItem, ...prev]);
      showToast(`✅ Se agregó "${savedItem.name}" al inventario`);
    }
    setItemToEdit(null);
  };

  const handleDeleteItem = (id) => {
    const item = items.find(i => i.id === id);
    if (window.confirm(`¿Eliminar "${item?.name}" del inventario?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      showToast(`🗑️ Se eliminó "${item?.name}"`);
    }
  };

  const handleQuickStockChange = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(0, item.quantity + delta);
      let newStatus = 'Disponible';
      if (newQty === 0) newStatus = 'Agotado';
      else if (newQty <= item.minQuantity) newStatus = 'Stock Bajo';
      return { ...item, quantity: newQty, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
    }));
  };

  const handleSaveMovement = (movement) => {
    setMovements(prev => [movement, ...prev]);
    setItems(prev => prev.map(item => {
      if (item.id !== movement.itemId) return item;
      const delta = movement.type === 'Entrada' ? movement.quantity : -movement.quantity;
      const newQty = Math.max(0, item.quantity + delta);
      let newStatus = 'Disponible';
      if (newQty === 0) newStatus = 'Agotado';
      else if (newQty <= item.minQuantity) newStatus = 'Stock Bajo';
      return { ...item, quantity: newQty, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
    }));
    showToast(`📦 ${movement.type}: ${movement.quantity} ${movement.unit} de "${movement.itemName}"`);
  };

  const handleExportCSV = () => {
    const headers = ['ID','SKU','Nombre','Categoria','Ubicacion','Stock','Minimo','Unidad','PrecioUnitario','Total','Estado','Notas'];
    const rows = items.map(i => [i.id,`"${i.sku}"`,`"${i.name}"`,`"${i.category}"`,`"${i.location}"`,i.quantity,i.minQuantity,`"${i.unit}"`,i.unitPrice,(i.quantity*i.unitPrice).toFixed(2),`"${i.status}"`,`"${i.notes||''}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `guanacheck-inventario-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('📥 Inventario exportado en CSV');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `guanacheck-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a); a.click(); a.remove();
    showToast('📥 Copia de seguridad JSON descargada');
  };

  const handleImportJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) { setItems(data); showToast(`✅ Importados ${data.length} elementos`); }
        else alert('Formato de JSON no válido.');
      } catch { alert('Error al leer el archivo JSON.'); }
    };
    reader.readAsText(file);
  };

  const fileInputRef = React.useRef(null);

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat  = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchLoc  = selectedLocation === 'Todas las Ubicaciones' || item.location === selectedLocation;
    let matchStatus = true;
    if (statusFilter === 'Disponible') matchStatus = item.quantity > item.minQuantity;
    else if (statusFilter === 'Bajo')  matchStatus = item.quantity > 0 && item.quantity <= item.minQuantity;
    else if (statusFilter === 'Agotado') matchStatus = item.quantity === 0;
    return matchSearch && matchCat && matchLoc && matchStatus;
  });

  return (
    <div className="module-view">
      {/* Header */}
      <div className="module-header">
        <div className="module-title-group">
          <div className="module-icon-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 className="module-title">Inventario</h2>
            <p className="module-subtitle">Control de materiales, insumos y stock</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => { setItemToEdit(null); setIsItemModalOpen(true); }}>
            <PlusCircle size={17} /> Nuevo Material
          </button>
          <button className="btn btn-secondary" onClick={() => { setPreSelectedItem(null); setIsMovementModalOpen(true); }}>
            <ArrowUpDown size={17} /> Entrada/Salida
          </button>
          <button className="btn btn-outline" onClick={() => setIsHistoryModalOpen(true)} title="Historial">
            <History size={17} />
          </button>
          <button className="btn btn-outline" onClick={() => setIsAnalyticsModalOpen(true)} title="Reportes">
            <BarChart3 size={17} />
          </button>
          <button className="btn btn-outline" onClick={handleExportCSV} title="Exportar CSV">
            <Download size={17} />
          </button>
          <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} title="Importar JSON">
            <Upload size={17} />
          </button>
          <input type="file" ref={fileInputRef} onChange={e => { if(e.target.files[0]) { handleImportJSON(e.target.files[0]); e.target.value=''; } }} accept=".json" style={{ display: 'none' }} />
        </div>
      </div>

      {/* Stat Cards */}
      <StatCards items={items} />

      {/* Category Pills */}
      <div className="pill-row">
        {categories.map(cat => (
          <button key={cat} className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="glass-card controls-bar">
        <div className="search-input-group">
          <Search size={18} />
          <input type="text" className="search-input" placeholder="Buscar por nombre, SKU o nota..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select className="select-custom" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <select className="select-custom" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="Todos">Todos los Estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Bajo">Stock Bajo</option>
            <option value="Agotado">Agotado</option>
          </select>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}><List size={16}/> Tabla</button>
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={16}/> Tarjetas</button>
          </div>
          <button className="btn btn-outline" onClick={() => { if(window.confirm('¿Restablecer datos de muestra?')) { setItems(initialInventory); localStorage.removeItem('guanacheck_inventory'); showToast('🔄 Restablecido'); }}} style={{ padding: '0.45rem 0.65rem' }}>
            <RotateCcw size={16}/>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <InventoryTable items={filteredItems}
          onEdit={item => { setItemToEdit(item); setIsItemModalOpen(true); }}
          onDelete={handleDeleteItem}
          onQuickStockChange={handleQuickStockChange}
          onRecordMovement={item => { setPreSelectedItem(item); setIsMovementModalOpen(true); }} />
      ) : (
        <InventoryGrid items={filteredItems}
          onEdit={item => { setItemToEdit(item); setIsItemModalOpen(true); }}
          onDelete={handleDeleteItem}
          onQuickStockChange={handleQuickStockChange}
          onRecordMovement={item => { setPreSelectedItem(item); setIsMovementModalOpen(true); }} />
      )}

      {/* Modals */}
      <ItemModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem} itemToEdit={itemToEdit} categories={categories} locations={locations} />
      <StockMovementModal isOpen={isMovementModalOpen} onClose={() => setIsMovementModalOpen(false)}
        items={items} preSelectedItem={preSelectedItem} onSaveMovement={handleSaveMovement} locations={locations} />
      <MovementsHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)}
        movements={movements} onClearMovements={() => { if(window.confirm('¿Vaciar historial?')) { setMovements([]); showToast('🧹 Historial limpiado'); }}} />
      <AnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} items={items} />
    </div>
  );
}
