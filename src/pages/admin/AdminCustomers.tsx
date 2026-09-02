import { useEffect, useMemo, useState } from 'react';
import { listCustomers, listOrders, listQuotes, addCustomerNote } from '../../services/api';
import { SectionHeading, Card, Modal, Badge, inputClass, Button } from '../../components/ui/primitives';
import { OrderStatusBadge, QuoteStatusBadge } from '../../components/ui/StatusBadge';
import type { Customer, Order, Quote } from '../../types';
import { formatCurrency } from '../../config/brand';
import { Search } from 'lucide-react';

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [note, setNote] = useState('');

  function reload() { listCustomers().then(setCustomers); }
  useEffect(() => { reload(); listOrders().then(setOrders); listQuotes().then(setQuotes); }, []);

  const filtered = useMemo(() => customers.filter((c) => !search || c.companyName.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())), [customers, search]);

  async function addNote() {
    if (!selected || !note) return;
    await addCustomerNote(selected.id, note);
    setNote('');
    reload();
    const updated = await listCustomers();
    setSelected(updated.find((c) => c.id === selected.id) ?? null);
  }

  const selectedOrders = selected ? orders.filter((o) => o.customerId === selected.id || o.customerName === selected.name) : [];
  const selectedQuotes = selected ? quotes.filter((q) => q.customerId === selected.id || q.customerName === selected.name) : [];

  return (
    <div>
      <SectionHeading title="Clientes" description={`${customers.length} clientes registrados — datos demostrativos`} />

      <div className="relative max-w-sm mb-5">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o empresa..." className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring outline-none" />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">WhatsApp</th><th className="px-4 py-3">Ciudad</th>
              <th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Última compra</th><th className="px-4 py-3">Compras totales</th><th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02] cursor-pointer">
                <td className="px-4 py-3">
                  <p className="text-ink-950 font-medium">{c.companyName}</p>
                  <p className="text-xs text-ink-700/60">{c.name}</p>
                </td>
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{c.whatsapp}</td>
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{c.city}</td>
                <td className="px-4 py-3 text-ink-700">{c.type}{c.isDistributor && ' · Distribuidor'}</td>
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{c.lastPurchaseDate ? new Date(c.lastPurchaseDate).toLocaleDateString('es-MX') : '—'}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(c.totalPurchases)}</td>
                <td className="px-4 py-3">{c.status === 'Activo' ? <Badge tone="green">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.companyName ?? ''} wide>
        {selected && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div><p className="text-xs text-ink-700">Contacto</p><p className="text-ink-950">{selected.name}</p></div>
              <div><p className="text-xs text-ink-700">WhatsApp</p><p className="text-ink-950">{selected.whatsapp}</p></div>
              <div><p className="text-xs text-ink-700">Correo</p><p className="text-ink-950 truncate">{selected.email}</p></div>
              <div><p className="text-xs text-ink-700">Ubicación</p><p className="text-ink-950">{selected.city}, {selected.state}</p></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-medium text-ink-700 uppercase mb-2">Pedidos</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedOrders.length === 0 && <p className="text-sm text-ink-700">Sin pedidos.</p>}
                  {selectedOrders.map((o) => (
                    <div key={o.id} className="flex justify-between text-sm"><span className="text-ink-950">{o.id}</span><OrderStatusBadge status={o.status} /></div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-700 uppercase mb-2">Cotizaciones</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedQuotes.length === 0 && <p className="text-sm text-ink-700">Sin cotizaciones.</p>}
                  {selectedQuotes.map((q) => (
                    <div key={q.id} className="flex justify-between text-sm"><span className="text-ink-950">{q.id}</span><QuoteStatusBadge status={q.status} /></div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs font-medium text-ink-700 uppercase mb-2">Notas</p>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {selected.notes.map((n, i) => <p key={i} className="text-sm bg-ink-950/5 rounded-sm px-3 py-2">{n}</p>)}
              {selected.notes.length === 0 && <p className="text-sm text-ink-700">Sin notas registradas.</p>}
            </div>
            <div className="flex gap-2">
              <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Agregar nota de seguimiento..." />
              <Button onClick={addNote}>Agregar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
