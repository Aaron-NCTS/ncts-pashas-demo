import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getOrder } from '../../services/api';
import type { Order } from '../../types';
import { Button, Card, Skeleton } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';

export function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => { if (id) getOrder(id).then((o) => setOrder(o ?? null)); }, [id]);

  if (order === undefined) return <div className="max-w-xl mx-auto px-5 py-20"><Skeleton className="h-64" /></div>;
  if (order === null) return <div className="max-w-xl mx-auto px-5 py-20 text-center text-ink-700">Pedido no encontrado.</div>;

  return (
    <div className="max-w-xl mx-auto px-5 md:px-8 py-20">
      <Card className="p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-signal-green mx-auto mb-5" strokeWidth={1.2} />
        <p className="font-display text-2xl text-ink-950 mb-1">¡Pedido confirmado!</p>
        <p className="text-sm text-ink-700 mb-6">Número de pedido</p>
        <p className="font-display text-3xl text-gold-600 mb-8 tracking-wide">{order.id}</p>
        <div className="text-left text-sm text-ink-700 space-y-1.5 mb-8 border-t border-b border-ink-950/10 py-5">
          <div className="flex justify-between"><span>Total</span><span className="font-medium text-ink-950">{formatCurrency(order.total)}</span></div>
          <div className="flex justify-between"><span>Método de pago</span><span className="font-medium text-ink-950">{order.paymentMethod}</span></div>
          <div className="flex justify-between"><span>Entrega</span><span className="font-medium text-ink-950">{order.deliveryMethod}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/seguimiento/${order.id}`}><Button>Seguir mi pedido</Button></Link>
          <Link to="/productos"><Button variant="secondary">Seguir comprando</Button></Link>
        </div>
      </Card>
    </div>
  );
}
