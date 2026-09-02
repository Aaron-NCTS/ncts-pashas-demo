import { db } from './db';
import { stockStatusOf } from '../data/seed';
import type {
  Product, Order, OrderStatus, Customer, DistributorApplication, Quote,
  CrmLead, CrmStage, SupportTicket, Promotion, StaffUser, CartItem,
  OrderItem, StockMovement,
} from '../types';
import { brand } from '../config/brand';

// ============================================================================
// api.ts — capa de servicio. Todas las mutaciones de datos de la app pasan
// por aquí. Simula latencia de red para que la demo se sienta real.
// ============================================================================

function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function nowIso(): string {
  return new Date().toISOString();
}

function pushNotification(n: Omit<import('../types').AppNotification, 'id' | 'read' | 'createdAt'>): void {
  const list = db.getNotifications();
  list.unshift({ ...n, id: `notif-${Date.now()}`, read: false, createdAt: nowIso() });
  db.setNotifications(list.slice(0, 60));
}

// ---------------------------------------------------------------------------
// Productos / inventario
// ---------------------------------------------------------------------------

export async function listProducts(): Promise<Product[]> {
  return delay(db.getProducts());
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return delay(db.getProducts().find((p) => p.id === id));
}

export async function upsertProduct(product: Product): Promise<Product> {
  const list = db.getProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.unshift(product);
  db.setProducts(list);
  return delay(product);
}

export async function toggleProductActive(id: string): Promise<void> {
  const list = db.getProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], active: !list[idx].active };
  db.setProducts(list);
  return delay(undefined);
}

export async function registerStockMovement(input: {
  productId: string; type: StockMovement['type']; quantity: number; reason: string; reference?: string;
}): Promise<void> {
  const products = db.getProducts();
  const idx = products.findIndex((p) => p.id === input.productId);
  if (idx < 0) return delay(undefined);
  const product = products[idx];
  let newStock = product.stock;
  if (input.type === 'entrada') newStock += input.quantity;
  else if (input.type === 'salida') newStock = Math.max(0, newStock - input.quantity);
  else newStock = input.quantity; // ajuste = valor absoluto
  products[idx] = { ...product, stock: newStock };
  db.setProducts(products);

  const movements = db.getMovements();
  movements.unshift({
    id: `mov-${Date.now()}`, productId: product.id, productName: product.name,
    type: input.type, quantity: input.quantity, reason: input.reason,
    reference: input.reference, date: nowIso(),
  });
  db.setMovements(movements);

  if (stockStatusOf({ ...product, stock: newStock }) === 'Stock bajo') {
    pushNotification({ type: 'stock', title: 'Stock bajo', message: `${product.name} alcanzó el mínimo de inventario`, link: '/admin/inventario' });
  }
  return delay(undefined);
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

function nextOrderId(): string {
  const orders = db.getOrders();
  const max = orders.reduce((m, o) => {
    const n = parseInt(o.id.replace(brand.orderPrefix, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 100127);
  return `${brand.orderPrefix}${String(max + 1).padStart(6, '0')}`;
}

export async function listOrders(): Promise<Order[]> {
  return delay(db.getOrders());
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return delay(db.getOrders().find((o) => o.id === id));
}

export async function createOrder(input: {
  customerId: string; customerName: string; companyName?: string;
  items: CartItem[]; discount: number; shipping: number;
  paymentMethod: Order['paymentMethod']; deliveryMethod: Order['deliveryMethod'];
  address: string; city: string; state: string;
}): Promise<Order> {
  const orderItems: OrderItem[] = input.items.map((i) => ({
    productId: i.productId, name: i.name, sku: i.sku, quantity: i.quantity, unitPrice: i.unitPrice,
  }));
  const subtotal = orderItems.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const total = subtotal - input.discount + input.shipping;
  const order: Order = {
    id: nextOrderId(),
    customerId: input.customerId,
    customerName: input.customerName,
    companyName: input.companyName,
    items: orderItems,
    subtotal, discount: input.discount, shipping: input.shipping, total,
    status: 'Pedido recibido',
    timeline: [{ status: 'Pedido recibido', date: nowIso() }],
    paymentMethod: input.paymentMethod,
    deliveryMethod: input.deliveryMethod,
    address: input.address, city: input.city, state: input.state,
    createdAt: nowIso(),
    estimatedDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    prep: { productPrepared: false, productPacked: false, orderVerified: false },
  };
  const orders = db.getOrders();
  orders.unshift(order);
  db.setOrders(orders);

  // Descontar stock reservado simbólicamente (salida de inventario)
  for (const item of orderItems) {
    await registerStockMovement({ productId: item.productId, type: 'salida', quantity: item.quantity, reason: `Pedido ${order.id}`, reference: order.id });
  }

  pushNotification({ type: 'pedido', title: 'Nuevo pedido recibido', message: `${order.id} — ${input.companyName ?? input.customerName}`, link: '/admin/pedidos' });
  return delay(order, 400);
}

const STATUS_FLOW: OrderStatus[] = [
  'Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado',
  'Enviado', 'En tránsito', 'En reparto', 'Entregado',
];

export async function advanceOrderStatus(orderId: string, note?: string): Promise<Order | undefined> {
  const orders = db.getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx < 0) return delay(undefined);
  const order = orders[idx];
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = STATUS_FLOW[Math.min(currentIdx + 1, STATUS_FLOW.length - 1)];
  const updated: Order = {
    ...order,
    status: nextStatus,
    timeline: [...order.timeline, { status: nextStatus, date: nowIso(), note }],
  };
  if (nextStatus === 'Enviado' && !updated.carrier) {
    updated.carrier = 'Estafeta DEMO';
    updated.trackingNumber = `GU${Math.floor(100000000 + Math.random() * 899999999)}MX`;
  }
  orders[idx] = updated;
  db.setOrders(orders);
  if (nextStatus === 'Entregado') pushNotification({ type: 'entrega', title: 'Pedido entregado', message: order.id, link: '/admin/logistica' });
  if (nextStatus === 'Pago confirmado') pushNotification({ type: 'pago', title: 'Pago confirmado', message: order.id, link: '/admin/pedidos' });
  return delay(updated);
}

export async function setOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | undefined> {
  const orders = db.getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx < 0) return delay(undefined);
  const order = orders[idx];
  const updated: Order = { ...order, status, timeline: [...order.timeline, { status, date: nowIso(), note }] };
  orders[idx] = updated;
  db.setOrders(orders);
  return delay(updated);
}

export async function updateOrderPrep(orderId: string, prep: Partial<NonNullable<Order['prep']>>): Promise<Order | undefined> {
  const orders = db.getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx < 0) return delay(undefined);
  const order = orders[idx];
  const updatedPrep = { ...(order.prep ?? { productPrepared: false, productPacked: false, orderVerified: false }), ...prep };
  orders[idx] = { ...order, prep: updatedPrep };
  db.setOrders(orders);
  return delay(orders[idx]);
}

// ---------------------------------------------------------------------------
// Clientes / distribuidores
// ---------------------------------------------------------------------------

export async function listCustomers(): Promise<Customer[]> {
  return delay(db.getCustomers());
}

export async function upsertCustomer(customer: Customer): Promise<Customer> {
  const list = db.getCustomers();
  const idx = list.findIndex((c) => c.id === customer.id);
  if (idx >= 0) list[idx] = customer;
  else list.unshift(customer);
  db.setCustomers(list);
  return delay(customer);
}

export async function addCustomerNote(customerId: string, note: string): Promise<void> {
  const list = db.getCustomers();
  const idx = list.findIndex((c) => c.id === customerId);
  if (idx >= 0) list[idx] = { ...list[idx], notes: [note, ...list[idx].notes] };
  db.setCustomers(list);
  return delay(undefined);
}

export async function listDistributorApplications(): Promise<DistributorApplication[]> {
  return delay(db.getDistApps());
}

export async function submitDistributorApplication(input: Omit<DistributorApplication, 'id' | 'status' | 'createdAt'>): Promise<DistributorApplication> {
  const app: DistributorApplication = { ...input, id: `dapp-${Date.now()}`, status: 'Solicitud recibida', createdAt: nowIso() };
  const list = db.getDistApps();
  list.unshift(app);
  db.setDistApps(list);
  pushNotification({ type: 'distribuidor', title: 'Nueva solicitud de distribuidor', message: app.companyName, link: '/admin/distribuidores' });
  return delay(app, 500);
}

export async function updateDistributorStatus(id: string, status: DistributorApplication['status']): Promise<void> {
  const list = db.getDistApps();
  const idx = list.findIndex((d) => d.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], status };
  db.setDistApps(list);
  return delay(undefined);
}

/**
 * Aprueba una solicitud de distribuidor y la "provisiona": crea/actualiza su
 * registro de Cliente como distribuidor activo y la fija como la identidad
 * que usará el acceso rápido "Entrar como Distribuidor" del login — así el
 * flujo completo (solicitud → aprobación → portal → cotización → pedido)
 * se puede demostrar de punta a punta con la misma empresa.
 */
export async function approveDistributor(id: string): Promise<DistributorApplication | undefined> {
  const apps = db.getDistApps();
  const idx = apps.findIndex((d) => d.id === id);
  if (idx < 0) return delay(undefined);
  const app = { ...apps[idx], status: 'Aprobado' as const };
  apps[idx] = app;
  db.setDistApps(apps);

  const customers = db.getCustomers();
  const existingIdx = customers.findIndex((c) => c.email === app.email || c.companyName === app.companyName);
  const customerData: Customer = {
    id: existingIdx >= 0 ? customers[existingIdx].id : `cust-${Date.now()}`,
    name: app.name,
    companyName: app.companyName,
    whatsapp: app.whatsapp,
    email: app.email,
    city: app.city,
    state: app.state,
    type: app.businessType,
    isDistributor: true,
    distributorStatus: 'Activo',
    purchaseVolume: app.volume,
    lastPurchaseDate: existingIdx >= 0 ? customers[existingIdx].lastPurchaseDate : undefined,
    totalPurchases: existingIdx >= 0 ? customers[existingIdx].totalPurchases : 0,
    status: 'Activo',
    notes: existingIdx >= 0 ? customers[existingIdx].notes : ['Aprobado como distribuidor desde el panel administrativo.'],
    createdAt: existingIdx >= 0 ? customers[existingIdx].createdAt : nowIso(),
  };
  if (existingIdx >= 0) customers[existingIdx] = customerData;
  else customers.unshift(customerData);
  db.setCustomers(customers);

  db.setActiveDistributor({ name: app.name, companyName: app.companyName, email: app.email });

  return delay(app, 400);
}

// ---------------------------------------------------------------------------
// Cotizaciones
// ---------------------------------------------------------------------------

function nextQuoteId(): string {
  const quotes = db.getQuotes();
  const max = quotes.reduce((m, q) => {
    const n = parseInt(q.id.replace(brand.quotePrefix, ''), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 124);
  return `${brand.quotePrefix}${String(max + 1).padStart(5, '0')}`;
}

export async function listQuotes(): Promise<Quote[]> {
  return delay(db.getQuotes());
}

export async function requestQuote(input: { customerId: string; customerName: string; companyName?: string; items: Quote['items']; message?: string }): Promise<Quote> {
  const quote: Quote = {
    id: nextQuoteId(), customerId: input.customerId, customerName: input.customerName,
    companyName: input.companyName, items: input.items, status: 'Solicitada',
    message: input.message, createdAt: nowIso(), updatedAt: nowIso(),
  };
  const list = db.getQuotes();
  list.unshift(quote);
  db.setQuotes(list);
  pushNotification({ type: 'cotizacion', title: 'Nueva cotización solicitada', message: quote.id, link: '/admin/cotizaciones' });
  return delay(quote, 400);
}

export async function respondQuote(id: string, input: { status: Quote['status']; items?: Quote['items']; adminNote?: string }): Promise<Quote | undefined> {
  const list = db.getQuotes();
  const idx = list.findIndex((q) => q.id === id);
  if (idx < 0) return delay(undefined);
  const items = input.items ?? list[idx].items;
  const total = items.reduce((s, it) => s + it.quantity * (it.proposedPrice ?? 0), 0);
  list[idx] = { ...list[idx], status: input.status, items, adminNote: input.adminNote ?? list[idx].adminNote, total, updatedAt: nowIso() };
  db.setQuotes(list);
  return delay(list[idx]);
}

/** El cliente acepta una cotización ya respondida por el admin ("Cotizada"). */
export async function acceptQuote(id: string): Promise<Quote | undefined> {
  const list = db.getQuotes();
  const idx = list.findIndex((q) => q.id === id);
  if (idx < 0) return delay(undefined);
  list[idx] = { ...list[idx], status: 'Aceptada', updatedAt: nowIso() };
  db.setQuotes(list);
  return delay(list[idx]);
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

export async function listLeads(): Promise<CrmLead[]> {
  return delay(db.getLeads());
}

export async function moveLeadStage(id: string, stage: CrmStage): Promise<void> {
  const list = db.getLeads();
  const idx = list.findIndex((l) => l.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], stage, lastContactDate: nowIso() };
  db.setLeads(list);
  return delay(undefined);
}

export async function addLeadNote(id: string, note: string): Promise<void> {
  const list = db.getLeads();
  const idx = list.findIndex((l) => l.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], notes: [note, ...list[idx].notes] };
  db.setLeads(list);
  return delay(undefined);
}

export async function createLead(input: Omit<CrmLead, 'id' | 'notes'>): Promise<CrmLead> {
  const lead: CrmLead = { ...input, id: `lead-${Date.now()}`, notes: [] };
  const list = db.getLeads();
  list.unshift(lead);
  db.setLeads(list);
  return delay(lead);
}

// ---------------------------------------------------------------------------
// Soporte
// ---------------------------------------------------------------------------

export async function listTickets(): Promise<SupportTicket[]> {
  return delay(db.getTickets());
}

export async function createTicket(input: Omit<SupportTicket, 'id' | 'status' | 'replies' | 'createdAt'>): Promise<SupportTicket> {
  const ticket: SupportTicket = { ...input, id: `TCK-${Date.now()}`, status: 'Nuevo', replies: [], createdAt: nowIso() };
  const list = db.getTickets();
  list.unshift(ticket);
  db.setTickets(list);
  pushNotification({ type: 'ticket', title: 'Nuevo ticket de soporte', message: `${ticket.subject} — ${input.customerName}`, link: '/admin/soporte' });
  return delay(ticket, 400);
}

export async function replyTicket(id: string, author: string, message: string, newStatus?: SupportTicket['status']): Promise<SupportTicket | undefined> {
  const list = db.getTickets();
  const idx = list.findIndex((t) => t.id === id);
  if (idx < 0) return delay(undefined);
  const replies = [...list[idx].replies, { author, message, date: nowIso() }];
  list[idx] = { ...list[idx], replies, status: newStatus ?? list[idx].status };
  db.setTickets(list);
  return delay(list[idx]);
}

// ---------------------------------------------------------------------------
// Promociones
// ---------------------------------------------------------------------------

export async function listPromotions(): Promise<Promotion[]> {
  return delay(db.getPromotions());
}

export async function upsertPromotion(promo: Promotion): Promise<Promotion> {
  const list = db.getPromotions();
  const idx = list.findIndex((p) => p.id === promo.id);
  if (idx >= 0) list[idx] = promo;
  else list.unshift(promo);
  db.setPromotions(list);
  return delay(promo);
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export async function listStaff(): Promise<StaffUser[]> {
  return delay(db.getStaff());
}

export async function toggleStaffActive(id: string): Promise<void> {
  const list = db.getStaff();
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], active: !list[idx].active };
  db.setStaff(list);
  return delay(undefined);
}

// ---------------------------------------------------------------------------
// Notificaciones
// ---------------------------------------------------------------------------

export async function listNotifications() {
  return delay(db.getNotifications());
}
export async function markNotificationRead(id: string): Promise<void> {
  const list = db.getNotifications();
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], read: true };
  db.setNotifications(list);
}
export async function markAllNotificationsRead(): Promise<void> {
  db.setNotifications(db.getNotifications().map((n) => ({ ...n, read: true })));
}

export async function listMovements(): Promise<StockMovement[]> {
  return delay(db.getMovements());
}
