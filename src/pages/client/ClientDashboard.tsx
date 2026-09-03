import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOrders, listQuotes } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { KpiCard, Card, SectionHeading } from '../../components/ui/primitives';
import { OrderStatusBadge, QuoteStatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../config/brand';
import type { Order, Quote } from '../../types';

export function ClientDashboard() {
  const { session } = useApp();
  const { t } = useLanguage();
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
      <SectionHeading title={`${t('client.dashboard.welcome')}, ${session?.companyName ?? session?.name}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <KpiCard label={t('client.dashboard.ordersPlaced')} value={String(orders.length)} />
        <KpiCard label={t('client.dashboard.ordersInTransit')} value={String(inTransit)} />
        <KpiCard label={t('client.dashboard.quotes')} value={String(quotes.length)} />
        <KpiCard label={t('client.dashboard.accumulatedPurchases')} value={formatCurrency(accumulated)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink-950">{t('client.dashboard.recentOrders')}</p>
            <Link to="/portal/pedidos" className="text-xs text-gold-600 hover:underline">{t('client.dashboard.viewAll')}</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-950">{o.id}</span>
                <span className="text-ink-700">{formatCurrency(o.total)}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-ink-700">{t('client.dashboard.noOrdersYet')}</p>}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink-950">{t('client.dashboard.recentQuotes')}</p>
            <Link to="/portal/cotizaciones" className="text-xs text-gold-600 hover:underline">{t('client.dashboard.viewAll')}</Link>
          </div>
          <div className="space-y-3">
            {quotes.slice(0, 5).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-950">{q.id}</span>
                <span className="text-ink-700">{q.items.length} {t('client.dashboard.products')}</span>
                <QuoteStatusBadge status={q.status} />
              </div>
            ))}
            {quotes.length === 0 && <p className="text-sm text-ink-700">{t('client.dashboard.noQuotesYet')}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
