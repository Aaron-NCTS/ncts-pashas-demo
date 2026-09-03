import { useEffect, useMemo, useState } from 'react';
import { listProducts, listMovements, registerStockMovement } from '../../services/api';
import { stockStatusOf } from '../../data/seed';
import { SectionHeading, Card, Button, Modal, Field, inputClass, Badge } from '../../components/ui/primitives';
import { StockStatusBadge } from '../../components/ui/StatusBadge';
import type { Product, StockMovement } from '../../types';
import { Search, ArrowDownCircle, ArrowUpCircle, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { MOVEMENT_TYPE_LABEL, labelFor } from '../../i18n/statusLabels';

export function AdminInventory() {
  const { showToast } = useApp();
  const { t, lang } = useLanguage();
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ product: Product; type: StockMovement['type'] } | null>(null);
  const [qty, setQty] = useState(10);
  const [reason, setReason] = useState('');

  function reload() { listProducts().then(setProducts); listMovements().then(setMovements); }
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => products.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const lowStockCount = products.filter((p) => stockStatusOf(p) === 'Stock bajo').length;
  const outOfStockCount = products.filter((p) => stockStatusOf(p) === 'Agotado').length;

  async function submitMovement() {
    if (!modal) return;
    await registerStockMovement({ productId: modal.product.id, type: modal.type, quantity: qty, reason: reason || t('admin.inventory.defaultReason') });
    setModal(null); setQty(10); setReason('');
    reload();
    showToast(t('admin.inventory.movementRegisteredToast'), 'success');
  }

  const modalTitlePrefix = modal?.type === 'entrada' ? t('admin.inventory.modalRegisterIn') : modal?.type === 'salida' ? t('admin.inventory.modalRegisterOut') : t('admin.inventory.modalAdjust');

  return (
    <div>
      <SectionHeading title={t('admin.inventory.title')} description={t('admin.inventory.description')} />

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {lowStockCount > 0 && <Badge tone="amber">{lowStockCount} {t('admin.inventory.lowStockBadge')}</Badge>}
          {outOfStockCount > 0 && <Badge tone="red">{outOfStockCount} {t('admin.inventory.outOfStockBadge')}</Badge>}
        </div>
      )}

      <div className="relative max-w-sm mb-5">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.inventory.searchPlaceholder')} className="w-full border border-ink-950/15 rounded-sm pl-9 pr-3 py-2.5 text-sm bg-white focus-ring outline-none" />
      </div>

      <Card className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.inventory.sku')}</th><th className="px-4 py-3">{t('admin.inventory.product')}</th><th className="px-4 py-3">{t('admin.inventory.stock')}</th>
              <th className="px-4 py-3">{t('admin.inventory.minimum')}</th><th className="px-4 py-3">{t('admin.inventory.reserved')}</th><th className="px-4 py-3">{t('admin.inventory.warehouse')}</th>
              <th className="px-4 py-3">{t('admin.inventory.status')}</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ink-950/5 last:border-0 hover:bg-ink-950/[0.02]">
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{p.sku}</td>
                <td className="px-4 py-3 text-ink-950 font-medium max-w-[220px] truncate">{p.name}</td>
                <td className="px-4 py-3 text-ink-700">{p.stock}</td>
                <td className="px-4 py-3 text-ink-700">{p.minStock}</td>
                <td className="px-4 py-3 text-ink-700">{p.reservedStock}</td>
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{p.warehouse}</td>
                <td className="px-4 py-3"><StockStatusBadge status={stockStatusOf(p)} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <button title={t('admin.inventory.addStock')} onClick={() => setModal({ product: p, type: 'entrada' })} className="p-1.5 text-signal-green hover:bg-signal-green/10 rounded-sm focus-ring"><ArrowDownCircle className="w-4 h-4" /></button>
                    <button title={t('admin.inventory.removeStock')} onClick={() => setModal({ product: p, type: 'salida' })} className="p-1.5 text-oxblood-500 hover:bg-oxblood-500/10 rounded-sm focus-ring"><ArrowUpCircle className="w-4 h-4" /></button>
                    <button title={t('admin.inventory.adjustInventory')} onClick={() => setModal({ product: p, type: 'ajuste' })} className="p-1.5 text-ink-700 hover:bg-ink-950/10 rounded-sm focus-ring"><SlidersHorizontal className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="text-sm font-medium text-ink-950 mb-3">{t('admin.inventory.movementHistory')}</p>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.inventory.date')}</th><th className="px-4 py-3">{t('admin.inventory.product')}</th><th className="px-4 py-3">{t('admin.inventory.type')}</th><th className="px-4 py-3">{t('admin.inventory.quantity')}</th><th className="px-4 py-3">{t('admin.inventory.reason')}</th>
            </tr>
          </thead>
          <tbody>
            {movements.slice(0, 20).map((m) => (
              <tr key={m.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{new Date(m.date).toLocaleDateString(locale)}</td>
                <td className="px-4 py-3 text-ink-950 max-w-[220px] truncate">{m.productName}</td>
                <td className="px-4 py-3">
                  {m.type === 'entrada' ? <Badge tone="green">{labelFor(MOVEMENT_TYPE_LABEL, 'entrada', lang)}</Badge> : m.type === 'salida' ? <Badge tone="red">{labelFor(MOVEMENT_TYPE_LABEL, 'salida', lang)}</Badge> : <Badge tone="blue">{labelFor(MOVEMENT_TYPE_LABEL, 'ajuste', lang)}</Badge>}
                </td>
                <td className="px-4 py-3 text-ink-700">{m.type === 'salida' ? '-' : '+'}{m.quantity}</td>
                <td className="px-4 py-3 text-ink-700">{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal ? `${modalTitlePrefix} — ${modal.product.name}` : ''}>
        <Field label={modal?.type === 'ajuste' ? t('admin.inventory.newStockValue') : t('admin.inventory.quantity')}>
          <input type="number" min={0} className={inputClass} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
        </Field>
        <Field label={t('admin.inventory.reason')}><input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t('admin.inventory.reasonPlaceholder')} /></Field>
        <Button onClick={submitMovement} className="w-full">{t('admin.inventory.confirm')}</Button>
      </Modal>
    </div>
  );
}
