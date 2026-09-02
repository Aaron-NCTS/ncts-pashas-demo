import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { listProducts } from '../../services/api';
import type { Product, ProductCategory } from '../../types';
import { ProductImage } from '../../components/ui/ProductImage';
import { Card, EmptyState, Skeleton, SectionHeading, Badge } from '../../components/ui/primitives';
import { formatCurrency } from '../../config/brand';
import { useApp } from '../../store/AppContext';

const CATEGORIES: ProductCategory[] = [
  'Tijeras profesionales', 'Tijeras de corte', 'Tijeras de entresacar', 'Kits de barbería',
  'Manicure', 'Pedicure', 'Kits de belleza', 'Accesorios profesionales',
];

export function Catalog() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState('');
  const { session } = useApp();
  const activeCategory = params.get('categoria') as ProductCategory | null;
  const isWholesale = session?.role === 'distributor';

  useEffect(() => { listProducts().then((p) => setProducts(p.filter((x) => x.active))); }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCat = !activeCategory || p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <SectionHeading eyebrow="Catálogo" title="Herramientas profesionales" description="Precios demostrativos. Los distribuidores acceden a precio mayorista automáticamente." />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring focus:border-gold-500 outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParams({})}
            className={`px-3 py-1.5 rounded-sm text-xs border focus-ring ${!activeCategory ? 'bg-ink-950 text-ivory-50 border-ink-950' : 'border-ink-950/15 text-ink-700 hover:border-gold-500'}`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setParams({ categoria: cat })}
              className={`px-3 py-1.5 rounded-sm text-xs border focus-ring ${activeCategory === cat ? 'bg-ink-950 text-ivory-50 border-ink-950' : 'border-ink-950/15 text-ink-700 hover:border-gold-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {products === null ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Sin resultados" message="No encontramos productos que coincidan con tu búsqueda o filtro." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <Link key={p.id} to={`/productos/${p.id}`}>
              <Card className="overflow-hidden hover:border-gold-500/50 transition-colors h-full flex flex-col">
                <ProductImage gradient={p.image} category={p.category} className="h-36 w-full" />
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-[11px] text-gold-600 mb-1">{p.category}</p>
                  <p className="text-sm font-medium text-ink-950 mb-1.5 leading-snug">{p.name}</p>
                  <p className="text-[11px] text-ink-700/70 mb-2">SKU {p.sku}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-950">{formatCurrency(isWholesale ? p.wholesalePrice : p.publicPrice)}</p>
                    {p.stock === 0 ? <Badge tone="red">Agotado</Badge> : p.stock <= p.minStock ? <Badge tone="amber">Pocas unidades</Badge> : null}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
