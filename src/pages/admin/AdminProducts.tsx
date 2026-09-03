import { useEffect, useMemo, useState } from 'react';
import { listProducts, upsertProduct, toggleProductActive } from '../../services/api';
import { SectionHeading, Card, Button, Modal, Field, inputClass, Badge } from '../../components/ui/primitives';
import { ProductImage } from '../../components/ui/ProductImage';
import type { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../config/brand';
import { Plus, Pencil, Search } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATEGORY_LABEL, labelFor } from '../../i18n/statusLabels';

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
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);

  function reload() { listProducts().then(setProducts); }
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [products, search]);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.sku) { showToast(t('admin.products.requiredFieldsError'), 'error'); return; }
    await upsertProduct(editing);
    setEditing(null);
    reload();
    showToast(t('admin.products.savedToast'), 'success');
  }

  async function toggleActive(p: Product) {
    await toggleProductActive(p.id);
    reload();
    showToast(p.active ? t('admin.products.deactivatedToast') : t('admin.products.activatedToast'), 'success');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <SectionHeading title={t('admin.products.title')} description={`${products.length} ${t('admin.products.inCatalog')}`} />
        <Button onClick={() => setEditing(emptyProduct())}><Plus className="w-4 h-4" /> {t('admin.products.newProduct')}</Button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.products.searchPlaceholder')} className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring outline-none" />
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3"></th><th className="px-4 py-3">{t('admin.products.product')}</th><th className="px-4 py-3">{t('admin.products.category')}</th>
              <th className="px-4 py-3">{t('admin.products.publicPrice')}</th><th className="px-4 py-3">{t('admin.products.wholesalePrice')}</th><th className="px-4 py-3">{t('admin.products.stock')}</th>
              <th className="px-4 py-3">{t('admin.products.status')}</th><th className="px-4 py-3"></th>
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
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{labelFor(PRODUCT_CATEGORY_LABEL, p.category, lang)}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(p.publicPrice)}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(p.wholesalePrice)}</td>
                <td className="px-4 py-3 text-ink-700">{p.stock}</td>
                <td className="px-4 py-3">{p.active ? <Badge tone="green">{t('common.active')}</Badge> : <Badge tone="neutral">{t('common.inactive')}</Badge>}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => setEditing(p)} className="p-1.5 text-ink-700 hover:bg-ink-950/10 rounded-sm focus-ring" title={t('admin.products.edit')}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(p)} className="text-xs text-gold-600 hover:underline px-1">{p.active ? t('admin.products.deactivate') : t('admin.products.activate')}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && products.find((p) => p.id === editing.id) ? t('admin.products.editProduct') : t('admin.products.newProductModal')} wide>
        {editing && (
          <div>
            <div className="grid md:grid-cols-2 gap-x-6">
              <Field label={t('admin.products.name')}><input className={inputClass} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label={t('admin.products.sku')}><input className={inputClass} value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} /></Field>
              <Field label={t('admin.products.category')}>
                <select className={inputClass} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as ProductCategory })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{labelFor(PRODUCT_CATEGORY_LABEL, c, lang)}</option>)}
                </select>
              </Field>
              <Field label={t('admin.products.warehouse')}><input className={inputClass} value={editing.warehouse} onChange={(e) => setEditing({ ...editing, warehouse: e.target.value })} /></Field>
              <Field label={t('admin.products.publicPrice')}><input type="number" className={inputClass} value={editing.publicPrice} onChange={(e) => setEditing({ ...editing, publicPrice: Number(e.target.value) })} /></Field>
              <Field label={t('admin.products.wholesalePrice')}><input type="number" className={inputClass} value={editing.wholesalePrice} onChange={(e) => setEditing({ ...editing, wholesalePrice: Number(e.target.value) })} /></Field>
              <Field label={t('admin.products.stock')}><input type="number" className={inputClass} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} /></Field>
              <Field label={t('admin.products.minStock')}><input type="number" className={inputClass} value={editing.minStock} onChange={(e) => setEditing({ ...editing, minStock: Number(e.target.value) })} /></Field>
              <Field label={t('admin.products.material')}><input className={inputClass} value={editing.material} onChange={(e) => setEditing({ ...editing, material: e.target.value })} /></Field>
              <Field label={t('admin.products.presentation')}><input className={inputClass} value={editing.presentation} onChange={(e) => setEditing({ ...editing, presentation: e.target.value })} /></Field>
            </div>
            <Field label={t('admin.products.description')}><textarea rows={3} className={inputClass} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label={t('admin.products.imagePlaceholder')}>
              <div className="flex gap-2">
                {GRADIENTS.map((g) => (
                  <button key={g} onClick={() => setEditing({ ...editing, image: g })} className={`w-10 h-10 rounded-sm bg-gradient-to-br ${g} border-2 ${editing.image === g ? 'border-gold-500' : 'border-transparent'}`} />
                ))}
              </div>
            </Field>
            <Button onClick={save} className="w-full mt-2">{t('admin.products.saveProduct')}</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
