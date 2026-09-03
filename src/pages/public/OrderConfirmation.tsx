import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getOrder } from '../../services/api';
import type { Order } from '../../types';
import { Button, Card, Skeleton } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';
import { useLanguage } from '../../i18n/LanguageContext';
import { PAYMENT_METHOD_LABEL, DELIVERY_METHOD_LABEL, labelFor } from '../../i18n/statusLabels';

export function OrderConfirmation() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => { if (id) getOrder(id).then((o) => setOrder(o ?? null)); }, [id]);

  if (order === undefined) return <div className="max-w-xl mx-auto px-5 py-20"><Skeleton className="h-64" /></div>;
  if (order === null) return <div className="max-w-xl mx-auto px-5 py-20 text-center text-ink-700">{t('pages.orderConfirmation.notFound')}</div>;

  return (
    <div className="max-w-xl mx-auto px-5 md:px-8 py-20">
      <Card className="p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-signal-green mx-auto mb-5" strokeWidth={1.2} />
        <p className="font-display text-2xl text-ink-950 mb-1">{t('pages.orderConfirmation.confirmed')}</p>
        <p className="text-sm text-ink-700 mb-6">{t('pages.orderConfirmation.orderNumber')}</p>
        <p className="font-display text-3xl text-gold-600 mb-8 tracking-wide">{order.id}</p>
        <div className="text-left text-sm text-ink-700 space-y-1.5 mb-8 border-t border-b border-ink-950/10 py-5">
          <div className="flex justify-between"><span>{t('common.total')}</span><span className="font-medium text-ink-950">{formatCurrency(order.total)}</span></div>
          <div className="flex justify-between"><span>{t('pages.orderConfirmation.paymentMethod')}</span><span className="font-medium text-ink-950">{labelFor(PAYMENT_METHOD_LABEL, order.paymentMethod, lang)}</span></div>
          <div className="flex justify-between"><span>{t('pages.orderConfirmation.delivery')}</span><span className="font-medium text-ink-950">{labelFor(DELIVERY_METHOD_LABEL, order.deliveryMethod, lang)}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={`/seguimiento/${order.id}`}><Button>{t('pages.orderConfirmation.trackOrder')}</Button></Link>
          <Link to="/productos"><Button variant="secondary">{t('pages.orderConfirmation.keepShopping')}</Button></Link>
        </div>
      </Card>
    </div>
  );
}
