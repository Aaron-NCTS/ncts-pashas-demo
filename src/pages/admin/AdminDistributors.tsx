import { useEffect, useState } from 'react';
import { listDistributorApplications, listCustomers, updateDistributorStatus, approveDistributor } from '../../services/api';
import { SectionHeading, Card, Button } from '../../components/ui/primitives';
import { DistributorStatusBadge } from '../../components/ui/StatusBadge';
import type { DistributorApplication, Customer, DistributorStatus } from '../../types';
import { formatCurrency } from '../../config/brand';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { DISTRIBUTOR_STATUS_LABEL, labelFor } from '../../i18n/statusLabels';

export function AdminDistributors() {
  const { showToast } = useApp();
  const { t, lang } = useLanguage();
  const [apps, setApps] = useState<DistributorApplication[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  function reload() { listDistributorApplications().then(setApps); listCustomers().then((c) => setCustomers(c.filter((x) => x.isDistributor))); }
  useEffect(() => { reload(); }, []);

  async function updateStatus(id: string, status: DistributorStatus) {
    await updateDistributorStatus(id, status);
    reload();
    showToast(t('admin.distributors.statusUpdatedToast').replace('{status}', labelFor(DISTRIBUTOR_STATUS_LABEL, status, lang)), 'success');
  }

  async function approve(id: string) {
    const app = await approveDistributor(id);
    reload();
    if (app) showToast(t('admin.distributors.approvedToast').replace('{company}', app.companyName), 'success');
  }

  return (
    <div>
      <SectionHeading title={t('admin.distributors.title')} description={t('admin.distributors.description')} />

      <p className="text-sm font-medium text-ink-950 mb-3">{t('admin.distributors.applicationsReceived')}</p>
      <Card className="overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.distributors.company')}</th><th className="px-4 py-3">{t('admin.distributors.contact')}</th><th className="px-4 py-3">{t('admin.distributors.city')}</th>
              <th className="px-4 py-3">{t('admin.distributors.volume')}</th><th className="px-4 py-3">{t('admin.distributors.status')}</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{a.companyName}</td>
                <td className="px-4 py-3 text-ink-700">{a.name}</td>
                <td className="px-4 py-3 text-ink-700">{a.city}, {a.state}</td>
                <td className="px-4 py-3 text-ink-700">{a.volume}</td>
                <td className="px-4 py-3"><DistributorStatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {a.status !== 'Aprobado' && <Button size="sm" variant="secondary" onClick={() => updateStatus(a.id, 'En revisión')}>{t('admin.distributors.underReview')}</Button>}
                    {a.status !== 'Aprobado' && <Button size="sm" onClick={() => approve(a.id)}>{t('admin.distributors.approve')}</Button>}
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-ink-700">{t('admin.distributors.noApplications')}</td></tr>}
          </tbody>
        </table>
      </Card>

      <p className="text-sm font-medium text-ink-950 mb-3">{t('admin.distributors.activeNetwork')}</p>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.distributors.company')}</th><th className="px-4 py-3">{t('admin.distributors.city')}</th><th className="px-4 py-3">{t('admin.distributors.volume')}</th>
              <th className="px-4 py-3">{t('admin.distributors.accumulatedSales')}</th><th className="px-4 py-3">{t('admin.distributors.status')}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{c.companyName}</td>
                <td className="px-4 py-3 text-ink-700">{c.city}, {c.state}</td>
                <td className="px-4 py-3 text-ink-700">{c.purchaseVolume}</td>
                <td className="px-4 py-3 text-ink-700">{formatCurrency(c.totalPurchases)}</td>
                <td className="px-4 py-3">{c.distributorStatus && <DistributorStatusBadge status={c.distributorStatus} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
