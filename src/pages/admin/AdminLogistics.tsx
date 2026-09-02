import { useEffect, useMemo, useState } from 'react';
import { listOrders, updateOrderPrep, advanceOrderStatus } from '../../services/api';
import { SectionHeading, Card, Button, Modal } from '../../components/ui/primitives';
import { OrderTimeline } from '../../components/shared/OrderTimeline';
import type { Order } from '../../types';
import { useApp } from '../../store/AppContext';

const GROUPS: { title: string; statuses: Order['status'][] }[] = [
  { title: 'Por preparar', statuses: ['Pedido recibido', 'Pago confirmado'] },
  { title: 'Empacados', statuses: ['Preparando pedido', 'Empacado'] },
  { title: 'Listos para envío / en tránsito', statuses: ['Enviado', 'En tránsito', 'En reparto'] },
  { title: 'Entregados', statuses: ['Entregado'] },
  { title: 'Incidencia', statuses: ['Incidencia'] },
];

export function AdminLogistics() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prepOrder, setPrepOrder] = useState<Order | null>(null);
  const [detail, setDetail] = useState<Order | null>(null);

  function reload() { listOrders().then(setOrders); }
  useEffect(() => { reload(); }, []);

  const grouped = useMemo(() => GROUPS.map((g) => ({ ...g, orders: orders.filter((o) => g.statuses.includes(o.status)) })), [orders]);

  async function togglePrep(order: Order, key: 'productPrepared' | 'productPacked' | 'orderVerified') {
    const current = order.prep ?? { productPrepared: false, productPacked: false, orderVerified: false };
    const updated = await updateOrderPrep(order.id, { [key]: !current[key] });
    if (updated) { setPrepOrder(updated); reload(); }
  }

  async function markReadyToShip(order: Order) {
    await advanceOrderStatus(order.id);
    setPrepOrder(null);
    reload();
    showToast(`Pedido ${order.id} listo para envío`, 'success');
  }

  return (
    <div>
      <SectionHeading title="Logística" description="Flujo de almacén, preparación y seguimiento de envíos — datos demostrativos." />

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
                    <button onClick={() => setDetail(o)} className="text-xs text-gold-600 hover:underline">Detalle</button>
                    {['Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado'].includes(o.status) && (
                      <button onClick={() => setPrepOrder(o)} className="text-xs text-ink-700 hover:underline">Preparar</button>
                    )}
                  </div>
                </div>
              ))}
              {g.orders.length === 0 && <p className="text-xs text-ink-700/60">Sin pedidos en esta etapa.</p>}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!prepOrder} onClose={() => setPrepOrder(null)} title={prepOrder ? `Preparar pedido ${prepOrder.id}` : ''}>
        {prepOrder && (
          <div>
            <ul className="text-sm text-ink-700 space-y-1 mb-5">
              {prepOrder.items.map((it) => <li key={it.productId}>{it.quantity}× {it.name}</li>)}
            </ul>
            <div className="space-y-3 mb-6">
              {([
                { key: 'productPrepared', label: 'Producto preparado' },
                { key: 'productPacked', label: 'Producto empacado' },
                { key: 'orderVerified', label: 'Pedido verificado' },
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
              Marcar listo para envío
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `Envío — ${detail.id}` : ''} wide>
        {detail && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-ink-700 mb-1">Cliente</p>
              <p className="text-sm font-medium text-ink-950 mb-4">{detail.companyName ?? detail.customerName}</p>
              <p className="text-xs text-ink-700 mb-1">Dirección</p>
              <p className="text-sm text-ink-950 mb-4">{detail.address}, {detail.city}, {detail.state}</p>
              <p className="text-xs text-ink-700 mb-1">Transportista</p>
              <p className="text-sm text-ink-950 mb-4">{detail.carrier ?? 'Por asignar'}</p>
              <p className="text-xs text-ink-700 mb-1">Guía</p>
              <p className="text-sm text-ink-950">{detail.trackingNumber ?? '—'}</p>
            </div>
            <OrderTimeline order={detail} />
          </div>
        )}
      </Modal>
    </div>
  );
}
