import { useEffect, useState } from 'react';
import { listOrders } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, EmptyState, Skeleton } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';
import type { Order } from '../../types';
import { Download } from 'lucide-react';

export function ClientBilling() {
  const { session, showToast } = useApp();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    listOrders().then((all) => setOrders(all.filter((o) => o.customerName === session?.name || o.companyName === session?.companyName)));
  }, [session]);

  return (
    <div>
      <SectionHeading title="Facturación" description="Historial de comprobantes por pedido. Facturación fiscal disponible bajo solicitud." />
      {orders === null ? <Skeleton className="h-64" /> : orders.length === 0 ? (
        <EmptyState title="Sin comprobantes" message="Tus comprobantes de pedido aparecerán aquí." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Método de pago</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink-950/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-950">{o.id}</td>
                  <td className="px-5 py-3 text-ink-700">{new Date(o.createdAt).toLocaleDateString('es-MX')}</td>
                  <td className="px-5 py-3 text-ink-700">{o.paymentMethod}</td>
                  <td className="px-5 py-3 text-ink-700">{formatCurrency(o.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => showToast('Comprobante demo — no se genera PDF real', 'info')} className="text-xs text-gold-600 hover:underline inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Comprobante
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
