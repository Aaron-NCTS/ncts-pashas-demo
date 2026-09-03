import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listOrders } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, EmptyState } from '../../components/ui/primitives';
import { OrderTimeline } from '../../components/shared/OrderTimeline';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import type { Order } from '../../types';
import { formatCurrency } from '../../config/brand';
import { useLanguage } from '../../i18n/LanguageContext';

export function ClientTracking() {
  const { session } = useApp();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('pedido');

  useEffect(() => {
    listOrders().then((all) => {
      const mine = all.filter((o) => o.customerName === session?.name || o.companyName === session?.companyName);
      setOrders(mine);
      if (!selectedId && mine.length > 0) setParams({ pedido: mine[0].id });
    });
  }, [session]);

  const selected = orders.find((o) => o.id === selectedId);

  if (orders.length === 0) {
    return <div><SectionHeading title={t('client.tracking.title')} /><EmptyState title={t('client.tracking.emptyTitle')} message={t('client.tracking.emptyMsg')} /></div>;
  }

  return (
    <div>
      <SectionHeading title={t('client.tracking.title')} />
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-3 h-fit md:col-span-1">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => setParams({ pedido: o.id })}
              className={`w-full text-left px-3 py-3 rounded-sm mb-1 last:mb-0 focus-ring ${selectedId === o.id ? 'bg-gold-500/10' : 'hover:bg-ink-950/5'}`}
            >
              <p className="text-sm font-medium text-ink-950">{o.id}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-ink-700">{formatCurrency(o.total)}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            </button>
          ))}
        </Card>
        <Card className="p-6 md:col-span-2">
          {selected && <OrderTimeline order={selected} />}
        </Card>
      </div>
    </div>
  );
}
