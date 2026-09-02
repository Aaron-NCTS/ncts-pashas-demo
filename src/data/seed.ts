import type {
  Product, ProductCategory, StockMovement, Order, OrderStatus, Customer,
  DistributorApplication, Quote, CrmLead, SupportTicket, Promotion,
  AppNotification, StaffUser, BusinessType, OrderItem, VolumePriceTier,
} from '../types';
import { brand } from '../config/brand';

// --- PRNG determinista para que la demo sea consistente entre resets -------
let seedValue = 42;
function rand(): number {
  seedValue = (seedValue * 1103515245 + 12345) % 2147483648;
  return seedValue / 2147483648;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function pad(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

const GRADIENTS = [
  'from-ink-900 via-ink-800 to-gold-600',
  'from-ink-950 via-ink-700 to-gold-500',
  'from-gold-700 via-ink-900 to-ink-950',
  'from-ink-800 via-gold-600 to-ink-950',
];

function volumeTiers(base: number): VolumePriceTier[] {
  return [
    { minQty: 1, maxQty: 5, price: base },
    { minQty: 6, maxQty: 20, price: Math.round(base * 0.93) },
    { minQty: 21, maxQty: 50, price: Math.round(base * 0.86) },
    { minQty: 51, maxQty: null, price: Math.round(base * 0.78) },
  ];
}

// ---------------------------------------------------------------------------
// PRODUCTOS
// ---------------------------------------------------------------------------

interface ProductSeed { name: string; category: ProductCategory; base: number; material: string; presentation: string; }

const PRODUCT_SEEDS: ProductSeed[] = [
  { name: "Pasha's Professional Barber Scissors 6\"", category: 'Tijeras profesionales', base: 890, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Gold Professional Scissors", category: 'Tijeras profesionales', base: 1250, material: 'Especificación por confirmar', presentation: 'Individual con estuche premium' },
  { name: "Pasha's Black Edition Scissors", category: 'Tijeras profesionales', base: 1180, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Classic Barber Scissors 5.5\"", category: 'Tijeras profesionales', base: 780, material: 'Especificación por confirmar', presentation: 'Individual' },
  { name: "Pasha's Titanium Edge Scissors", category: 'Tijeras profesionales', base: 1390, material: 'Especificación por confirmar', presentation: 'Individual con estuche rígido' },
  { name: "Pasha's Precision Cutting Scissors 6.5\"", category: 'Tijeras de corte', base: 950, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Curved Blade Scissors", category: 'Tijeras de corte', base: 1020, material: 'Especificación por confirmar', presentation: 'Individual' },
  { name: "Pasha's Left-Handed Cutting Scissors", category: 'Tijeras de corte', base: 990, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Featherweight Cutting Scissors", category: 'Tijeras de corte', base: 1140, material: 'Especificación por confirmar', presentation: 'Individual' },
  { name: "Pasha's Thinning Scissors 30T", category: 'Tijeras de entresacar', base: 860, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Thinning Scissors 40T", category: 'Tijeras de entresacar', base: 900, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: "Pasha's Texturizing Scissors 15T", category: 'Tijeras de entresacar', base: 810, material: 'Especificación por confirmar', presentation: 'Individual' },
  { name: "Pasha's Blending Shears", category: 'Tijeras de entresacar', base: 940, material: 'Especificación por confirmar', presentation: 'Individual con estuche' },
  { name: 'Professional Barber Kit', category: 'Kits de barbería', base: 2450, material: 'Especificación por confirmar', presentation: 'Kit 8 piezas con estuche' },
  { name: "Pasha's Starter Barber Kit", category: 'Kits de barbería', base: 1680, material: 'Especificación por confirmar', presentation: 'Kit 5 piezas' },
  { name: "Pasha's Master Barber Kit Gold", category: 'Kits de barbería', base: 3200, material: 'Especificación por confirmar', presentation: 'Kit 10 piezas, estuche rígido' },
  { name: "Pasha's Travel Barber Kit", category: 'Kits de barbería', base: 1450, material: 'Especificación por confirmar', presentation: 'Kit compacto 4 piezas' },
  { name: 'Professional Manicure Kit', category: 'Manicure', base: 680, material: 'Especificación por confirmar', presentation: 'Kit 7 piezas con estuche' },
  { name: "Pasha's Manicure Set Deluxe", category: 'Manicure', base: 920, material: 'Especificación por confirmar', presentation: 'Kit 12 piezas' },
  { name: "Pasha's Nail Care Essentials", category: 'Manicure', base: 540, material: 'Especificación por confirmar', presentation: 'Kit 5 piezas' },
  { name: 'Professional Pedicure Kit', category: 'Pedicure', base: 750, material: 'Especificación por confirmar', presentation: 'Kit 8 piezas con estuche' },
  { name: "Pasha's Pedicure Set Pro", category: 'Pedicure', base: 980, material: 'Especificación por confirmar', presentation: 'Kit 10 piezas' },
  { name: "Pasha's Foot Care Kit", category: 'Pedicure', base: 620, material: 'Especificación por confirmar', presentation: 'Kit 6 piezas' },
  { name: "Pasha's Beauty Kit Essential", category: 'Kits de belleza', base: 1180, material: 'Especificación por confirmar', presentation: 'Kit 9 piezas con estuche' },
  { name: "Pasha's Beauty Kit Deluxe Gold", category: 'Kits de belleza', base: 1950, material: 'Especificación por confirmar', presentation: 'Kit 14 piezas, estuche premium' },
  { name: "Pasha's Salon Starter Kit", category: 'Kits de belleza', base: 1420, material: 'Especificación por confirmar', presentation: 'Kit 11 piezas' },
  { name: "Pasha's Cape & Neck Duster Set", category: 'Accesorios profesionales', base: 380, material: 'Especificación por confirmar', presentation: 'Set 3 piezas' },
  { name: "Pasha's Sharpening Stone Kit", category: 'Accesorios profesionales', base: 420, material: 'Especificación por confirmar', presentation: 'Kit 3 piezas' },
  { name: "Pasha's Scissor Case Premium", category: 'Accesorios profesionales', base: 290, material: 'Especificación por confirmar', presentation: 'Individual' },
  { name: "Pasha's Barber Cloth Set Gold Edition", category: 'Accesorios profesionales', base: 340, material: 'Especificación por confirmar', presentation: 'Set 3 piezas' },
];

export function generateProducts(): Product[] {
  seedValue = 42;
  const warehouses = ['Almacén CDMX Central', 'Almacén CDMX Norte'];
  return PRODUCT_SEEDS.map((p, i) => {
    const stock = randInt(0, 220);
    const minStock = 20;
    const reserved = randInt(0, Math.min(15, stock));
    return {
      id: `prod-${pad(i + 1, 3)}`,
      sku: `PSH-${p.category.slice(0, 3).toUpperCase()}-${pad(i + 1, 4)}`,
      name: p.name,
      category: p.category,
      description: `${p.name}. Presentación: ${p.presentation.toLowerCase()}. Para barberías, salones y estéticas.`,
      specs: [
        `Material: ${p.material}`,
        `Presentación: ${p.presentation}`,
        'Uso: profesional / salón',
        `Distribuye: ${brand.legalName}`,
      ],
      material: p.material,
      presentation: p.presentation,
      publicPrice: p.base,
      wholesalePrice: Math.round(p.base * 0.72),
      stock,
      minStock,
      reservedStock: reserved,
      warehouse: pick(warehouses),
      image: GRADIENTS[i % GRADIENTS.length],
      volumeTiers: volumeTiers(Math.round(p.base * 0.72)),
      active: true,
      createdAt: daysAgo(randInt(30, 400)),
    };
  });
}

export function stockStatusOf(p: Pick<Product, 'stock' | 'minStock' | 'reservedStock'>): 'Disponible' | 'Stock bajo' | 'Agotado' | 'Reservado' {
  if (p.stock === 0) return 'Agotado';
  if (p.stock <= p.minStock) return 'Stock bajo';
  if (p.reservedStock > 0 && p.reservedStock >= p.stock * 0.6) return 'Reservado';
  return 'Disponible';
}

// ---------------------------------------------------------------------------
// CLIENTES
// ---------------------------------------------------------------------------

const COMPANY_NAMES = [
  'Barber Shop Roma', 'Beauty Supply MX', 'Barbería Imperial', 'Studio Hair Professional',
  'Beauty Academy CDMX', 'Salón Elegance', 'Corte & Estilo GDL', 'Barbería Central Monterrey',
  'Look Studio Puebla', 'Distribuidora Norte Belleza', 'Barbería Old School', 'Glamour Nails MX',
  'Estética Vanity', 'Barber House Querétaro', 'Salón Chic Tijuana', 'La Navaja de Oro',
  'Belleza Total SA', 'Studio 21 Barbería', 'Kings Barbershop', 'Beauty Center Cancún',
  'Corte Fino Mérida', 'Barbería Metropolitana', 'Nails & Spa Guadalajara', 'Academia de Belleza Azteca',
  'Distribuciones Estilo MX',
];
const CITY_STATE: [string, string][] = [
  ['Ciudad de México', 'CDMX'], ['Guadalajara', 'Jalisco'], ['Monterrey', 'Nuevo León'],
  ['Puebla', 'Puebla'], ['Tijuana', 'Baja California'], ['Querétaro', 'Querétaro'],
  ['Mérida', 'Yucatán'], ['Cancún', 'Quintana Roo'], ['León', 'Guanajuato'], ['Toluca', 'Estado de México'],
];
const BUSINESS_TYPES: BusinessType[] = ['Barbería', 'Salón', 'Distribuidor', 'Tienda', 'Academia', 'E-commerce'];
const CONTACT_FIRST = ['Carlos', 'Miguel', 'Fernanda', 'Ricardo', 'Daniela', 'Jorge', 'Paola', 'Alejandro', 'Sofía', 'Luis', 'Andrea', 'Raúl'];
const CONTACT_LAST = ['Hernández', 'García', 'Martínez', 'López', 'Rodríguez', 'Torres', 'Ramírez', 'Flores', 'Vega', 'Cruz'];

export function generateCustomers(): Customer[] {
  seedValue = 777;
  return COMPANY_NAMES.map((company, i) => {
    const [city, state] = pick(CITY_STATE);
    const isDist = i < 10;
    const totalPurchases = randInt(2, 60) * (isDist ? 4200 : 1400);
    return {
      id: `cust-${pad(i + 1, 3)}`,
      name: `${pick(CONTACT_FIRST)} ${pick(CONTACT_LAST)}`,
      companyName: company,
      whatsapp: `+52 1 ${randInt(55, 81)}${randInt(1000, 9999)}${randInt(1000, 9999)}`,
      email: `contacto@${company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.mx`,
      city, state,
      type: pick(BUSINESS_TYPES),
      isDistributor: isDist,
      distributorStatus: isDist ? pick<DistributorApplication['status']>(['Activo', 'Activo', 'Aprobado', 'En revisión']) : undefined,
      purchaseVolume: isDist ? pick(['20-50 piezas/mes', '50-100 piezas/mes', '100+ piezas/mes']) : undefined,
      lastPurchaseDate: daysAgo(randInt(1, 90)),
      totalPurchases,
      status: rand() > 0.1 ? 'Activo' : 'Inactivo',
      notes: [],
      createdAt: daysAgo(randInt(30, 500)),
    };
  });
}

export function generateDistributorApplications(): DistributorApplication[] {
  seedValue = 321;
  const names = ['Distribuidora Golden Blade', 'Beauty Wholesale MX', 'Grupo Estética Pacífico', 'Barber Import Sonora', 'Salones Unidos GDL', 'Estilo Profesional Puebla', 'Barbería Corporativo Bajío'];
  const statuses: DistributorApplication['status'][] = ['Solicitud recibida', 'En revisión', 'Solicitud recibida', 'En revisión', 'Solicitud recibida', 'Aprobado', 'Inactivo'];
  return names.map((company, i) => {
    const [city, state] = pick(CITY_STATE);
    return {
      id: `dapp-${pad(i + 1, 3)}`,
      name: `${pick(CONTACT_FIRST)} ${pick(CONTACT_LAST)}`,
      companyName: company,
      city, state, country: 'México',
      phone: `+52 1 ${randInt(55, 81)}${randInt(1000, 9999)}${randInt(1000, 9999)}`,
      whatsapp: `+52 1 ${randInt(55, 81)}${randInt(1000, 9999)}${randInt(1000, 9999)}`,
      email: `ventas@${company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.mx`,
      businessType: pick(BUSINESS_TYPES),
      volume: pick(['20-50 piezas/mes', '50-100 piezas/mes', '100+ piezas/mes']),
      message: 'Buscamos ampliar catálogo con productos PASHA\'S para nuestra red de clientes.',
      status: statuses[i] ?? 'Solicitud recibida',
      createdAt: daysAgo(randInt(1, 20)),
    };
  });
}

// ---------------------------------------------------------------------------
// PEDIDOS
// ---------------------------------------------------------------------------

const ORDER_STATUS_FLOW: OrderStatus[] = [
  'Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado',
  'Enviado', 'En tránsito', 'En reparto', 'Entregado',
];
const CARRIERS = ['Estafeta DEMO', 'DHL DEMO', 'Paquetexpress DEMO', 'FedEx DEMO'];

export function generateOrders(products: Product[], customers: Customer[]): Order[] {
  seedValue = 555;
  const orders: Order[] = [];
  const ORDER_COUNT = 60;
  for (let i = 0; i < ORDER_COUNT; i++) {
    const customer = pick(customers);
    const itemCount = randInt(1, 4);
    const items: OrderItem[] = [];
    for (let j = 0; j < itemCount; j++) {
      const p = pick(products);
      items.push({
        productId: p.id, name: p.name, sku: p.sku,
        quantity: randInt(1, 20),
        unitPrice: customer.isDistributor ? p.wholesalePrice : p.publicPrice,
      });
    }
    const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const discount = customer.isDistributor ? Math.round(subtotal * 0.05) : 0;
    const shipping = subtotal > 3000 ? 0 : 180;
    const total = subtotal - discount + shipping;
    const isIncident = rand() < 0.05;
    // Distribución cíclica + aleatoriedad ligera para garantizar que ningún
    // estado del flujo (y por lo tanto ninguna columna de logística) quede vacío.
    const stepCount = isIncident ? randInt(1, 4) : ((i % ORDER_STATUS_FLOW.length) + 1);
    const createdDaysAgo = randInt(0, 60);
    const timeline = ORDER_STATUS_FLOW.slice(0, stepCount).map((status, idx) => ({
      status,
      date: daysAgo(createdDaysAgo - idx),
    }));
    const status: OrderStatus = isIncident ? 'Incidencia' : ORDER_STATUS_FLOW[stepCount - 1];
    const [city, state] = pick(CITY_STATE);
    orders.push({
      id: `PSH-MX-${pad(100000 + i, 6)}`,
      customerId: customer.id,
      customerName: customer.name,
      companyName: customer.companyName,
      items, subtotal, discount, shipping, total,
      status,
      timeline,
      paymentMethod: pick(['Transferencia', 'Tarjeta', 'Pago pendiente']),
      deliveryMethod: pick(['Envío estándar', 'Envío express', 'Recoger']),
      carrier: stepCount >= 5 ? pick(CARRIERS) : undefined,
      trackingNumber: stepCount >= 5 ? `GU${randInt(100000000, 999999999)}MX` : undefined,
      address: `Av. ${pick(['Insurgentes', 'Reforma', 'Universidad', 'Constituyentes', 'Revolución'])} #${randInt(100, 999)}`,
      city, state,
      createdAt: daysAgo(createdDaysAgo),
      estimatedDate: status === 'Entregado' ? undefined : daysAgo(createdDaysAgo - stepCount - randInt(1, 3)),
      prep: {
        productPrepared: stepCount >= 3,
        productPacked: stepCount >= 4,
        orderVerified: stepCount >= 4,
      },
    });
  }
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// ---------------------------------------------------------------------------
// COTIZACIONES
// ---------------------------------------------------------------------------

export function generateQuotes(products: Product[], customers: Customer[]): Quote[] {
  seedValue = 888;
  const statuses: Quote['status'][] = ['Solicitada', 'En revisión', 'Cotizada', 'Aceptada', 'Rechazada', 'Vencida'];
  const quotes: Quote[] = [];
  for (let i = 0; i < 15; i++) {
    const customer = pick(customers.filter((c) => c.isDistributor).concat(customers.slice(0, 5)));
    const itemCount = randInt(1, 3);
    const items = Array.from({ length: itemCount }, () => {
      const p = pick(products);
      return { productId: p.id, name: p.name, quantity: randInt(10, 60), proposedPrice: p.wholesalePrice };
    });
    const status = pick(statuses);
    const total = ['Cotizada', 'Aceptada', 'Rechazada', 'Vencida'].includes(status)
      ? items.reduce((s, it) => s + it.quantity * (it.proposedPrice ?? 0), 0)
      : undefined;
    quotes.push({
      id: `COT-${pad(124 - i, 5)}`,
      customerId: customer.id,
      customerName: customer.name,
      companyName: customer.companyName,
      items,
      status,
      message: 'Solicitamos cotización para reposición de inventario trimestral.',
      adminNote: total ? 'Precio especial aplicado por volumen y antigüedad como distribuidor.' : undefined,
      total,
      createdAt: daysAgo(randInt(1, 45)),
      updatedAt: daysAgo(randInt(0, 10)),
    });
  }
  return quotes;
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

export function generateCrmLeads(): CrmLead[] {
  seedValue = 999;
  const leads = [
    { company: 'Barber Shop Roma', stage: 'NEGOCIACIÓN' as const },
    { company: 'Beauty Supply MX', stage: 'COTIZACIÓN' as const },
    { company: 'Barbería Imperial', stage: 'CLIENTE' as const },
    { company: 'Studio Hair Professional', stage: 'INTERESADO' as const },
    { company: 'Beauty Academy CDMX', stage: 'CONTACTADO' as const },
    { company: 'Distribuidora Golden Blade', stage: 'NUEVO LEAD' as const },
    { company: 'Kings Barbershop', stage: 'COTIZACIÓN' as const },
    { company: 'Salón Elegance', stage: 'NUEVO LEAD' as const },
    { company: 'La Navaja de Oro', stage: 'CONTACTADO' as const },
    { company: 'Beauty Wholesale MX', stage: 'NEGOCIACIÓN' as const },
    { company: 'Salones Unidos GDL', stage: 'INTERESADO' as const },
    { company: 'Corte Fino Mérida', stage: 'CLIENTE' as const },
  ];
  const owners = ['Ana Rivas (Ventas)', 'Sergio Nava (Ventas)', 'Paulina Ibarra (Ventas)'];
  const nextActions = ['Llamada de seguimiento', 'Enviar catálogo digital', 'Confirmar cotización', 'Agendar visita', 'Enviar propuesta comercial'];
  return leads.map((l, i) => ({
    id: `lead-${pad(i + 1, 3)}`,
    company: l.company,
    contactName: `${pick(CONTACT_FIRST)} ${pick(CONTACT_LAST)}`,
    whatsapp: `+52 1 ${randInt(55, 81)}${randInt(1000, 9999)}${randInt(1000, 9999)}`,
    email: `contacto@${l.company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.mx`,
    stage: l.stage,
    owner: pick(owners),
    lastContactDate: daysAgo(randInt(0, 20)),
    nextAction: pick(nextActions),
    notes: ['Cliente interesado en kits de barbería y tijeras gold edition.'],
  }));
}

// ---------------------------------------------------------------------------
// SOPORTE
// ---------------------------------------------------------------------------

export function generateTickets(orders: Order[], customers: Customer[]): SupportTicket[] {
  seedValue = 246;
  const categories: SupportTicket['category'][] = ['Problema con pedido', 'Facturación', 'Producto', 'Entrega', 'Otro'];
  const statuses: SupportTicket['status'][] = ['Nuevo', 'En proceso', 'Resuelto'];
  const subjects: Record<string, string> = {
    'Problema con pedido': 'Pedido incompleto',
    'Facturación': 'Solicitud de factura',
    'Producto': 'Duda sobre garantía de producto',
    'Entrega': 'Retraso en la entrega',
    'Otro': 'Consulta general',
  };
  return Array.from({ length: 9 }, (_, i) => {
    const category = pick(categories);
    const customer = pick(customers);
    const order = rand() > 0.4 ? pick(orders) : undefined;
    return {
      id: `TCK-${pad(i + 1, 4)}`,
      customerId: customer.id,
      customerName: customer.name,
      category,
      subject: subjects[category],
      message: 'Buen día, escribo para dar seguimiento a mi solicitud, quedo atenta a su respuesta.',
      status: pick(statuses),
      orderId: order?.id,
      replies: rand() > 0.5 ? [{ author: 'Soporte PASHA\'S', message: 'Gracias por contactarnos, estamos revisando tu caso.', date: daysAgo(randInt(0, 5)) }] : [],
      createdAt: daysAgo(randInt(0, 25)),
    };
  });
}

// ---------------------------------------------------------------------------
// PROMOCIONES
// ---------------------------------------------------------------------------

export function generatePromotions(): Promotion[] {
  return [
    { id: 'promo-1', name: 'Descuento Distribuidores', code: 'DISTRIBUIDOR10', percentage: 10, startDate: daysAgo(30), endDate: daysAgo(-30), active: true },
    { id: 'promo-2', name: 'Lanzamiento Gold Edition', code: 'GOLD15', percentage: 15, startDate: daysAgo(10), endDate: daysAgo(-20), active: true },
    { id: 'promo-3', name: 'Buen Fin Barbería', code: 'BUENFIN20', percentage: 20, startDate: daysAgo(90), endDate: daysAgo(60), active: false },
  ];
}

// ---------------------------------------------------------------------------
// STAFF / USUARIOS
// ---------------------------------------------------------------------------

export function generateStaff(): StaffUser[] {
  return [
    { id: 'staff-1', name: 'Rodrigo Aceves', email: 'rodrigo@pasha-demo.mx', role: 'ADMINISTRADOR', active: true, permissions: ['Acceso total'] },
    { id: 'staff-2', name: 'Ana Rivas', email: 'ana.ventas@pasha-demo.mx', role: 'VENTAS', active: true, permissions: ['Clientes', 'Cotizaciones', 'CRM'] },
    { id: 'staff-3', name: 'Julián Mata', email: 'julian.almacen@pasha-demo.mx', role: 'ALMACÉN', active: true, permissions: ['Inventario', 'Preparación de pedidos'] },
    { id: 'staff-4', name: 'Camila Ríos', email: 'camila.logistica@pasha-demo.mx', role: 'LOGÍSTICA', active: true, permissions: ['Logística', 'Envíos'] },
    { id: 'staff-5', name: 'Diego Salas', email: 'diego.soporte@pasha-demo.mx', role: 'SOPORTE', active: true, permissions: ['Tickets de soporte'] },
    { id: 'staff-6', name: 'Valeria Ponce', email: 'valeria.ventas@pasha-demo.mx', role: 'VENTAS', active: false, permissions: ['Clientes', 'Cotizaciones'] },
  ];
}

// ---------------------------------------------------------------------------
// MOVIMIENTOS DE INVENTARIO
// ---------------------------------------------------------------------------

export function generateStockMovements(products: Product[], orders: Order[]): StockMovement[] {
  seedValue = 135;
  const movements: StockMovement[] = [];
  products.slice(0, 18).forEach((p, i) => {
    movements.push({
      id: `mov-in-${i}`, productId: p.id, productName: p.name, type: 'entrada',
      quantity: randInt(20, 80), reason: 'Reposición de proveedor demo', reference: 'Proveedor demo',
      date: daysAgo(randInt(5, 60)),
    });
  });
  orders.slice(0, 25).forEach((o, i) => {
    const item = o.items[0];
    movements.push({
      id: `mov-out-${i}`, productId: item.productId, productName: item.name, type: 'salida',
      quantity: item.quantity, reason: `Pedido ${o.id}`, reference: o.id,
      date: o.createdAt,
    });
  });
  return movements.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---------------------------------------------------------------------------
// NOTIFICACIONES
// ---------------------------------------------------------------------------

export function generateNotifications(orders: Order[], distApps: DistributorApplication[]): AppNotification[] {
  const list: AppNotification[] = [];
  orders.slice(0, 5).forEach((o, i) => {
    list.push({ id: `notif-order-${i}`, type: 'pedido', title: 'Nuevo pedido recibido', message: `${o.id} — ${o.companyName ?? o.customerName}`, read: i > 1, createdAt: o.createdAt, link: `/admin/pedidos` });
  });
  distApps.forEach((d, i) => {
    list.push({ id: `notif-dist-${i}`, type: 'distribuidor', title: 'Nueva solicitud de distribuidor', message: d.companyName, read: false, createdAt: d.createdAt, link: '/admin/distribuidores' });
  });
  list.push({ id: 'notif-stock-1', type: 'stock', title: 'Stock bajo', message: '5 productos tienen stock bajo', read: false, createdAt: daysAgo(1), link: '/admin/inventario' });
  list.push({ id: 'notif-stock-2', type: 'stock', title: 'Producto agotado', message: '2 productos están agotados', read: false, createdAt: daysAgo(2), link: '/admin/inventario' });
  list.push({ id: 'notif-quote-1', type: 'cotizacion', title: 'Nueva cotización', message: 'COT-00124 pendiente de revisión', read: true, createdAt: daysAgo(3), link: '/admin/cotizaciones' });
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
