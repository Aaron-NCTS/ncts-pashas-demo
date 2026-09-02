import type {
  Product, StockMovement, Order, Customer, DistributorApplication, Quote,
  CrmLead, SupportTicket, Promotion, AppNotification, StaffUser,
} from '../types';
import {
  generateProducts, generateCustomers, generateDistributorApplications,
  generateOrders, generateQuotes, generateCrmLeads, generateTickets,
  generatePromotions, generateStaff, generateStockMovements, generateNotifications,
} from '../data/seed';

// ============================================================================
// db.ts — capa de "mock API" respaldada por localStorage.
// Esta es la única capa que toca localStorage; el resto de la app llama a
// las funciones de services/api.ts. Cuando exista un backend real, solo hay
// que reemplazar el contenido de estas funciones por llamadas fetch/HTTP —
// la interfaz pública (los nombres de función) puede mantenerse igual.
// ============================================================================

const NS = 'pasha-demo:v1:';
const KEYS = {
  products: NS + 'products',
  customers: NS + 'customers',
  distApps: NS + 'distApps',
  orders: NS + 'orders',
  quotes: NS + 'quotes',
  leads: NS + 'leads',
  tickets: NS + 'tickets',
  promotions: NS + 'promotions',
  staff: NS + 'staff',
  movements: NS + 'movements',
  notifications: NS + 'notifications',
  session: NS + 'session',
  cart: NS + 'cart',
  favorites: NS + 'favorites',
  activeDistributor: NS + 'activeDistributor',
  initialized: NS + 'initialized',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage lleno o no disponible — la demo continúa en memoria
  }
}

export function seedIfNeeded(): void {
  if (read(KEYS.initialized, false)) return;
  const products = generateProducts();
  const customers = generateCustomers();
  const distApps = generateDistributorApplications();
  const orders = generateOrders(products, customers);
  const quotes = generateQuotes(products, customers);
  const leads = generateCrmLeads();
  const tickets = generateTickets(orders, customers);
  const promotions = generatePromotions();
  const staff = generateStaff();
  const movements = generateStockMovements(products, orders);
  const notifications = generateNotifications(orders, distApps);

  write(KEYS.products, products);
  write(KEYS.customers, customers);
  write(KEYS.distApps, distApps);
  write(KEYS.orders, orders);
  write(KEYS.quotes, quotes);
  write(KEYS.leads, leads);
  write(KEYS.tickets, tickets);
  write(KEYS.promotions, promotions);
  write(KEYS.staff, staff);
  write(KEYS.movements, movements);
  write(KEYS.notifications, notifications);
  write(KEYS.initialized, true);
}

export function resetDemoData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  seedIfNeeded();
}

// --- Getters/Setters genéricos por "tabla" ---------------------------------

export const db = {
  getProducts: () => read<Product[]>(KEYS.products, []),
  setProducts: (v: Product[]) => write(KEYS.products, v),

  getCustomers: () => read<Customer[]>(KEYS.customers, []),
  setCustomers: (v: Customer[]) => write(KEYS.customers, v),

  getDistApps: () => read<DistributorApplication[]>(KEYS.distApps, []),
  setDistApps: (v: DistributorApplication[]) => write(KEYS.distApps, v),

  getOrders: () => read<Order[]>(KEYS.orders, []),
  setOrders: (v: Order[]) => write(KEYS.orders, v),

  getQuotes: () => read<Quote[]>(KEYS.quotes, []),
  setQuotes: (v: Quote[]) => write(KEYS.quotes, v),

  getLeads: () => read<CrmLead[]>(KEYS.leads, []),
  setLeads: (v: CrmLead[]) => write(KEYS.leads, v),

  getTickets: () => read<SupportTicket[]>(KEYS.tickets, []),
  setTickets: (v: SupportTicket[]) => write(KEYS.tickets, v),

  getPromotions: () => read<Promotion[]>(KEYS.promotions, []),
  setPromotions: (v: Promotion[]) => write(KEYS.promotions, v),

  getStaff: () => read<StaffUser[]>(KEYS.staff, []),
  setStaff: (v: StaffUser[]) => write(KEYS.staff, v),

  getMovements: () => read<StockMovement[]>(KEYS.movements, []),
  setMovements: (v: StockMovement[]) => write(KEYS.movements, v),

  getNotifications: () => read<AppNotification[]>(KEYS.notifications, []),
  setNotifications: (v: AppNotification[]) => write(KEYS.notifications, v),

  getActiveDistributor: () => read<{ name: string; companyName: string; email: string } | null>(KEYS.activeDistributor, null),
  setActiveDistributor: (v: { name: string; companyName: string; email: string } | null) => write(KEYS.activeDistributor, v),
};

export { KEYS, read, write };
