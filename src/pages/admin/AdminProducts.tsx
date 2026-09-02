import { useEffect, useMemo, useState } from 'react';
import { listProducts, upsertProduct, toggleProductActive } from '../../services/api';
import { SectionHeading, Card, Button, Modal, Field, inputClass, Badge } from '../../components/ui/primitives';
import { ProductImage } from '../../components/ui/ProductImage';
import type { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../config/brand';
import { Plus, Pencil, Search } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const CATEGORIES: ProductCategory[] = [
  'Tijeras profesionales', 'Tijeras de corte', 'Tijeras de entresacar', 'Kits de barbería',
  'Manicure', 'Pedicure', 'Kits de belleza', 'Accesorios profesionales',
];
const GRADIENTS = ['from-ink-900 via-ink-800 to-gold-600', 'from-ink-950 via-ink-700 to-gold-500', 'from-gold-700 via-ink-900 to-ink-950', 'from-ink-800 via-gold-600 to-ink-950'];

function emptyProduct(): Product {
  return {
    id: `prod-${Date.now()}`, sku: '', name: '', category: 'Tijeras profesionales', description: '',
    specs: [], material: '', presentation: '', publicPrice: 0, wholesalePrice: 0, stock: 0, minStock: 10,
    reservedStock: 0, warehouse: 'Almacén CDMX Central', image: GRADIENTS[0], volumeTiers: [], active: true, createdAt: new Date().toISOString(),
  };
}

export function AdminProducts() {
  const { showToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);

  function reload() { listProducts().then(setProducts); }
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [products, search]);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.sku) { showToast('Nombre y SKU son obligatorios', 'error'); return; }
    await upsertProduct(editing);
    setEditing(null);
    reload();
    showToast('Producto guardado', 'success');
  }

  async function toggleActive(p: Product) {
    await toggleProductActive(p.id);
    reload();
    showToast(p.active ? 'Producto desactivado' : 'Producto activado', 'success');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <SectionHeading title="Productos" description={`${products.length} productos en catálogo`} />
        <Button onClick={() => setEditing(emptyProduct())}><Plus className="w-4 h-4" /> Nuevo producto</Button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto o SKU..." className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring outline-none" />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3"></th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio público</th><th className="px-4 py-3">Precio mayorista</th><th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02]">
                <td className="px-4 py-2"><ProductImage gradient={p.image} category={p.category} className="w-10 h-10 rounded-sm" /></td>
                <td className="px-4 py-3">
                  <p className="text-ink-950 font-medium max-w-[220px] truncate">{p.name}</p>
                  <p className="text-xs text-ink-700/60">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(p.publicPrice)}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(p.wholesalePrice)}</td>
                <td className="px-4 py-3 text-ink-700">{p.stock}</td>
                <td className="px-4 py-3">{p.active ? <Badge tone="green">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => setEditing(p)} className="p-1.5 text-ink-700 hover:bg-ink-950/10 rounded-sm focus-ring" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(p)} className="text-xs text-gold-600 hover:underline px-1">{p.active ? 'Desactivar' : 'Activar'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && products.find((p) => p.id === editing.id) ? 'Editar producto' : 'Nuevo producto'} wide>
        {editing && (
          <div>
            <div className="grid md:grid-cols-2 gap-x-6">
              <Field label="Nombre"><input className={inputClass} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="SKU"><input className={inputClass} value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} /></Field>
              <Field label="Categoría">
                <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as ProductCategory })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Almacén"><input className={inputClass} value={editing.warehouse} onChange={(e) => setEditing({ ...editing, warehouse: e.target.value })} /></Field>
              <Field label="Precio público"><input type="number" className={inputClass} value={editing.publicPrice} onChange={(e) => setEditing({ ...editing, publicPrice: Number(e.target.value) })} /></Field>
              <Field label="Precio mayorista"><input type="number" className={inputClass} value={editing.wholesalePrice} onChange={(e) => setEditing({ ...editing, wholesalePrice: Number(e.target.value) })} /></Field>
              <Field label="Stock"><input type="number" className={inputClass} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} /></Field>
              <Field label="Stock mínimo"><input type="number" className={inputClass} value={editing.minStock} onChange={(e) => setEditing({ ...editing, minStock: Number(e.target.value) })} /></Field>
              <Field label="Material"><input className={inputClass} value={editing.material} onChange={(e) => setEditing({ ...editing, material: e.target.value })} /></Field>
              <Field label="Presentación"><input className={inputClass} value={editing.presentation} onChange={(e) => setEditing({ ...editing, presentation: e.target.value })} /></Field>
            </div>
            <Field label="Descripción"><textarea rows={3} className={inputClass} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Imagen (placeholder visual)">
              <div className="flex gap-2">
                {GRADIENTS.map((g) => (
                  <button key={g} onClick={() => setEditing({ ...editing, image: g })} className={`w-10 h-10 rounded-sm bg-gradient-to-br ${g} border-2 ${editing.image === g ? 'border-gold-500' : 'border-transparent'}`} />
                ))}
              </div>
            </Field>
            <Button onClick={save} className="w-full mt-2">Guardar producto</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
