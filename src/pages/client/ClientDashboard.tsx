import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders, listQuotes } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { KpiCard, Card, SectionHeading } from '../../components/ui/primitives';
import { OrderStatusBadge, QuoteStatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../config/brand';
import type { Order, Quote } from '../../types';

export function ClientDashboard() {
  const { session } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    listOrders().then((all) => setOrders(all.filter((o) => o.customerName === session?.name || o.companyName === session?.companyName).slice(0, 30)));
    listQuotes().then((all) => setQuotes(all.filter((q) => q.customerName === session?.name || q.companyName === session?.companyName)));
  }, [session]);

  const inTransit = orders.filter((o) => ['Enviado', 'En tránsito', 'En reparto'].includes(o.status)).length;
  const accumulated = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <SectionHeading title={`Bienvenido, ${session?.companyName ?? session?.name}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <KpiCard label="Pedidos realizados" value={String(orders.length)} />
        <KpiCard label="Pedidos en tránsito" value={String(inTransit)} />
        <KpiCard label="Cotizaciones" value={String(quotes.length)} />
        <KpiCard label="Compras acumuladas" value={formatCurrency(accumulated)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink-950">Pedidos recientes</p>
            <Link to="/portal/pedidos" className="text-xs text-gold-600 hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-950">{o.id}</span>
                <span className="text-ink-700">{formatCurrency(o.total)}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-ink-700">Aún no tienes pedidos.</p>}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink-950">Cotizaciones recientes</p>
            <Link to="/portal/cotizaciones" className="text-xs text-gold-600 hover:underline">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {quotes.slice(0, 5).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-950">{q.id}</span>
                <span className="text-ink-700">{q.items.length} productos</span>
                <QuoteStatusBadge status={q.status} />
              </div>
            ))}
            {quotes.length === 0 && <p className="text-sm text-ink-700">Aún no tienes cotizaciones.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
