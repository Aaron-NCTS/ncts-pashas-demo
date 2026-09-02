import { useEffect, useState } from 'react';
import { listStaff, toggleStaffActive } from '../../services/api';
import { SectionHeading, Card, Badge } from '../../components/ui/primitives';
import type { StaffUser } from '../../types';
import { useApp } from '../../store/AppContext';

const ROLE_TONE: Record<StaffUser['role'], 'gold' | 'blue' | 'green' | 'amber' | 'neutral'> = {
  ADMINISTRADOR: 'gold', VENTAS: 'blue', 'ALMACÉN': 'green', 'LOGÍSTICA': 'amber', SOPORTE: 'neutral',
};

export function AdminUsers() {
  const { showToast } = useApp();
  const [staff, setStaff] = useState<StaffUser[]>([]);

  function reload() { listStaff().then(setStaff); }
  useEffect(() => { reload(); }, []);

  async function toggle(s: StaffUser) {
    await toggleStaffActive(s.id);
    reload();
    showToast(s.active ? `${s.name} desactivado` : `${s.name} activado`, 'success');
  }

  return (
    <div>
      <SectionHeading title="Usuarios y roles" description="Perfiles internos del equipo PASHA'S con permisos diferenciados por área." />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">Nombre</th><th className="px-4 py-3">Correo</th><th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Permisos</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-ink-700">{s.email}</td>
                <td className="px-4 py-3"><Badge tone={ROLE_TONE[s.role]}>{s.role}</Badge></td>
                <td className="px-4 py-3 text-ink-700 text-xs">{s.permissions.join(' · ')}</td>
                <td className="px-4 py-3">{s.active ? <Badge tone="green">Activo</Badge> : <Badge tone="neutral">Inactivo</Badge>}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => toggle(s)} className="text-xs text-gold-600 hover:underline">{s.active ? 'Desactivar' : 'Activar'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-ink-700/70 mt-4">Nota: esta demo simula distintos perfiles de acceso. La autenticación y permisos reales se implementarán al conectar el backend definitivo.</p>
    </div>
  );
}
