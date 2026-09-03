import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Handshake } from 'lucide-react';
import { PashaLogo } from '../../components/public/PashaLogo';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { read, KEYS } from '../../services/db';
import type { UserRole } from '../../types';

export function Login() {
  const { loginAs } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const activeDistributor = read<{ companyName: string } | null>(KEYS.activeDistributor, null);

  const ROLES: { role: UserRole; label: string; desc: string; icon: typeof ShieldCheck; path: string }[] = [
    { role: 'admin', label: t('pages.login.roleAdmin'), desc: t('pages.login.roleAdminDesc'), icon: ShieldCheck, path: '/admin' },
    { role: 'client', label: t('pages.login.roleClient'), desc: t('pages.login.roleClientDesc'), icon: User, path: '/portal' },
    { role: 'distributor', label: t('pages.login.roleDistributor'), desc: t('pages.login.roleDistributorDesc'), icon: Handshake, path: '/portal' },
  ];

  function enter(role: UserRole, path: string) {
    loginAs(role);
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center text-center mb-10">
          <PashaLogo className="h-20 w-auto mb-4" />
          <p className="text-ivory-300 text-sm">{t('pages.login.subtitle')}</p>
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
                <p className="text-[11px] text-gold-500 mt-2">{t('pages.login.currentSession')}: {activeDistributor.companyName}</p>
              )}
            </button>
          ))}
        </div>

        <div className="rule-gold my-10" />

        <div className="text-center">
          <p className="text-xs text-ivory-400 mb-2">{t('pages.login.demoAccessNote')}</p>
          <Link to="/" className="text-sm text-gold-400 hover:underline">{t('pages.login.backToPublicSite')}</Link>
        </div>
      </div>
    </div>
  );
}
