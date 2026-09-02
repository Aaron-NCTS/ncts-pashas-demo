import { useEffect, useState } from 'react';
import { listPromotions, upsertPromotion } from '../../services/api';
import { SectionHeading, Card, Button, Modal, Field, inputClass, Badge } from '../../components/ui/primitives';
import type { Promotion } from '../../types';
import { Plus } from 'lucide-react';
import { useApp } from '../../store/AppContext';

function empty(): Promotion {
  return { id: `promo-${Date.now()}`, name: '', code: '', percentage: 10, startDate: new Date().toISOString().slice(0, 10), endDate: new Date().toISOString().slice(0, 10), active: true };
}

export function AdminPromotions() {
  const { showToast } = useApp();
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Promotion | null>(null);

  function reload() { listPromotions().then(setPromos); }
  useEffect(() => { reload(); }, []);

  async function save() {
    if (!editing) return;
    if (!editing.name || !editing.code) { showToast('Nombre y código son obligatorios', 'error'); return; }
    await upsertPromotion(editing);
    setEditing(null);
    reload();
    showToast('Promoción guardada', 'success');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <SectionHeading title="Promociones" />
        <Button onClick={() => setEditing(empty())}><Plus className="w-4 h-4" /> Nueva promoción</Button>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Nombre</th><th className="px-4 py-3">Código</th><th className="px-4 py-3">Descuento</th>
              <th className="px-4 py-3">Vigencia</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gold-600 font-mono text-xs">{p.code}</td>
                <td className="px-4 py-3 text-ink-700">{p.percentage}%</td>
                <td className="px-4 py-3 text-ink-700">{new Date(p.startDate).toLocaleDateString('es-MX')} – {new Date(p.endDate).toLocaleDateString('es-MX')}</td>
                <td className="px-4 py-3">{p.active ? <Badge tone="green">Activa</Badge> : <Badge tone="neutral">Inactiva</Badge>}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => setEditing(p)} className="text-xs text-gold-600 hover:underline">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Promoción">
        {editing && (
          <div>
            <Field label="Nombre"><input className={inputClass} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Código"><input className={inputClass} value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} /></Field>
            <Field label="Porcentaje de descuento"><input type="number" className={inputClass} value={editing.percentage} onChange={(e) => setEditing({ ...editing, percentage: Number(e.target.value) })} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fecha inicio"><input type="date" className={inputClass} value={editing.startDate.slice(0, 10)} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></Field>
              <Field label="Fecha fin"><input type="date" className={inputClass} value={editing.endDate.slice(0, 10)} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-950 mb-4">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-gold-500" /> Promoción activa
            </label>
            <Button onClick={save} className="w-full">Guardar</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
