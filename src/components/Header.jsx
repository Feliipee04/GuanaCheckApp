import React from 'react';
import { HardHat, PlusCircle, ArrowUpDown, History, BarChart3, Github, Download, Upload, HelpCircle } from 'lucide-react';

export default function Header({ 
  onOpenAddItem, 
  onOpenMovement, 
  onOpenHistory, 
  onOpenAnalytics, 
  onOpenGithubGuide,
  onExportCSV,
  onExportJSON,
  onImportJSON 
}) {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  return (
    <header className="glass-card header-wrapper">
      <div className="logo-section">
        <div className="logo-icon-bg">
          <HardHat size={28} />
        </div>
        <div>
          <h1 className="logo-title">BuildStock <span style={{ color: 'var(--accent-amber)' }}>Pro</span></h1>
          <p className="logo-subtitle">Control de Inventario y Obras</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={onOpenAddItem}>
          <PlusCircle size={18} />
          Nuevo Material
        </button>

        <button className="btn btn-secondary" onClick={onOpenMovement}>
          <ArrowUpDown size={18} />
          Entrada / Salida
        </button>

        <button className="btn btn-outline" onClick={onOpenHistory} title="Ver Historial de Movimientos">
          <History size={18} />
          Historial
        </button>

        <button className="btn btn-outline" onClick={onOpenAnalytics} title="Ver Métricas y Gráficos">
          <BarChart3 size={18} />
          Reportes
        </button>

        <button className="btn btn-outline" onClick={onExportCSV} title="Exportar a Excel / CSV">
          <Download size={18} />
          CSV
        </button>

        <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} title="Importar JSON">
          <Upload size={18} />
          Importar
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          style={{ display: 'none' }} 
        />

        <button className="btn btn-outline" onClick={onOpenGithubGuide} style={{ color: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }}>
          <Github size={18} />
          GitHub Pages
        </button>
      </div>
    </header>
  );
}
