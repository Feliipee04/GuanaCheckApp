import React, { useState } from 'react';
import { ShieldAlert, LogIn, Lock, User, CheckCircle2 } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [username, setUsername] = useState('supervisor@guanacheck.com');
  const [password, setPassword] = useState('123456');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = username.includes('@')
      ? username.split('@')[0].replace('.', ' ').toUpperCase()
      : username;
    onLogin({
      name: displayName || 'Supervisor de Obra',
      email: username,
      role: 'Supervisor HSE / Residente'
    }, remember);
  };

  const handleQuickLogin = () => {
    onLogin({
      name: 'Ing. Supervisor',
      email: 'supervisor@guanacheck.com',
      role: 'Supervisor General HSE'
    }, true);
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        {/* Logo */}
        <div className="login-header">
          <div className="login-logo-icon">
            <ShieldAlert size={36} color="#f59e0b" />
          </div>
          <h1 className="login-title">
            Guana<span style={{ color: '#f59e0b' }}>Check</span><span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '4px' }}>App</span>
          </h1>
          <p className="login-subtitle">
            Sistema Integral de Gestión de Obras, HSE e Inventarios
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-label">Usuario / Correo</label>
            <div className="login-input-wrapper">
              <User size={18} className="login-icon" />
              <input
                type="text"
                className="input-field login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. supervisor@guanacheck.com"
                required
              />
            </div>
          </div>

          <div className="login-field-group">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-icon" />
              <input
                type="password"
                className="input-field login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="login-options">
            <label className="login-checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordar sesión</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            className="btn btn-outline login-quick-btn"
            onClick={handleQuickLogin}
          >
            <CheckCircle2 size={16} style={{ color: '#10b981' }} />
            <span>Acceso Rápido (Supervisor)</span>
          </button>
        </form>

        <div className="login-footer">
          <span>Acceso seguro a los 5 módulos operativos</span>
        </div>
      </div>
    </div>
  );
}
