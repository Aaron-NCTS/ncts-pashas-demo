import type { Lang } from './LanguageContext';
import type {
  OrderStatus, QuoteStatus, DistributorStatus, TicketStatus, CrmStage, BusinessType,
} from '../types';

// Estos mapas SOLO traducen la etiqueta visible. El valor almacenado en los
// datos (la clave en español, ej. 'Pedido recibido') no cambia — así no se
// toca el modelo de datos ni la lógica que compara contra estos strings.

export const ORDER_STATUS_LABEL: Record<OrderStatus, Record<Lang, string>> = {
  'Pedido recibido': { es: 'Pedido recibido', en: 'Order received' },
  'Pago confirmado': { es: 'Pago confirmado', en: 'Payment confirmed' },
  'Preparando pedido': { es: 'Preparando pedido', en: 'Preparing order' },
  'Empacado': { es: 'Empacado', en: 'Packed' },
  'Enviado': { es: 'Enviado', en: 'Shipped' },
  'En tránsito': { es: 'En tránsito', en: 'In transit' },
  'En reparto': { es: 'En reparto', en: 'Out for delivery' },
  'Entregado': { es: 'Entregado', en: 'Delivered' },
  'Incidencia': { es: 'Incidencia', en: 'Issue' },
};

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, Record<Lang, string>> = {
  'Solicitada': { es: 'Solicitada', en: 'Requested' },
  'En revisión': { es: 'En revisión', en: 'Under review' },
  'Cotizada': { es: 'Cotizada', en: 'Quoted' },
  'Aceptada': { es: 'Aceptada', en: 'Accepted' },
  'Rechazada': { es: 'Rechazada', en: 'Rejected' },
  'Vencida': { es: 'Vencida', en: 'Expired' },
};

export const DISTRIBUTOR_STATUS_LABEL: Record<DistributorStatus, Record<Lang, string>> = {
  'Prospecto': { es: 'Prospecto', en: 'Prospect' },
  'Solicitud recibida': { es: 'Solicitud recibida', en: 'Application received' },
  'En revisión': { es: 'En revisión', en: 'Under review' },
  'Aprobado': { es: 'Aprobado', en: 'Approved' },
  'Activo': { es: 'Activo', en: 'Active' },
  'Inactivo': { es: 'Inactivo', en: 'Inactive' },
};

export const TICKET_STATUS_LABEL: Record<TicketStatus, Record<Lang, string>> = {
  'Nuevo': { es: 'Nuevo', en: 'New' },
  'En proceso': { es: 'En proceso', en: 'In progress' },
  'Resuelto': { es: 'Resuelto', en: 'Resolved' },
};

export const STOCK_STATUS_LABEL: Record<'Disponible' | 'Stock bajo' | 'Agotado' | 'Reservado', Record<Lang, string>> = {
  'Disponible': { es: 'Disponible', en: 'Available' },
  'Stock bajo': { es: 'Stock bajo', en: 'Low stock' },
  'Agotado': { es: 'Agotado', en: 'Out of stock' },
  'Reservado': { es: 'Reservado', en: 'Reserved' },
};

export const CRM_STAGE_LABEL: Record<CrmStage, Record<Lang, string>> = {
  'NUEVO LEAD': { es: 'NUEVO LEAD', en: 'NEW LEAD' },
  'CONTACTADO': { es: 'CONTACTADO', en: 'CONTACTED' },
  'INTERESADO': { es: 'INTERESADO', en: 'INTERESTED' },
  'COTIZACIÓN': { es: 'COTIZACIÓN', en: 'QUOTE' },
  'NEGOCIACIÓN': { es: 'NEGOCIACIÓN', en: 'NEGOTIATION' },
  'CLIENTE': { es: 'CLIENTE', en: 'CUSTOMER' },
};

export const BUSINESS_TYPE_LABEL: Record<BusinessType, Record<Lang, string>> = {
  'Barbería': { es: 'Barbería', en: 'Barbershop' },
  'Salón': { es: 'Salón', en: 'Salon' },
  'Distribuidor': { es: 'Distribuidor', en: 'Distributor' },
  'Tienda': { es: 'Tienda', en: 'Store' },
  'Academia': { es: 'Academia', en: 'Academy' },
  'E-commerce': { es: 'E-commerce', en: 'E-commerce' },
  'Otro': { es: 'Otro', en: 'Other' },
};

export const PAYMENT_METHOD_LABEL: Record<'Transferencia' | 'Tarjeta' | 'Pago pendiente', Record<Lang, string>> = {
  'Transferencia': { es: 'Transferencia', en: 'Bank transfer' },
  'Tarjeta': { es: 'Tarjeta', en: 'Card' },
  'Pago pendiente': { es: 'Pago pendiente', en: 'Payment pending' },
};

export const DELIVERY_METHOD_LABEL: Record<'Envío estándar' | 'Envío express' | 'Recoger', Record<Lang, string>> = {
  'Envío estándar': { es: 'Envío estándar', en: 'Standard shipping' },
  'Envío express': { es: 'Envío express', en: 'Express shipping' },
  'Recoger': { es: 'Recoger', en: 'Pickup' },
};

export const MOVEMENT_TYPE_LABEL: Record<'entrada' | 'salida' | 'ajuste', Record<Lang, string>> = {
  entrada: { es: 'Entrada', en: 'In' },
  salida: { es: 'Salida', en: 'Out' },
  ajuste: { es: 'Ajuste', en: 'Adjustment' },
};

export const STAFF_ROLE_LABEL: Record<'ADMINISTRADOR' | 'VENTAS' | 'ALMACÉN' | 'LOGÍSTICA' | 'SOPORTE', Record<Lang, string>> = {
  'ADMINISTRADOR': { es: 'ADMINISTRADOR', en: 'ADMIN' },
  'VENTAS': { es: 'VENTAS', en: 'SALES' },
  'ALMACÉN': { es: 'ALMACÉN', en: 'WAREHOUSE' },
  'LOGÍSTICA': { es: 'LOGÍSTICA', en: 'LOGISTICS' },
  'SOPORTE': { es: 'SOPORTE', en: 'SUPPORT' },
};

export const TICKET_CATEGORY_LABEL: Record<'Problema con pedido' | 'Facturación' | 'Producto' | 'Entrega' | 'Otro', Record<Lang, string>> = {
  'Problema con pedido': { es: 'Problema con pedido', en: 'Order issue' },
  'Facturación': { es: 'Facturación', en: 'Billing' },
  'Producto': { es: 'Producto', en: 'Product' },
  'Entrega': { es: 'Entrega', en: 'Delivery' },
  'Otro': { es: 'Otro', en: 'Other' },
};

export const PRODUCT_CATEGORY_LABEL: Record<import('../types').ProductCategory, Record<Lang, string>> = {
  'Tijeras profesionales': { es: 'Tijeras profesionales', en: 'Professional scissors' },
  'Tijeras de corte': { es: 'Tijeras de corte', en: 'Cutting scissors' },
  'Tijeras de entresacar': { es: 'Tijeras de entresacar', en: 'Thinning scissors' },
  'Kits de barbería': { es: 'Kits de barbería', en: 'Barber kits' },
  'Manicure': { es: 'Manicure', en: 'Manicure' },
  'Pedicure': { es: 'Pedicure', en: 'Pedicure' },
  'Kits de belleza': { es: 'Kits de belleza', en: 'Beauty kits' },
  'Accesorios profesionales': { es: 'Accesorios profesionales', en: 'Professional accessories' },
};

export function labelFor<T extends string>(map: Record<T, Record<Lang, string>>, value: T, lang: Lang): string {
  return map[value]?.[lang] ?? value;
}
