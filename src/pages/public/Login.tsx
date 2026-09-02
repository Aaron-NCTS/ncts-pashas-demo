import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Handshake } from 'lucide-react';
import { PashaLogo } from '../../components/public/PashaLogo';
import { useApp } from '../../store/AppContext';
import { read, KEYS } from '../../services/db';
import type { UserRole } from '../../types';

const ROLES: { role: UserRole; label: string; desc: string; icon: typeof ShieldCheck; path: string }[] = [
  { role: 'admin', label: 'Entrar como Admin', desc: 'Panel administrativo completo: pedidos, inventario, CRM, logística y reportes.', icon: ShieldCheck, path: '/admin' },
  { role: 'client', label: 'Entrar como Cliente', desc: 'Portal con seguimiento de pedidos, cotizaciones y soporte.', icon: User, path: '/portal' },
  { role: 'distributor', label: 'Entrar como Distribuidor', desc: 'Precios mayoristas, historial de compras y cotizaciones.', icon: Handshake, path: '/portal' },
];

export function Login() {
  const { loginAs } = useApp();
  const navigate = useNavigate();
  const activeDistributor = read<{ companyName: string } | null>(KEYS.activeDistributor, null);

  function enter(role: UserRole, path: string) {
    loginAs(role);
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center text-center mb-10">
          <PashaLogo className="h-20 w-auto mb-4" />
          <p className="text-ivory-300 text-sm">Acceso a la plataforma — selecciona un perfil para explorar la demo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map(({ role, label, desc, icon: Icon, path }) => (
            <button
              key={role}
              onClick={() => enter(role, path)}
              className="text-left bg-ink-900 border border-ivory-100/10 rounded-md p-6 hover:border-gold-500/60 transition-colors focus-ring group"
            >
              <Icon className="w-7 h-7 text-gold-400 mb-4" strokeWidth={1.4} />
              <p className="font-medium text-ivory-50 mb-1.5 group-hover:text-gold-300">{label}</p>
              <p className="text-xs text-ivory-400 leading-relaxed">{desc}</p>
              {role === 'distributor' && activeDistributor && (
                <p className="text-[11px] text-gold-500 mt-2">Sesión actual: {activeDistributor.companyName}</p>
              )}
            </button>
          ))}
        </div>

        <div className="rule-gold my-10" />

        <div className="text-center">
          <p className="text-xs text-ivory-400 mb-2">Acceso demostrativo — no requiere contraseña real.</p>
          <Link to="/" className="text-sm text-gold-400 hover:underline">← Volver al sitio público</Link>
        </div>
      </div>
    </div>
  );
}
