import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../services/api';
import type { Order } from '../../types';
import { OrderTimeline } from '../../components/shared/OrderTimeline';
import { Card, SectionHeading, Skeleton, Button } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';
import { brand } from '../../config/brand';

export function OrderTrackingPublic() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => { if (id) getOrder(id).then((o) => setOrder(o ?? null)); }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <SectionHeading eyebrow="Seguimiento" title={`Pedido ${id ?? ''}`} />
      {order === undefined ? (
        <Skeleton className="h-96" />
      ) : order === null ? (
        <p className="text-sm text-ink-700">No encontramos este número de pedido.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 md:col-span-2">
            <OrderTimeline order={order} />
          </Card>
          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-xs text-ink-700 mb-1">Transportista</p>
              <p className="text-sm font-medium text-ink-950 mb-3">{order.carrier ?? 'Por asignar'}</p>
              <p className="text-xs text-ink-700 mb-1">Número de guía</p>
              <p className="text-sm font-medium text-ink-950 mb-3">{order.trackingNumber ?? '—'}</p>
              <p className="text-xs text-ink-700 mb-1">Dirección</p>
              <p className="text-sm font-medium text-ink-950">{order.address}, {order.city}, {order.state}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-ink-700 mb-2">Total del pedido</p>
              <p className="font-display text-xl text-ink-950 mb-4">{formatCurrency(order.total)}</p>
              <a href={`https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(`Hola, tengo una duda sobre mi pedido ${order.id}`)}`} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="w-full">Contactar soporte</Button>
              </a>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-8">
        <Link to="/portal/seguimiento" className="text-sm text-gold-600 hover:underline">Ver todos mis pedidos en el portal →</Link>
      </div>
    </div>
  );
}
