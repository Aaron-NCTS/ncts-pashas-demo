import { Badge } from './primitives';
import type { OrderStatus, QuoteStatus, DistributorStatus, TicketStatus } from '../../types';

const ORDER_TONE: Record<OrderStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  'Pedido recibido': 'neutral',
  'Pago confirmado': 'blue',
  'Preparando pedido': 'amber',
  'Empacado': 'amber',
  'Enviado': 'gold',
  'En tránsito': 'gold',
  'En reparto': 'gold',
  'Entregado': 'green',
  'Incidencia': 'red',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={ORDER_TONE[status]}>{status}</Badge>;
}

const QUOTE_TONE: Record<QuoteStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Solicitada: 'neutral', 'En revisión': 'amber', Cotizada: 'blue', Aceptada: 'green', Rechazada: 'red', Vencida: 'neutral',
};
export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge tone={QUOTE_TONE[status]}>{status}</Badge>;
}

const DIST_TONE: Record<DistributorStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Prospecto: 'neutral', 'Solicitud recibida': 'amber', 'En revisión': 'blue', Aprobado: 'gold', Activo: 'green', Inactivo: 'red',
};
export function DistributorStatusBadge({ status }: { status: DistributorStatus }) {
  return <Badge tone={DIST_TONE[status]}>{status}</Badge>;
}

const TICKET_TONE: Record<TicketStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Nuevo: 'amber', 'En proceso': 'blue', Resuelto: 'green',
};
export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Badge tone={TICKET_TONE[status]}>{status}</Badge>;
}

export function StockStatusBadge({ status }: { status: 'Disponible' | 'Stock bajo' | 'Agotado' | 'Reservado' }) {
  const tone = status === 'Disponible' ? 'green' : status === 'Stock bajo' ? 'amber' : status === 'Agotado' ? 'red' : 'blue';
  return <Badge tone={tone}>{status}</Badge>;
}
