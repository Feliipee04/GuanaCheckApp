# 🏗️ BuildStock Pro - Sistema de Inventario para Construcción

Un sistema moderno, ágil y visualmente atractivo para el control de inventario de materiales, maquinaria pesada, herramientas y equipos de protección (EPP) en proyectos de construcción y obras.

Desarrollado en **Node.js + React + Vite**, optimizado para ejecutarse localmente con `npm start` y desplegarse fácilmente en **GitHub Pages**.

---

## 🚀 Características Principales

- 📦 **Gestión Completa de Insumos (CRUD):** Registro de código SKU, categoría, ubicación/obra, cantidad, precio unitario, unidades de medida (sacos, m³, kg, piezas, metros) y notas técnicas.
- ⚡ **Acciones Rápidas de Stock:** Modificación directa (+ / -) de existencias desde la tabla o tarjetas.
- 🔄 **Entradas y Salidas (Movimientos):** Registro formal de despachos a obra o compras a proveedor con vale de salida, responsable y motivo.
- 📜 **Historial Auditable:** Registro cronológico completo de todos los movimientos realizados.
- 📊 **Panel de Analítica y Reportes:** Gráficos visuales de valoración por categoría y por obra/punto de acopio, más reporte de ítems en estado crítico.
- 🚨 **Alertas Automáticas de Stock Bajo:** Indicador de stock mínimo configurable por cada material.
- 📥 **Exportación e Importación:** Descarga de datos en CSV (Excel) o copias de seguridad en JSON.
- 🌐 **Despliegue a GitHub Pages Integrado:** Incluye paquete `gh-pages` y scripts listos para publicar con 1 solo comando.

---

## 🛠️ Requisitos Previos

- **Node.js** (v18.0.0 o superior)
- **npm** (v9.0.0 o superior)

---

## 💻 Instrucciones de Uso Local

### 1. Iniciar Servidor de Desarrollo

Para ejecutar el proyecto localmente, ejecuta el comando solicitados:

```bash
npm start
```

o también:

```bash
npm run dev
```

Esto abrirá la aplicación en tu navegador web en `http://localhost:3000`.

---

## 🚀 Publicar en GitHub Pages

Este proyecto ya está listo para subir a **GitHub Pages**. Sigue estos sencillos pasos:

### Paso 1: Inicializar repositorio Git y subir a GitHub

```bash
# Inicializar repositorio git
git init

# Agregar los archivos
git add .
git commit -m "Initial commit - BuildStock Pro"

# Crear la rama principal
git branch -M main

# Vincular con tu repositorio en GitHub
git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git

# Subir código a GitHub
git push -u origin main
```

### Paso 2: Desplegar en GitHub Pages

Para construir y publicar el sitio estático automáticamente en la rama `gh-pages`:

```bash
npm run deploy
```

¡Listo! Tu aplicación estará pública en:  
`https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

---

## 📁 Estructura del Proyecto

```
inventario/
├── index.html                  # HTML principal con Google Fonts
├── package.json                # Configuración de scripts (npm start, deploy) y dependencias
├── vite.config.js              # Configuración de Vite con ruta relativa base: './'
├── README.md                   # Guía de documentación
└── src/
    ├── main.jsx                # Punto de entrada de React
    ├── App.jsx                 # Estado global, filtros y modales
    ├── index.css               # Sistema de diseño CSS con estética Slate/Industrial Dark
    ├── data/
    │   └── initialData.js      # Datos iniciales de muestra para construcción
    └── components/
        ├── Header.jsx          # Barra superior con acciones y logo
        ├── StatCards.jsx       # Tarjetas de estadísticas de inventario
        ├── InventoryTable.jsx  # Vista de tabla interactiva
        ├── InventoryGrid.jsx   # Vista en cuadrícula de tarjetas
        ├── ItemModal.jsx       # Modal de alta y edición de insumo
        ├── StockMovementModal.jsx # Modal para registrar Entrada/Salida
        ├── MovementsHistoryModal.jsx # Modal con historial de movimientos
        ├── AnalyticsModal.jsx  # Modal de gráficos y reportes
        └── GithubPagesGuideModal.jsx # Guía emergente de GitHub Pages
```

---

## 📜 Licencia

Desarrollado bajo licencia MIT. Libre para proyectos personales y empresariales de construcción.
