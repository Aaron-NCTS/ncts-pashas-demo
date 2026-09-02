import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProducts, listQuotes, requestQuote, acceptQuote } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, Button, Modal, Field, inputClass, EmptyState, Skeleton } from '../../components/ui/primitives';
import { QuoteStatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../config/brand';
import type { Product, Quote, QuoteItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

export function ClientQuotes() {
  const { session, showToast, addToCart } = useApp();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [message, setMessage] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(10);

  function reload() {
    listQuotes().then((all) => setQuotes(all.filter((q) => q.customerName === session?.name || q.companyName === session?.companyName)));
  }

  useEffect(() => { reload(); listProducts().then(setProducts); }, [session]);

  function addItem() {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems((prev) => [...prev, { productId: p.id, name: p.name, quantity: qty }]);
    setProductId('');
    setQty(10);
  }

  async function submit() {
    if (items.length === 0) { showToast('Agrega al menos un producto', 'error'); return; }
    await requestQuote({ customerId: 'cust-guest', customerName: session?.name ?? '', companyName: session?.companyName, items, message });
    setOpen(false);
    setItems([]);
    setMessage('');
    reload();
    showToast('Cotización solicitada', 'success');
  }

  async function acceptAndCheckout(q: Quote) {
    await acceptQuote(q.id);
    q.items.forEach((it) => {
      const product = products.find((p) => p.id === it.productId);
      addToCart({
        productId: it.productId,
        name: it.name,
        sku: product?.sku ?? it.productId,
        quantity: it.quantity,
        unitPrice: it.proposedPrice ?? 0,
        mode: 'mayorista',
      });
    });
    reload();
    showToast(`Cotización ${q.id} aceptada — productos agregados al carrito`, 'success');
    navigate('/checkout');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Cotizaciones" />
        <Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> Nueva cotización</Button>
      </div>

      {quotes === null ? <Skeleton className="h-64" /> : quotes.length === 0 ? (
        <EmptyState title="Sin cotizaciones" message="Solicita una cotización mayorista para tu próximo pedido." />
      ) : (
        <div className="grid gap-4">
          {quotes.map((q) => (
            <Card key={q.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-ink-950">{q.id}</p>
                <QuoteStatusBadge status={q.status} />
              </div>
              <ul className="text-sm text-ink-700 space-y-1 mb-3">
                {q.items.map((it) => (
                  <li key={it.productId} className="flex justify-between">
                    <span>{it.quantity}× {it.name}</span>
                    {it.proposedPrice ? <span>{formatCurrency(it.proposedPrice * it.quantity)}</span> : null}
                  </li>
                ))}
              </ul>
              {q.adminNote && <p className="text-xs text-ink-700/70 italic mb-3">"{q.adminNote}"</p>}
              <div className="flex items-center justify-between">
                {q.total ? <p className="text-sm font-medium text-ink-950">Total propuesto: {formatCurrency(q.total)}</p> : <span />}
                {q.status === 'Cotizada' && (
                  <Button size="sm" onClick={() => acceptAndCheckout(q)}>Aceptar y generar pedido</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Solicitar cotización mayorista" wide>
        <div className="flex gap-3 items-end mb-4">
          <Field label="Producto">
            <select className={inputClass} value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Selecciona un producto</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Cantidad">
            <input type="number" min={1} className={inputClass} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </Field>
          <Button variant="secondary" onClick={addItem} className="mb-4">Agregar</Button>
        </div>
        {items.length > 0 && (
          <ul className="mb-4 space-y-2">
            {items.map((it, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-ink-950/5 rounded-sm px-3 py-2">
                <span>{it.quantity}× {it.name}</span>
                <button onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))} className="text-ink-700/60 hover:text-oxblood-500"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        )}
        <Field label="Mensaje (opcional)"><textarea rows={3} className={inputClass} value={message} onChange={(e) => setMessage(e.target.value)} /></Field>
        <Button onClick={submit} className="w-full">Enviar solicitud</Button>
      </Modal>
    </div>
  );
}
