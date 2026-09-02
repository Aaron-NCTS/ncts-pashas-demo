import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { listProducts } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, EmptyState, Skeleton } from '../../components/ui/primitives';
import { ProductImage } from '../../components/ui/ProductImage';
import { formatCurrency } from '../../config/brand';
import type { Product } from '../../types';

export function ClientFavorites() {
  const { favorites, toggleFavorite, session } = useApp();
  const [products, setProducts] = useState<Product[] | null>(null);
  const isWholesale = session?.role === 'distributor';

  useEffect(() => { listProducts().then(setProducts); }, []);

  const favProducts = (products ?? []).filter((p) => favorites.includes(p.id));

  return (
    <div>
      <SectionHeading title="Favoritos" description="Productos que has guardado para comprar después." />
      {products === null ? <Skeleton className="h-64" /> : favProducts.length === 0 ? (
        <EmptyState title="Sin favoritos" message="Marca productos con el corazón desde su página de detalle para verlos aquí." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {favProducts.map((p) => (
            <Card key={p.id} className="overflow-hidden flex flex-col">
              <Link to={`/productos/${p.id}`}><ProductImage gradient={p.image} category={p.category} className="h-32 w-full" /></Link>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm font-medium text-ink-950 mb-2 leading-snug">{p.name}</p>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-950">{formatCurrency(isWholesale ? p.wholesalePrice : p.publicPrice)}</p>
                  <button onClick={() => toggleFavorite(p.id)} aria-label="Quitar de favoritos" className="text-oxblood-500 focus-ring rounded-sm">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
