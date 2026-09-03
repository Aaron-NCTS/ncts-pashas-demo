import { useEffect, useMemo, useState } from 'react';
import { listOrders, advanceOrderStatus, setOrderStatus } from '../../services/api';
import { SectionHeading, Card, Modal, Button } from '../../components/ui/primitives';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import { OrderTimeline } from '../../components/shared/OrderTimeline';
import { formatCurrency } from '../../config/brand';
import type { Order, OrderStatus } from '../../types';
import { Search } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { ORDER_STATUS_LABEL, labelFor } from '../../i18n/statusLabels';

const ALL_STATUSES: (OrderStatus | 'Todos')[] = [
  'Todos', 'Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado',
  'Enviado', 'En tránsito', 'En reparto', 'Entregado', 'Incidencia',
];

export function AdminOrders() {
  const { showToast } = useApp();
  const { t, lang } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'Todos'>('Todos');
  const [selected, setSelected] = useState<Order | null>(null);

  function reload() { listOrders().then(setOrders); }
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || (o.companyName ?? o.customerName).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  async function handleAdvance(order: Order) {
    const updated = await advanceOrderStatus(order.id);
    if (updated) {
      setSelected(updated); reload();
      showToast(t('admin.orders.orderUpdatedToast').replace('{id}', order.id).replace('{status}', labelFor(ORDER_STATUS_LABEL, updated.status, lang)), 'success');
    }
  }

  async function handleIncident(order: Order) {
    const updated = await setOrderStatus(order.id, 'Incidencia', t('admin.orders.manualIncidentNote'));
    if (updated) { setSelected(updated); reload(); showToast(t('admin.orders.incidentToast'), 'error'); }
  }

  return (
    <div>
      <SectionHeading title={t('admin.orders.title')} description={`${orders.length} ${t('admin.orders.registered')}`} />

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.orders.searchPlaceholder')} className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'Todos')} className="border border-ink-950/15 rounded-sm px-3 py-2.5 text-sm bg-white focus-ring outline-none">
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s === 'Todos' ? t('common.all') : labelFor(ORDER_STATUS_LABEL, s, lang)}</option>)}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-5 py-3">{t('admin.orders.order')}</th><th className="px-5 py-3">{t('admin.orders.customer')}</th><th className="px-5 py-3">{t('admin.orders.date')}</th>
              <th className="px-5 py-3">{t('admin.orders.total')}</th><th className="px-5 py-3">{t('admin.orders.status')}</th><th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02]">
                <td className="px-5 py-3 font-medium text-ink-950">{o.id}</td>
                <td className="px-5 py-3 text-ink-700">{o.companyName ?? o.customerName}</td>
                <td className="px-5 py-3 text-ink-700">{new Date(o.createdAt).toLocaleDateString(locale)}</td>
                <td className="px-5 py-3 text-ink-700">{formatCurrency(o.total)}</td>
                <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setSelected(o)} className="text-xs text-gold-600 hover:underline">{t('admin.orders.viewDetail')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-sm text-ink-700 text-center py-10">{t('admin.orders.noResults')}</p>}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${t('admin.orders.order')} ${selected.id}` : ''} wide>
        {selected && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-ink-700 mb-1">{t('admin.orders.customer')}</p>
              <p className="text-sm font-medium text-ink-950 mb-4">{selected.companyName ?? selected.customerName}</p>
              <p className="text-xs text-ink-700 mb-1">{t('admin.orders.products')}</p>
              <ul className="text-sm text-ink-700 space-y-1 mb-4">
                {selected.items.map((it) => <li key={it.productId} className="flex justify-between"><span>{it.quantity}× {it.name}</span><span>{formatCurrency(it.unitPrice * it.quantity)}</span></li>)}
              </ul>
              <div className="text-sm space-y-1 border-t border-ink-950/10 pt-3 mb-6">
                <div className="flex justify-between text-ink-700"><span>{t('common.subtotal')}</span><span>{formatCurrency(selected.subtotal)}</span></div>
                <div className="flex justify-between text-ink-700"><span>{t('common.discount')}</span><span>-{formatCurrency(selected.discount)}</span></div>
                <div className="flex justify-between text-ink-700"><span>{t('common.shipping')}</span><span>{formatCurrency(selected.shipping)}</span></div>
                <div className="flex justify-between font-medium text-ink-950"><span>{t('common.total')}</span><span>{formatCurrency(selected.total)}</span></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selected.status !== 'Entregado' && selected.status !== 'Incidencia' && (
                  <Button size="sm" onClick={() => handleAdvance(selected)}>{t('admin.orders.advanceStatus')}</Button>
                )}
                {selected.status !== 'Incidencia' && <Button size="sm" variant="danger" onClick={() => handleIncident(selected)}>{t('admin.orders.markIncident')}</Button>}
              </div>
            </div>
            <div>
              <OrderTimeline order={selected} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
