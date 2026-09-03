import { useEffect, useState } from 'react';
import { listOrders } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAYMENT_METHOD_LABEL, labelFor } from '../../i18n/statusLabels';
import { SectionHeading, Card, EmptyState, Skeleton } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';
import type { Order } from '../../types';
import { Download } from 'lucide-react';

export function ClientBilling() {
  const { session, showToast } = useApp();
  const { t, lang } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    listOrders().then((all) => setOrders(all.filter((o) => o.customerName === session?.name || o.companyName === session?.companyName)));
  }, [session]);

  return (
    <div>
      <SectionHeading title={t('client.billing.title')} description={t('client.billing.description')} />
      {orders === null ? <Skeleton className="h-64" /> : orders.length === 0 ? (
        <EmptyState title={t('client.billing.emptyTitle')} message={t('client.billing.emptyMsg')} />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
                <th className="px-5 py-3">{t('client.billing.order')}</th>
                <th className="px-5 py-3">{t('common.date')}</th>
                <th className="px-5 py-3">{t('client.billing.paymentMethod')}</th>
                <th className="px-5 py-3">{t('common.total')}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink-950/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-950">{o.id}</td>
                  <td className="px-5 py-3 text-ink-700">{new Date(o.createdAt).toLocaleDateString(locale)}</td>
                  <td className="px-5 py-3 text-ink-700">{labelFor(PAYMENT_METHOD_LABEL, o.paymentMethod, lang)}</td>
                  <td className="px-5 py-3 text-ink-700">{formatCurrency(o.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => showToast(t('client.billing.demoReceiptToast'), 'info')} className="text-xs text-gold-600 hover:underline inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> {t('client.billing.receipt')}
                    </button>
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
