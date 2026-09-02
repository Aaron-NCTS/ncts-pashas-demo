import { useEffect, useState } from 'react';
import { listQuotes, respondQuote } from '../../services/api';
import { SectionHeading, Card, Modal, Button, Field, inputClass } from '../../components/ui/primitives';
import { QuoteStatusBadge } from '../../components/ui/StatusBadge';
import type { Quote, QuoteStatus, QuoteItem } from '../../types';
import { formatCurrency } from '../../config/brand';
import { useApp } from '../../store/AppContext';


export function AdminQuotes() {
  const { showToast } = useApp();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [adminNote, setAdminNote] = useState('');

  function reload() { listQuotes().then(setQuotes); }
  useEffect(() => { reload(); }, []);

  function openQuote(q: Quote) {
    setSelected(q);
    setItems(q.items.map((it) => ({ ...it, proposedPrice: it.proposedPrice ?? 0 })));
    setAdminNote(q.adminNote ?? '');
  }

  async function respond(status: QuoteStatus) {
    if (!selected) return;
    await respondQuote(selected.id, { status, items, adminNote });
    setSelected(null);
    reload();
    showToast(`Cotización ${selected.id} → ${status}`, 'success');
  }

  return (
    <div>
      <SectionHeading title="Cotizaciones mayoristas" description={`${quotes.length} cotizaciones registradas — datos demostrativos`} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Folio</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Total propuesto</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02]">
                <td className="px-4 py-3 text-ink-950 font-medium">{q.id}</td>
                <td className="px-4 py-3 text-ink-700">{q.companyName ?? q.customerName}</td>
                <td className="px-4 py-3 text-ink-700">{q.items.length} productos</td>
                <td className="px-4 py-3 text-ink-700">{q.total ? formatCurrency(q.total) : '—'}</td>
                <td className="px-4 py-3"><QuoteStatusBadge status={q.status} /></td>
                <td className="px-4 py-3 text-right"><button onClick={() => openQuote(q)} className="text-xs text-gold-600 hover:underline">Gestionar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Cotización ${selected.id}` : ''} wide>
        {selected && (
          <div>
            <p className="text-xs text-ink-700 mb-1">Cliente</p>
            <p className="text-sm font-medium text-ink-950 mb-4">{selected.companyName ?? selected.customerName}</p>
            {selected.message && <p className="text-sm text-ink-700 italic mb-4">"{selected.message}"</p>}

            <p className="text-xs font-medium text-ink-700 uppercase mb-2">Productos y precio propuesto</p>
            <div className="space-y-2 mb-4">
              {items.map((it, i) => (
                <div key={it.productId} className="flex items-center gap-3">
                  <span className="text-sm text-ink-950 flex-1">{it.quantity}× {it.name}</span>
                  <input
                    type="number" className={`${inputClass} w-32`} value={it.proposedPrice ?? 0}
                    onChange={(e) => setItems((prev) => prev.map((x, idx) => idx === i ? { ...x, proposedPrice: Number(e.target.value) } : x))}
                  />
                  <span className="text-xs text-ink-700 w-24 text-right">{formatCurrency((it.proposedPrice ?? 0) * it.quantity)}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-ink-950 mb-4 text-right">Total: {formatCurrency(items.reduce((s, it) => s + it.quantity * (it.proposedPrice ?? 0), 0))}</p>

            <Field label="Nota para el cliente"><textarea rows={2} className={inputClass} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} /></Field>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => respond('Cotizada')}>Enviar cotización</Button>
              <Button variant="secondary" onClick={() => respond('En revisión')}>Marcar en revisión</Button>
              <Button variant="danger" onClick={() => respond('Rechazada')}>Rechazar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
