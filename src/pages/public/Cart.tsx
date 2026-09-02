import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { Button, Card, EmptyState, SectionHeading } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';

export function Cart() {
  const { cart, updateCartQty, removeFromCart, cartSubtotal } = useApp();
  const navigate = useNavigate();
  const shipping = cartSubtotal > 3000 || cartSubtotal === 0 ? 0 : 180;
  const total = cartSubtotal + shipping;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <SectionHeading title="Tu carrito" />
      {cart.length === 0 ? (
        <EmptyState
          title="Tu carrito está vacío"
          message="Explora el catálogo y agrega productos para comenzar tu pedido."
          action={<Link to="/productos"><Button>Ver catálogo</Button></Link>}
        />
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-3">
            {cart.map((item) => (
              <Card key={item.productId} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-950 truncate">{item.name}</p>
                  <p className="text-xs text-ink-700/70">SKU {item.sku} · {item.mode === 'mayorista' ? 'Precio mayorista' : 'Precio público'}</p>
                </div>
                <div className="flex items-center border border-ink-950/15 rounded-sm">
                  <button onClick={() => updateCartQty(item.productId, item.quantity - 1)} className="px-2.5 py-1.5 text-ink-700 focus-ring">−</button>
                  <span className="w-10 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.productId, item.quantity + 1)} className="px-2.5 py-1.5 text-ink-700 focus-ring">+</button>
                </div>
                <p className="text-sm font-medium text-ink-950 w-24 text-right">{formatCurrency(item.unitPrice * item.quantity)}</p>
                <button onClick={() => removeFromCart(item.productId)} className="text-ink-700/60 hover:text-oxblood-500 focus-ring rounded-sm p-1" aria-label="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>

          <Card className="p-6 h-fit">
            <p className="font-display text-lg text-ink-950 mb-4">Resumen</p>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-ink-700"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
              <div className="flex justify-between text-ink-700"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span></div>
            </div>
            <div className="flex justify-between font-medium text-ink-950 border-t border-ink-950/10 pt-3 mb-6">
              <span>Total</span><span>{formatCurrency(total)}</span>
            </div>
            <Button className="w-full mb-2" onClick={() => navigate('/checkout')}>Ir a checkout</Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/portal/cotizaciones')}>Solicitar cotización</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
