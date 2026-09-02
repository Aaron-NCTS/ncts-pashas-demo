import { useEffect, useState } from 'react';
import { listTickets, createTicket } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, Button, Modal, Field, inputClass, EmptyState, Skeleton } from '../../components/ui/primitives';
import { TicketStatusBadge } from '../../components/ui/StatusBadge';
import type { SupportTicket, TicketCategory } from '../../types';
import { Plus } from 'lucide-react';

const CATEGORIES: TicketCategory[] = ['Problema con pedido', 'Facturación', 'Producto', 'Entrega', 'Otro'];

export function ClientSupport() {
  const { session, showToast } = useApp();
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<TicketCategory>('Problema con pedido');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function reload() {
    listTickets().then((all) => setTickets(all.filter((t) => t.customerName === session?.name)));
  }
  useEffect(() => { reload(); }, [session]);

  async function submit() {
    if (!subject || !message) { showToast('Completa asunto y mensaje', 'error'); return; }
    await createTicket({ customerId: 'cust-guest', customerName: session?.name ?? '', category, subject, message });
    setOpen(false); setSubject(''); setMessage('');
    reload();
    showToast('Ticket creado', 'success');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Soporte" />
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Nuevo ticket</Button>
      </div>
      {tickets === null ? <Skeleton className="h-64" /> : tickets.length === 0 ? (
        <EmptyState title="Sin tickets" message="Si tienes algún problema, crea un ticket y te ayudaremos." />
      ) : (
        <div className="grid gap-4">
          {tickets.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-gold-600 mb-0.5">{t.category} · {t.id}</p>
                  <p className="font-medium text-ink-950">{t.subject}</p>
                </div>
                <TicketStatusBadge status={t.status} />
              </div>
              <p className="text-sm text-ink-700">{t.message}</p>
              {t.replies.map((r, i) => (
                <div key={i} className="mt-3 bg-ink-950/5 rounded-sm px-3 py-2">
                  <p className="text-xs font-medium text-ink-950">{r.author}</p>
                  <p className="text-sm text-ink-700">{r.message}</p>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo ticket de soporte">
        <Field label="Categoría">
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Asunto"><input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label="Mensaje"><textarea rows={4} className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
        <Button onClick={submit} className="w-full">Enviar ticket</Button>
      </Modal>
    </div>
  );
}
