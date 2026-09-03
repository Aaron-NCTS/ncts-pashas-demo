import { useEffect, useState } from 'react';
import { listStaff, toggleStaffActive } from '../../services/api';
import { SectionHeading, Card, Badge } from '../../components/ui/primitives';
import type { StaffUser } from '../../types';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { STAFF_ROLE_LABEL, labelFor } from '../../i18n/statusLabels';

const ROLE_TONE: Record<StaffUser['role'], 'gold' | 'blue' | 'green' | 'amber' | 'neutral'> = {
  ADMINISTRADOR: 'gold', VENTAS: 'blue', 'ALMACÉN': 'green', 'LOGÍSTICA': 'amber', SOPORTE: 'neutral',
};

export function AdminUsers() {
  const { showToast } = useApp();
  const { t, lang } = useLanguage();
  const [staff, setStaff] = useState<StaffUser[]>([]);

  function reload() { listStaff().then(setStaff); }
  useEffect(() => { reload(); }, []);

  async function toggle(s: StaffUser) {
    await toggleStaffActive(s.id);
    reload();
    showToast(s.active ? t('admin.users.deactivatedToast').replace('{name}', s.name) : t('admin.users.activatedToast').replace('{name}', s.name), 'success');
  }

  return (
    <div>
      <SectionHeading title={t('admin.users.title')} description={t('admin.users.description')} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.users.name')}</th><th className="px-4 py-3">{t('admin.users.email')}</th><th className="px-4 py-3">{t('admin.users.role')}</th>
              <th className="px-4 py-3">{t('admin.users.permissions')}</th><th className="px-4 py-3">{t('admin.users.status')}</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-ink-700">{s.email}</td>
                <td className="px-4 py-3"><Badge tone={ROLE_TONE[s.role]}>{labelFor(STAFF_ROLE_LABEL, s.role, lang)}</Badge></td>
                <td className="px-4 py-3 text-ink-700 text-xs">{s.permissions.join(' · ')}</td>
                <td className="px-4 py-3">{s.active ? <Badge tone="green">{t('common.active')}</Badge> : <Badge tone="neutral">{t('common.inactive')}</Badge>}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => toggle(s)} className="text-xs text-gold-600 hover:underline">{s.active ? t('admin.products.deactivate') : t('admin.products.activate')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-ink-700/70 mt-4">{t('admin.users.footnote')}</p>
    </div>
  );
}
