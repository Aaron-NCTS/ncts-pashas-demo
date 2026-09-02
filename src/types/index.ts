// ============================================================================
// Tipos de dominio — DEMO PASHA'S
// ============================================================================

export type UserRole = 'admin' | 'client' | 'distributor';

export interface Session {
  role: UserRole;
  name: string;
  companyName?: string;
  email: string;
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export type ProductCategory =
  | 'Tijeras profesionales'
  | 'Tijeras de corte'
  | 'Tijeras de entresacar'
  | 'Kits de barbería'
  | 'Manicure'
  | 'Pedicure'
  | 'Kits de belleza'
  | 'Accesorios profesionales';

export interface VolumePriceTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  description: string;
  specs: string[];
  material: string;
  presentation: string;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  minStock: number;
  reservedStock: number;
  warehouse: string;
  image: string; // placeholder gradient id
  volumeTiers: VolumePriceTier[];
  active: boolean;
  createdAt: string;
}

export type StockStatus = 'Disponible' | 'Stock bajo' | 'Agotado' | 'Reservado';

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  reason: string;
  reference?: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Carrito / pedidos
// ---------------------------------------------------------------------------

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  mode: 'regular' | 'mayorista';
}

export type OrderStatus =
  | 'Pedido recibido'
  | 'Pago confirmado'
  | 'Preparando pedido'
  | 'Empacado'
  | 'Enviado'
  | 'En tránsito'
  | 'En reparto'
  | 'Entregado'
  | 'Incidencia';

export interface OrderTimelineEntry {
  status: OrderStatus;
  date: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string; // PSH-MX-000128
  customerId: string;
  customerName: string;
  companyName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimelineEntry[];
  paymentMethod: 'Transferencia' | 'Tarjeta' | 'Pago pendiente';
  deliveryMethod: 'Envío estándar' | 'Envío express' | 'Recoger';
  carrier?: string;
  trackingNumber?: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  estimatedDate?: string;
  prep?: {
    productPrepared: boolean;
    productPacked: boolean;
    orderVerified: boolean;
  };
}

// ---------------------------------------------------------------------------
// Clientes / distribuidores
// ---------------------------------------------------------------------------

export type BusinessType =
  | 'Barbería'
  | 'Salón'
  | 'Distribuidor'
  | 'Tienda'
  | 'Academia'
  | 'E-commerce'
  | 'Otro';

export type DistributorStatus =
  | 'Prospecto'
  | 'Solicitud recibida'
  | 'En revisión'
  | 'Aprobado'
  | 'Activo'
  | 'Inactivo';

export interface Customer {
  id: string;
  name: string;
  companyName: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  type: BusinessType;
  isDistributor: boolean;
  distributorStatus?: DistributorStatus;
  purchaseVolume?: string;
  lastPurchaseDate?: string;
  totalPurchases: number;
  status: 'Activo' | 'Inactivo';
  notes: string[];
  createdAt: string;
}

export interface DistributorApplication {
  id: string;
  name: string;
  companyName: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  businessType: BusinessType;
  volume: string;
  message: string;
  status: DistributorStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Cotizaciones
// ---------------------------------------------------------------------------

export type QuoteStatus =
  | 'Solicitada'
  | 'En revisión'
  | 'Cotizada'
  | 'Aceptada'
  | 'Rechazada'
  | 'Vencida';

export interface QuoteItem {
  productId: string;
  name: string;
  quantity: number;
  proposedPrice?: number;
}

export interface Quote {
  id: string; // COT-00124
  customerId: string;
  customerName: string;
  companyName?: string;
  items: QuoteItem[];
  status: QuoteStatus;
  message?: string;
  adminNote?: string;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

export type CrmStage =
  | 'NUEVO LEAD'
  | 'CONTACTADO'
  | 'INTERESADO'
  | 'COTIZACIÓN'
  | 'NEGOCIACIÓN'
  | 'CLIENTE';

export interface CrmLead {
  id: string;
  company: string;
  contactName: string;
  whatsapp: string;
  email: string;
  stage: CrmStage;
  owner: string;
  lastContactDate: string;
  nextAction: string;
  notes: string[];
}

// ---------------------------------------------------------------------------
// Soporte
// ---------------------------------------------------------------------------

export type TicketCategory = 'Problema con pedido' | 'Facturación' | 'Producto' | 'Entrega' | 'Otro';
export type TicketStatus = 'Nuevo' | 'En proceso' | 'Resuelto';

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  orderId?: string;
  replies: { author: string; message: string; date: string }[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Promociones
// ---------------------------------------------------------------------------

export interface Promotion {
  id: string;
  name: string;
  code: string;
  percentage: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Notificaciones
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'pedido'
  | 'distribuidor'
  | 'stock'
  | 'pago'
  | 'entrega'
  | 'cotizacion'
  | 'ticket';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ---------------------------------------------------------------------------
// Usuarios / roles (panel admin)
// ---------------------------------------------------------------------------

export type StaffRole = 'ADMINISTRADOR' | 'VENTAS' | 'ALMACÉN' | 'LOGÍSTICA' | 'SOPORTE';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  permissions: string[];
}
