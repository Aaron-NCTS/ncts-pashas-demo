import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { Button, Card, Field, inputClass, SectionHeading } from '../../components/ui/primitives';
import { createOrder } from '../../services/api';
import { formatCurrency } from '../../config/brand';
import type { Order } from '../../types';

export function Checkout() {
  const { cart, cartSubtotal, clearCart, session, showToast } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const shipping = cartSubtotal > 3000 ? 0 : 180;
  const [form, setForm] = useState({
    name: session?.name ?? '', companyName: session?.companyName ?? '', rfc: '',
    address: '', city: '', state: '', zip: '', phone: '', email: session?.email ?? '',
    deliveryMethod: 'Envío estándar' as Order['deliveryMethod'],
    paymentMethod: 'Transferencia' as Order['paymentMethod'],
  });

  if (cart.length === 0) return <Navigate to="/carrito" replace />;

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const order = await createOrder({
      customerId: session?.role === 'admin' ? 'guest' : 'cust-guest',
      customerName: form.name || 'Cliente demo',
      companyName: form.companyName || undefined,
      items: cart,
      discount: 0,
      shipping,
      paymentMethod: form.paymentMethod,
      deliveryMethod: form.deliveryMethod,
      address: form.address || 'Dirección demo',
      city: form.city || 'Ciudad de México',
      state: form.state || 'CDMX',
    });
    clearCart();
    setLoading(false);
    showToast(`Pedido ${order.id} creado`, 'success');
    navigate(`/pedido-confirmado/${order.id}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <SectionHeading title="Checkout" description="Este es un checkout de demostración: no se procesan pagos reales." />
      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-ink-950 mb-4">Datos de facturación</p>
            <div className="grid md:grid-cols-2 gap-x-6">
              <Field label="Nombre"><input required className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
              <Field label="Empresa"><input className={inputClass} value={form.companyName} onChange={(e) => update('companyName', e.target.value)} /></Field>
              <Field label="RFC (opcional)"><input className={inputClass} value={form.rfc} onChange={(e) => update('rfc', e.target.value)} /></Field>
              <Field label="Teléfono"><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
              <Field label="Correo"><input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-ink-950 mb-4">Dirección de entrega</p>
            <Field label="Dirección"><input required className={inputClass} value={form.address} onChange={(e) => update('address', e.target.value)} /></Field>
            <div className="grid md:grid-cols-3 gap-x-6">
              <Field label="Ciudad"><input required className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} /></Field>
              <Field label="Estado"><input required className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)} /></Field>
              <Field label="Código postal"><input className={inputClass} value={form.zip} onChange={(e) => update('zip', e.target.value)} /></Field>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-ink-950 mb-4">Método de entrega</p>
            <div className="grid grid-cols-3 gap-3">
              {(['Envío estándar', 'Envío express', 'Recoger'] as const).map((m) => (
                <button
                  type="button" key={m}
                  onClick={() => update('deliveryMethod', m)}
                  className={`px-3 py-3 rounded-sm text-xs border focus-ring ${form.deliveryMethod === m ? 'border-gold-500 bg-gold-500/10 text-ink-950' : 'border-ink-950/15 text-ink-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-medium text-ink-950 mb-4">Método de pago (demo)</p>
            <div className="grid grid-cols-3 gap-3">
              {(['Transferencia', 'Tarjeta', 'Pago pendiente'] as const).map((m) => (
                <button
                  type="button" key={m}
                  onClick={() => update('paymentMethod', m)}
                  className={`px-3 py-3 rounded-sm text-xs border focus-ring ${form.paymentMethod === m ? 'border-gold-500 bg-gold-500/10 text-ink-950' : 'border-ink-950/15 text-ink-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 h-fit">
          <p className="font-display text-lg text-ink-950 mb-4">Resumen del pedido</p>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
            {cart.map((c) => (
              <div key={c.productId} className="flex justify-between text-xs text-ink-700">
                <span className="truncate pr-2">{c.quantity}× {c.name}</span>
                <span className="shrink-0">{formatCurrency(c.unitPrice * c.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-ink-950/10 pt-3 mb-4">
            <div className="flex justify-between text-ink-700"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
            <div className="flex justify-between text-ink-700"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span></div>
            <div className="flex justify-between font-medium text-ink-950"><span>Total</span><span>{formatCurrency(cartSubtotal + shipping)}</span></div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Procesando...' : 'Confirmar pedido'}</Button>
        </Card>
      </form>
    </div>
  );
}
