import { useEffect, useMemo, useState } from 'react';
import { listOrders, updateOrderPrep, advanceOrderStatus } from '../../services/api';
import { SectionHeading, Card, Button, Modal } from '../../components/ui/primitives';
import { OrderTimeline } from '../../components/shared/OrderTimeline';
import type { Order } from '../../types';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export function AdminLogistics() {
  const { showToast } = useApp();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prepOrder, setPrepOrder] = useState<Order | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);

  const GROUPS: { title: string; statuses: Order['status'][] }[] = [
    { title: t('admin.logistics.groupToPrep'), statuses: ['Pedido recibido', 'Pago confirmado'] },
    { title: t('admin.logistics.groupPacked'), statuses: ['Preparando pedido', 'Empacado'] },
    { title: t('admin.logistics.groupInTransit'), statuses: ['Enviado', 'En tránsito', 'En reparto'] },
    { title: t('admin.logistics.groupDelivered'), statuses: ['Entregado'] },
    { title: t('admin.logistics.groupIncident'), statuses: ['Incidencia'] },
  ];

  function reload() { listOrders().then(setOrders); }
  useEffect(() => { reload(); }, []);

  const grouped = useMemo(() => GROUPS.map((g) => ({ ...g, orders: orders.filter((o) => g.statuses.includes(o.status)) })), [orders, t]);

  async function togglePrep(order: Order, key: 'productPrepared' | 'productPacked' | 'orderVerified') {
    const current = order.prep ?? { productPrepared: false, productPacked: false, orderVerified: false };
    const updated = await updateOrderPrep(order.id, { [key]: !current[key] });
    if (updated) { setPrepOrder(updated); reload(); }
  }

  async function markReadyToShip(order: Order) {
    await advanceOrderStatus(order.id);
    setPrepOrder(null);
    reload();
    showToast(t('admin.logistics.readyToShipToast').replace('{id}', order.id), 'success');
  }

  return (
    <div>
      <SectionHeading title={t('admin.logistics.title')} description={t('admin.logistics.description')} />

      <div className="grid lg:grid-cols-2 gap-6">
        {grouped.map((g) => (
          <Card key={g.title} className="p-5">
            <p className="text-sm font-medium text-ink-950 mb-4">{g.title} <span className="text-ink-700 font-normal">({g.orders.length})</span></p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {g.orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm bg-ink-950/[0.03] rounded-sm px-3 py-2.5">
                  <div>
                    <p className="text-ink-950 font-medium">{o.id}</p>
                    <p className="text-xs text-ink-700">{o.companyName ?? o.customerName} · {o.city}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDetail(o)} className="text-xs text-gold-600 hover:underline">{t('admin.logistics.detail')}</button>
                    {['Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado'].includes(o.status) && (
                      <button onClick={() => setPrepOrder(o)} className="text-xs text-ink-700 hover:underline">{t('admin.logistics.prepare')}</button>
                    )}
                  </div>
                </div>
              ))}
              {g.orders.length === 0 && <p className="text-xs text-ink-700/60">{t('admin.logistics.noOrdersInStage')}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!prepOrder} onClose={() => setPrepOrder(null)} title={prepOrder ? `${t('admin.logistics.prepareOrderTitle')} ${prepOrder.id}` : ''}>
        {prepOrder && (
          <div>
            <ul className="text-sm text-ink-700 space-y-1 mb-5">
              {prepOrder.items.map((it) => <li key={it.productId}>{it.quantity}× {it.name}</li>)}
            </ul>
            <div className="space-y-3 mb-6">
              {([
                { key: 'productPrepared', label: t('admin.logistics.productPrepared') },
                { key: 'productPacked', label: t('admin.logistics.productPacked') },
                { key: 'orderVerified', label: t('admin.logistics.orderVerified') },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 text-sm text-ink-950 cursor-pointer">
                  <input type="checkbox" checked={prepOrder.prep?.[key] ?? false} onChange={() => togglePrep(prepOrder, key)} className="w-4 h-4 accent-gold-500" />
                  {label}
                </label>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={!(prepOrder.prep?.productPrepared && prepOrder.prep?.productPacked && prepOrder.prep?.orderVerified)}
              onClick={() => markReadyToShip(prepOrder)}
            >
              {t('admin.logistics.markReadyToShip')}
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `${t('admin.logistics.shipmentTitle')} — ${detail.id}` : ''} wide>
        {detail && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-ink-700 mb-1">{t('admin.logistics.customer')}</p>
              <p className="text-sm font-medium text-ink-950 mb-4">{detail.companyName ?? detail.customerName}</p>
              <p className="text-xs text-ink-700 mb-1">{t('admin.logistics.address')}</p>
              <p className="text-sm text-ink-950 mb-4">{detail.address}, {detail.city}, {detail.state}</p>
              <p className="text-xs text-ink-700 mb-1">{t('admin.logistics.carrier')}</p>
              <p className="text-sm text-ink-950 mb-4">{detail.carrier ?? t('admin.logistics.toBeAssigned')}</p>
              <p className="text-xs text-ink-700 mb-1">{t('admin.logistics.trackingNumber')}</p>
              <p className="text-sm text-ink-950">{detail.trackingNumber ?? '—'}</p>
            </div>
            <OrderTimeline order={detail} />
          </div>
        )}
      </Modal>
    </div>
  );
}
