import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, EmptyState, Skeleton } from '../../components/ui/primitives';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../config/brand';
import type { Order } from '../../types';

export function ClientOrders() {
  const { session } = useApp();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    listOrders().then((all) => setOrders(all.filter((o) => o.customerName === session?.name || o.companyName === session?.companyName)));
  }, [session]);

  return (
    <div>
      <SectionHeading title="Mis pedidos" />
      {orders === null ? (
        <Skeleton className="h-64" />
      ) : orders.length === 0 ? (
        <EmptyState title="Aún no tienes pedidos" message="Cuando realices una compra, aparecerá aquí." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02]">
                  <td className="px-5 py-3 font-medium text-ink-950">{o.id}</td>
                  <td className="px-5 py-3 text-ink-700">{new Date(o.createdAt).toLocaleDateString('es-MX')}</td>
                  <td className="px-5 py-3 text-ink-700">{formatCurrency(o.total)}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/portal/seguimiento?pedido=${o.id}`} className="text-xs text-gold-600 hover:underline">Ver seguimiento</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
