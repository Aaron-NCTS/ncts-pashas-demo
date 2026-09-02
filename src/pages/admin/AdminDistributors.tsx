import { useEffect, useState } from 'react';
import { listDistributorApplications, listCustomers, updateDistributorStatus, approveDistributor } from '../../services/api';
import { SectionHeading, Card, Button } from '../../components/ui/primitives';
import { DistributorStatusBadge } from '../../components/ui/StatusBadge';
import type { DistributorApplication, Customer, DistributorStatus } from '../../types';
import { formatCurrency } from '../../config/brand';
import { useApp } from '../../store/AppContext';

export function AdminDistributors() {
  const { showToast } = useApp();
  const [apps, setApps] = useState<DistributorApplication[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  function reload() { listDistributorApplications().then(setApps); listCustomers().then((c) => setCustomers(c.filter((x) => x.isDistributor))); }
  useEffect(() => { reload(); }, []);

  async function updateStatus(id: string, status: DistributorStatus) {
    await updateDistributorStatus(id, status);
    reload();
    showToast(`Solicitud actualizada a "${status}"`, 'success');
  }

  async function approve(id: string) {
    const app = await approveDistributor(id);
    reload();
    if (app) showToast(`${app.companyName} aprobado — ahora es el acceso demo "Entrar como Distribuidor"`, 'success');
  }

  return (
    <div>
      <SectionHeading title="Distribuidores" description="Solicitudes nuevas y red de distribuidores activos — datos demostrativos." />

      <p className="text-sm font-medium text-ink-950 mb-3">Solicitudes recibidas</p>
      <Card className="overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Empresa</th><th className="px-4 py-3">Contacto</th><th className="px-4 py-3">Ciudad</th>
              <th className="px-4 py-3">Volumen</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
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
                    {a.status !== 'Aprobado' && <Button size="sm" variant="secondary" onClick={() => updateStatus(a.id, 'En revisión')}>En revisión</Button>}
                    {a.status !== 'Aprobado' && <Button size="sm" onClick={() => approve(a.id)}>Aprobar</Button>}
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-ink-700">Sin solicitudes pendientes.</td></tr>}
          </tbody>
        </table>
      </Card>

      <p className="text-sm font-medium text-ink-950 mb-3">Red de distribuidores activos</p>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Empresa</th><th className="px-4 py-3">Ciudad</th><th className="px-4 py-3">Volumen</th>
              <th className="px-4 py-3">Ventas acumuladas</th><th className="px-4 py-3">Estado</th>
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
