import { useEffect, useState } from 'react';
import { listLeads, moveLeadStage, addLeadNote } from '../../services/api';
import { SectionHeading, Modal, inputClass, Button } from '../../components/ui/primitives';
import type { CrmLead, CrmStage } from '../../types';
import { useApp } from '../../store/AppContext';

const STAGES: CrmStage[] = ['NUEVO LEAD', 'CONTACTADO', 'INTERESADO', 'COTIZACIÓN', 'NEGOCIACIÓN', 'CLIENTE'];

export function AdminCrm() {
  const { showToast } = useApp();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [selected, setSelected] = useState<CrmLead | null>(null);
  const [note, setNote] = useState('');
  const [dragId, setDragId] = useState<string | null>(null);

  function reload() { listLeads().then(setLeads); }
  useEffect(() => { reload(); }, []);

  async function drop(stage: CrmStage) {
    if (!dragId) return;
    await moveLeadStage(dragId, stage);
    setDragId(null);
    reload();
    showToast('Lead movido de etapa', 'success');
  }

  async function submitNote() {
    if (!selected || !note) return;
    await addLeadNote(selected.id, note);
    setNote('');
    reload();
    const all = await listLeads();
    setSelected(all.find((l) => l.id === selected.id) ?? null);
  }

  return (
    <div>
      <SectionHeading title="CRM · Seguimiento comercial" description="Arrastra las tarjetas entre columnas para actualizar la etapa de cada prospecto." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stage) => (
          <div
            key={stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(stage)}
            className="bg-ink-950/[0.03] rounded-md p-2.5 min-h-[420px]"
          >
            <p className="text-[11px] font-medium text-ink-700 uppercase tracking-wide mb-2.5 px-1">{stage} <span className="text-ink-700/50">({leads.filter((l) => l.stage === stage).length})</span></p>
            <div className="space-y-2">
              {leads.filter((l) => l.stage === stage).map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => setDragId(lead.id)}
                  onClick={() => setSelected(lead)}
                  className="bg-white border border-ink-950/10 rounded-sm p-3 cursor-grab active:cursor-grabbing hover:border-gold-500/50"
                >
                  <p className="text-sm font-medium text-ink-950 leading-snug">{lead.company}</p>
                  <p className="text-xs text-ink-700 mt-1">{lead.contactName}</p>
                  <p className="text-[11px] text-gold-600 mt-1.5">{lead.nextAction}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.company ?? ''}>
        {selected && (
          <div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div><p className="text-xs text-ink-700">Contacto</p><p className="text-ink-950">{selected.contactName}</p></div>
              <div><p className="text-xs text-ink-700">Responsable</p><p className="text-ink-950">{selected.owner}</p></div>
              <div><p className="text-xs text-ink-700">WhatsApp</p><p className="text-ink-950">{selected.whatsapp}</p></div>
              <div><p className="text-xs text-ink-700">Correo</p><p className="text-ink-950 truncate">{selected.email}</p></div>
              <div><p className="text-xs text-ink-700">Último contacto</p><p className="text-ink-950">{new Date(selected.lastContactDate).toLocaleDateString('es-MX')}</p></div>
              <div><p className="text-xs text-ink-700">Próxima acción</p><p className="text-ink-950">{selected.nextAction}</p></div>
            </div>
            <p className="text-xs font-medium text-ink-700 uppercase mb-2">Notas</p>
            <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
              {selected.notes.map((n, i) => <p key={i} className="text-sm bg-ink-950/5 rounded-sm px-3 py-2">{n}</p>)}
            </div>
            <div className="flex gap-2">
              <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Agregar nota..." />
              <Button onClick={submitNote}>Agregar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
