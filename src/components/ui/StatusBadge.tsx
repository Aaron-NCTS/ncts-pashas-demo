import { Badge } from './primitives';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ORDER_STATUS_LABEL, QUOTE_STATUS_LABEL, DISTRIBUTOR_STATUS_LABEL, TICKET_STATUS_LABEL, STOCK_STATUS_LABEL, labelFor,
} from '../../i18n/statusLabels';
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
  const { lang } = useLanguage();
  return <Badge tone={ORDER_TONE[status]}>{labelFor(ORDER_STATUS_LABEL, status, lang)}</Badge>;
}

const QUOTE_TONE: Record<QuoteStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Solicitada: 'neutral', 'En revisión': 'amber', Cotizada: 'blue', Aceptada: 'green', Rechazada: 'red', Vencida: 'neutral',
};
export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const { lang } = useLanguage();
  return <Badge tone={QUOTE_TONE[status]}>{labelFor(QUOTE_STATUS_LABEL, status, lang)}</Badge>;
}

const DIST_TONE: Record<DistributorStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Prospecto: 'neutral', 'Solicitud recibida': 'amber', 'En revisión': 'blue', Aprobado: 'gold', Activo: 'green', Inactivo: 'red',
};
export function DistributorStatusBadge({ status }: { status: DistributorStatus }) {
  const { lang } = useLanguage();
  return <Badge tone={DIST_TONE[status]}>{labelFor(DISTRIBUTOR_STATUS_LABEL, status, lang)}</Badge>;
}

const TICKET_TONE: Record<TicketStatus, 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'> = {
  Nuevo: 'amber', 'En proceso': 'blue', Resuelto: 'green',
};
export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { lang } = useLanguage();
  return <Badge tone={TICKET_TONE[status]}>{labelFor(TICKET_STATUS_LABEL, status, lang)}</Badge>;
}

export function StockStatusBadge({ status }: { status: 'Disponible' | 'Stock bajo' | 'Agotado' | 'Reservado' }) {
  const { lang } = useLanguage();
  const tone = status === 'Disponible' ? 'green' : status === 'Stock bajo' ? 'amber' : status === 'Agotado' ? 'red' : 'blue';
  return <Badge tone={tone}>{labelFor(STOCK_STATUS_LABEL, status, lang)}</Badge>;
}
