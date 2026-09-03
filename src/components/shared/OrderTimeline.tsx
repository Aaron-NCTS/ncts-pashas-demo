import { Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ORDER_STATUS_LABEL, labelFor } from '../../i18n/statusLabels';
import type { Order, OrderStatus } from '../../types';

const FLOW: OrderStatus[] = [
  'Pedido recibido', 'Pago confirmado', 'Preparando pedido', 'Empacado',
  'Enviado', 'En tránsito', 'En reparto', 'Entregado',
];

export function OrderTimeline({ order }: { order: Order }) {
  const { lang } = useLanguage();
  const currentIdx = FLOW.indexOf(order.status);
  const isIncident = order.status === 'Incidencia';
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const incidentMsg = lang === 'en'
    ? 'This order has an issue. Contact support for more information.'
    : 'Este pedido presenta una incidencia. Contacta a soporte para más información.';

  return (
    <div>
      {isIncident && (
        <div className="flex items-center gap-2 bg-oxblood-500/10 text-oxblood-600 text-sm px-4 py-3 rounded-sm mb-6">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {incidentMsg}
        </div>
      )}
      <ol className="relative border-l border-ink-950/15 ml-3">
        {FLOW.map((step, i) => {
          const done = !isIncident && i <= currentIdx;
          const entry = order.timeline.find((entry) => entry.status === step);
          return (
            <li key={step} className="mb-7 ml-6 last:mb-0">
              <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${done ? 'bg-gold-500' : 'bg-ivory-200 border border-ink-950/15'}`}>
                {done ? <Check className="w-3.5 h-3.5 text-ink-950" /> : null}
              </span>
              <p className={`text-sm font-medium ${done ? 'text-ink-950' : 'text-ink-700/50'}`}>{labelFor(ORDER_STATUS_LABEL, step, lang)}</p>
              {entry && (
                <p className="text-xs text-ink-700/70 mt-0.5">
                  {new Date(entry.date).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  {entry.note ? ` — ${entry.note}` : ''}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
