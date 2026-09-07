import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import InventoryTable from './components/InventoryTable';
import InventoryGrid from './components/InventoryGrid';
import ItemModal from './components/ItemModal';
import StockMovementModal from './components/StockMovementModal';
import MovementsHistoryModal from './components/MovementsHistoryModal';
import AnalyticsModal from './components/AnalyticsModal';
import GithubPagesGuideModal from './components/GithubPagesGuideModal';

import { initialInventory, initialCategories, initialLocations } from './data/initialData';
import { Search, LayoutGrid, List, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  // Load state from localStorage or initial fallback
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('buildstock_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem('buildstock_movements');
    return saved ? JSON.parse(saved) : [
      {
        id: 'MOV-001',
        itemId: 'ITEM-101',
        itemName: 'Cemento Portland Tipo I (50kg)',
        sku: 'MAT-CEM-001',
        type: 'Entrada',
        quantity: 50,
        unit: 'sacos',
        operator: 'Ing. Mateo Gómez',
        location: 'Almacen Central',
        motive: 'Recepción Factura #9812 - Holcim',
        date: new Date(Date.now() - 86400000).toLocaleString('es-MX')
      }
    ];
  });

  const [categories] = useState(initialCategories);
  const [locations] = useState(initialLocations);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas las Ubicaciones');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  
  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [preSelectedItem, setPreSelectedItem] = useState(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('buildstock_inventory', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('buildstock_movements', JSON.stringify(movements));
  }, [movements]);

  // Handlers
  const handleSaveItem = (savedItem) => {
    if (itemToEdit) {
      setItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i));
      showToast(`✏️ Se actualizó correctamente "${savedItem.name}"`);
    } else {
      setItems(prev => [savedItem, ...prev]);
      showToast(`✅ Se agregó "${savedItem.name}" al inventario`);
    }
    setItemToEdit(null);
  };

  const handleDeleteItem = (id) => {
    const item = items.find(i => i.id === id);
    if (window.confirm(`¿Estás seguro de eliminar "${item?.name || 'este insumo'}" del inventario?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
      showToast(`🗑️ Se eliminó "${item?.name}"`);
    }
  };

  const handleQuickStockChange = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        let newStatus = 'Disponible';
        if (newQty === 0) newStatus = 'Agotado';
        else if (newQty <= item.minQuantity) newStatus = 'Stock Bajo';

        return {
          ...item,
          quantity: newQty,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const handleSaveMovement = (movement) => {
    // Update movement log
    setMovements(prev => [movement, ...prev]);

    // Update item stock
    setItems(prev => prev.map(item => {
      if (item.id === movement.itemId) {
        const delta = movement.type === 'Entrada' ? movement.quantity : -movement.quantity;
        const newQty = Math.max(0, item.quantity + delta);
        let newStatus = 'Disponible';
        if (newQty === 0) newStatus = 'Agotado';
        else if (newQty <= item.minQuantity) newStatus = 'Stock Bajo';

        return {
          ...item,
          quantity: newQty,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));

    showToast(`📦 Registrado: ${movement.type} de ${movement.quantity} ${movement.unit} de "${movement.itemName}"`);
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Deseas vaciar el historial de movimientos registrados?')) {
      setMovements([]);
      showToast('🧹 Historial de movimientos limpiado');
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('¿Restablecer el inventario con los datos de muestra iniciales?')) {
      setItems(initialInventory);
      localStorage.removeItem('buildstock_inventory');
      showToast('🔄 Inventario restablecido a datos de muestra');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Nombre', 'Categoria', 'Ubicacion', 'Stock', 'Minimo', 'Unidad', 'PrecioUnitario', 'Total', 'Estado', 'Notas'];
    const rows = items.map(i => [
      i.id,
      `"${i.sku}"`,
      `"${i.name}"`,
      `"${i.category}"`,
      `"${i.location}"`,
      i.quantity,
      i.minQuantity,
      `"${i.unit}"`,
      i.unitPrice,
      (i.quantity * i.unitPrice).toFixed(2),
      `"${i.status}"`,
      `"${i.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventario-construccion-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Inventario exportado en formato CSV');
  };

  // JSON Export
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `buildstock-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Copia de seguridad JSON descargada');
  };

  // JSON Import
  const handleImportJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setItems(importedData);
          showToast(`✅ Importados ${importedData.length} elementos al inventario`);
        } else {
          alert('El archivo JSON no contiene un formato de inventario válido.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered Items logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas las Ubicaciones' || item.location === selectedLocation;
    
    let matchesStatus = true;
    if (statusFilter === 'Disponible') matchesStatus = item.quantity > item.minQuantity;
    else if (statusFilter === 'Bajo') matchesStatus = item.quantity > 0 && item.quantity <= item.minQuantity;
    else if (statusFilter === 'Agotado') matchesStatus = item.quantity === 0;

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Header Navigation */}
      <Header 
        onOpenAddItem={() => { setItemToEdit(null); setIsItemModalOpen(true); }}
        onOpenMovement={() => { setPreSelectedItem(null); setIsMovementModalOpen(true); }}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenGithubGuide={() => setIsGithubGuideOpen(true)}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Top Stat Dashboard */}
      <StatCards items={items} />

      {/* Category Pills Slider */}
      <div className="category-pills">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Controls Bar */}
      <div className="glass-card controls-bar">
        <div className="search-input-group">
          <Search size={18} />
          <input 
            type="text"
            className="search-input"
            placeholder="Buscar material por nombre, código SKU o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Location selector */}
          <select 
            className="select-custom"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Status selector */}
          <select 
            className="select-custom"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Disponible">Disponible (Normal)</option>
            <option value="Bajo">Stock Bajo (Alerta)</option>
            <option value="Agotado">Agotado (0 unidades)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista de Tabla"
            >
              <List size={16} />
              Tabla
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista de Tarjetas"
            >
              <LayoutGrid size={16} />
              Tarjetas
            </button>
          </div>

          <button 
            className="btn btn-outline" 
            onClick={handleResetSampleData}
            title="Restablecer datos de prueba"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <InventoryTable 
          items={filteredItems}
          onEdit={(item) => { setItemToEdit(item); setIsItemModalOpen(true); }}
          onDelete={handleDeleteItem}
          onQuickStockChange={handleQuickStockChange}
          onRecordMovement={(item) => { setPreSelectedItem(item); setIsMovementModalOpen(true); }}
        />
      ) : (
        <InventoryGrid 
          items={filteredItems}
          onEdit={(item) => { setItemToEdit(item); setIsItemModalOpen(true); }}
          onDelete={handleDeleteItem}
          onQuickStockChange={handleQuickStockChange}
          onRecordMovement={(item) => { setPreSelectedItem(item); setIsMovementModalOpen(true); }}
        />
      )}

      {/* Modals */}
      <ItemModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        categories={categories}
        locations={locations}
      />

      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        items={items}
        preSelectedItem={preSelectedItem}
        onSaveMovement={handleSaveMovement}
        locations={locations}
      />

      <MovementsHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        movements={movements}
        onClearMovements={handleClearHistory}
      />

      <AnalyticsModal 
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        items={items}
      />

      <GithubPagesGuideModal 
        isOpen={isGithubGuideOpen}
        onClose={() => setIsGithubGuideOpen(false)}
      />

      {/* Toast popup */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={20} style={{ color: 'var(--accent-amber)' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
