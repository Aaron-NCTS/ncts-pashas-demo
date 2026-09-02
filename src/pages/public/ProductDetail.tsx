import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MessageCircle, ShoppingBag, FileText } from 'lucide-react';
import { getProduct } from '../../services/api';
import type { Product } from '../../types';
import { ProductImage } from '../../components/ui/ProductImage';
import { Button, Skeleton } from '../../components/ui/primitives';
import { StockStatusBadge } from '../../components/ui/StatusBadge';
import { stockStatusOf } from '../../data/seed';
import { brand, formatCurrency } from '../../config/brand';
import { useApp } from '../../store/AppContext';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, session } = useApp();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const isWholesale = session?.role === 'distributor';

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((p) => setProduct(p ?? null));
  }, [id]);

  if (product === undefined) {
    return <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>;
  }
  if (product === null) {
    return <div className="max-w-6xl mx-auto px-5 py-24 text-center text-ink-700">Producto no encontrado. <Link to="/productos" className="text-gold-600 hover:underline">Volver al catálogo</Link></div>;
  }

  const price = isWholesale ? product.wholesalePrice : product.publicPrice;
  const status = stockStatusOf(product);
  const waMessage = encodeURIComponent(`Hola, me interesa el producto ${product.name} (SKU ${product.sku}).`);

  function handleAddToCart() {
    addToCart({ productId: product!.id, name: product!.name, sku: product!.sku, quantity: qty, unitPrice: price, mode: isWholesale ? 'mayorista' : 'regular' });
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImage gradient={product.image} category={product.category} className="h-96 rounded-md" />

        <div>
          <p className="text-xs text-gold-600 mb-2">{product.category}</p>
          <h1 className="font-display text-3xl text-ink-950 mb-2">{product.name}</h1>
          <p className="text-xs text-ink-700/70 mb-4">SKU {product.sku}</p>

          <div className="flex items-center gap-3 mb-1">
            <p className="font-display text-2xl text-ink-950">{formatCurrency(price)}</p>
            <StockStatusBadge status={status} />
          </div>
          {isWholesale && <p className="text-xs text-gold-600 mb-4">Precio especial para distribuidores</p>}
          {!isWholesale && <p className="text-xs text-ink-700 mb-4">Precios demostrativos — <Link to="/distribuidores" className="text-gold-600 hover:underline">conviértete en distribuidor</Link> para precio mayorista</p>}

          <p className="text-sm text-ink-700 leading-relaxed mb-6">{product.description}</p>

          <ul className="text-sm text-ink-800 space-y-1.5 mb-6">
            {product.specs.map((s) => <li key={s} className="flex gap-2"><span className="text-gold-500">—</span>{s}</li>)}
          </ul>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-ink-950/15 rounded-sm">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-ink-700 hover:text-ink-950 focus-ring">−</button>
              <input readOnly value={qty} className="w-12 text-center text-sm border-x border-ink-950/15 py-2" />
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-ink-700 hover:text-ink-950 focus-ring">+</button>
            </div>
            <Button onClick={handleAddToCart} disabled={status === 'Agotado'}>
              <ShoppingBag className="w-4 h-4" /> Agregar al carrito
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => { handleAddToCart(); navigate('/carrito'); }}>Comprar ahora</Button>
            <a href={`https://wa.me/${brand.contact.whatsapp}?text=${waMessage}`} target="_blank" rel="noreferrer">
              <Button variant="ghost"><MessageCircle className="w-4 h-4" /> Consultar por WhatsApp</Button>
            </a>
            <Link to="/portal/cotizaciones">
              <Button variant="ghost"><FileText className="w-4 h-4" /> Solicitar cotización</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <p className="text-sm font-medium text-ink-950 mb-1">Precios por volumen</p>
        <p className="text-xs text-ink-700 mb-4">Tabla demostrativa — los precios finales se confirman según cotización.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          {product.volumeTiers.map((tier) => (
            <div key={tier.minQty} className="border border-ink-950/10 rounded-md p-4">
              <p className="text-xs text-ink-700 mb-1">{tier.maxQty ? `${tier.minQty}–${tier.maxQty} unidades` : `${tier.minQty}+ unidades`}</p>
              <p className="font-display text-lg text-ink-950">{formatCurrency(tier.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
