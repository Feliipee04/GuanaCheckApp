import React from 'react';
import { X, Github, Terminal, CheckCircle2, Globe, Rocket } from 'lucide-react';

export default function GithubPagesGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Github size={24} style={{ color: 'var(--accent-amber)' }} />
              Guía de Despliegue en GitHub Pages
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Aprende cómo ejecutar localmente y publicar esta app gratis en GitHub Pages.
            </p>
          </div>
          <button className="btn btn-outline btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1: Run locally */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Terminal size={18} />
              1. Ejecución Local (Servidor de Desarrollo)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              En la terminal dentro de esta carpeta, ejecuta:
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--accent-amber)' }}>
              npm start
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
              Esto iniciará el servidor local Vite en <code style={{ color: '#fff' }}>http://localhost:3000</code>.
            </p>
          </div>

          {/* Step 2: Push to GitHub */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Github size={18} />
              2. Crear y Vincular Repositorio en GitHub
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Crea un repositorio en GitHub (ej. <code style={{ color: '#fff' }}>inventario-construccion</code>) y sube tu código:
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              git init<br />
              git add .<br />
              git commit -m "Initial commit - BuildStock Pro"<br />
              git branch -M main<br />
              git remote add origin https://github.com/TU-USUARIO/inventario-construccion.git<br />
              git push -u origin main
            </div>
          </div>

          {/* Step 3: Deploy to GitHub Pages */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Rocket size={18} />
              3. Publicar en GitHub Pages con 1 Comando
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Este proyecto ya incluye el paquete <code style={{ color: '#fff' }}>gh-pages</code> configurado en <code style={{ color: '#fff' }}>package.json</code>. Simplemente ejecuta:
            </p>
            <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--accent-emerald)' }}>
              npm run deploy
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Este comando compilará el sitio (<code style={{ color: '#fff' }}>npm run build</code>) y lo publicará automáticamente en la rama <code style={{ color: 'var(--accent-amber)' }}>gh-pages</code> de tu repositorio.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
              <Globe size={16} />
              Tu sitio estará visible en: <code style={{ color: '#fff' }}>https://TU-USUARIO.github.io/inventario-construccion/</code>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Entendido, ¡Listo!
          </button>
        </div>
      </div>
    </div>
  );
}
