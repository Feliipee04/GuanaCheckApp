export const initialInventory = [
  {
    id: 'ITEM-101',
    sku: 'MAT-CEM-001',
    name: 'Cemento Portland Tipo I (50kg)',
    category: 'Materiales Basicos',
    quantity: 140,
    minQuantity: 40,
    unit: 'sacos',
    unitPrice: 14.50,
    location: 'Almacen Central',
    status: 'Disponible',
    lastUpdated: '2026-08-25',
    notes: 'Sacos protegidos contra humedad en tarimas.'
  },
  {
    id: 'ITEM-102',
    sku: 'MAT-VAR-012',
    name: 'Varilla Corrugada Acero 1/2" (6m)',
    category: 'Estructura y Acero',
    quantity: 18,
    minQuantity: 50,
    unit: 'piezas',
    unitPrice: 12.80,
    location: 'Obra Norte - Lote A',
    status: 'Stock Bajo',
    lastUpdated: '2026-08-26',
    notes: 'Requerido pedido urgente para colado de loza.'
  },
  {
    id: 'ITEM-103',
    sku: 'MAQ-RET-004',
    name: 'Retroexcavadora Caterpillar 420F2',
    category: 'Maquinaria Pesada',
    quantity: 2,
    minQuantity: 1,
    unit: 'unidades',
    unitPrice: 85000.00,
    location: 'Obra Sur - Movimiento Tierra',
    status: 'En Operacion',
    lastUpdated: '2026-08-24',
    notes: 'Mantenimiento preventivo programado para fin de mes.'
  },
  {
    id: 'ITEM-104',
    sku: 'EPP-CAS-088',
    name: 'Casco de Seguridad Industrial MSA V-Gard',
    category: 'Equipos de Seguridad (EPP)',
    quantity: 45,
    minQuantity: 20,
    unit: 'unidades',
    unitPrice: 18.00,
    location: 'Almacen Central',
    status: 'Disponible',
    lastUpdated: '2026-08-20',
    notes: 'Color amarillo con ajuste de trinquete.'
  },
  {
    id: 'ITEM-105',
    sku: 'HER-TAL-033',
    name: 'Taladro Perforador SDS Plus 800W DeWalt',
    category: 'Herramientas Electricas',
    quantity: 6,
    minQuantity: 3,
    unit: 'unidades',
    unitPrice: 220.00,
    location: 'Taller Central',
    status: 'Disponible',
    lastUpdated: '2026-08-26',
    notes: 'Incluye maletín y kit de brocas de concreto.'
  },
  {
    id: 'ITEM-106',
    sku: 'MAT-PIN-050',
    name: 'Pintura Vinílica Blanca de Uso Industrial (19L)',
    category: 'Acabados y Pintura',
    quantity: 0,
    minQuantity: 10,
    unit: 'cubetas',
    unitPrice: 65.00,
    location: 'Almacen Central',
    status: 'Agotado',
    lastUpdated: '2026-08-26',
    notes: 'Agotado totalmente tras acabado de torre B.'
  },
  {
    id: 'ITEM-107',
    sku: 'MAT-TUB-015',
    name: 'Tubo PVC Presión 4 pulgadas (6m)',
    category: 'Fontaneria e Hidraulica',
    quantity: 85,
    minQuantity: 25,
    unit: 'metros',
    unitPrice: 9.40,
    location: 'Obra Norte - Lote A',
    status: 'Disponible',
    lastUpdated: '2026-08-22',
    notes: 'Sanitario e hidráulico clase 10.'
  },
  {
    id: 'ITEM-108',
    sku: 'EPP-ARN-009',
    name: 'Arnés de Cuerpo Completo Anticaídas 3M',
    category: 'Equipos de Seguridad (EPP)',
    quantity: 8,
    minQuantity: 10,
    unit: 'unidades',
    unitPrice: 110.00,
    location: 'Obra Sur - Estructura',
    status: 'Stock Bajo',
    lastUpdated: '2026-08-26',
    notes: 'Inspeccionado con certificación vigente.'
  }
];

export const initialCategories = [
  'Todos',
  'Materiales Basicos',
  'Estructura y Acero',
  'Maquinaria Pesada',
  'Herramientas Electricas',
  'Equipos de Seguridad (EPP)',
  'Acabados y Pintura',
  'Fontaneria e Hidraulica'
];

export const initialLocations = [
  'Todas las Ubicaciones',
  'Almacen Central',
  'Obra Norte - Lote A',
  'Obra Sur - Movimiento Tierra',
  'Obra Sur - Estructura',
  'Taller Central'
];
