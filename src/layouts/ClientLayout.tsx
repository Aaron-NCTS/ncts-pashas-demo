import { useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Package, MapPinned, FileText, Receipt, Heart, User, LifeBuoy, LogOut, Menu, X,
} from 'lucide-react';
import { brand } from '../config/brand';
import { useApp } from '../store/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PashaGroupBadge } from '../components/public/PashaLogo';
import { LanguageToggle } from '../components/ui/LanguageToggle';

function SidebarContent({ onNavigate, logout, navigate, t }: { onNavigate?: () => void; logout: () => void; navigate: (p: string) => void; t: (k: string) => string }) {
  const NAV = [
    { to: '/portal', label: t('clientLayout.nav.summary'), icon: LayoutGrid, end: true },
    { to: '/portal/pedidos', label: t('clientLayout.nav.myOrders'), icon: Package },
    { to: '/portal/seguimiento', label: t('clientLayout.nav.tracking'), icon: MapPinned },
    { to: '/portal/cotizaciones', label: t('clientLayout.nav.quotes'), icon: FileText },
    { to: '/portal/facturacion', label: t('clientLayout.nav.billing'), icon: Receipt },
    { to: '/portal/favoritos', label: t('clientLayout.nav.favorites'), icon: Heart },
    { to: '/portal/perfil', label: t('clientLayout.nav.profile'), icon: User },
    { to: '/portal/soporte', label: t('clientLayout.nav.support'), icon: LifeBuoy },
  ];
  return (
    <>
      <div className="h-20 flex items-center gap-3 px-6 border-b border-ivory-100/10 shrink-0">
        <PashaGroupBadge className="w-9 h-9" />
        <span className="font-display text-lg text-ivory-50">{brand.logoText}</span>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors focus-ring ${
                isActive ? 'bg-gold-500/15 text-gold-400' : 'text-ivory-300 hover:bg-ivory-100/5 hover:text-ivory-50'
              }`
            }
          >
            <Icon className="w-4 h-4" strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-ivory-100/10 shrink-0 space-y-2">
        <LanguageToggle tone="dark" className="w-fit mx-1" />
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-ivory-300 hover:bg-ivory-100/5 hover:text-ivory-50 focus-ring"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.6} /> {t('clientLayout.logout')}
        </button>
        <p className="text-center text-[10px] tracking-wide text-ivory-400/60 pt-2">{t('clientLayout.demoTag')}</p>
      </div>
    </>
  );
}

export function ClientLayout() {
  const { session, logout } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!session || session.role === 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex bg-ivory-100">
      <aside className="w-64 shrink-0 bg-ink-950 text-ivory-200 hidden md:flex flex-col">
        <SidebarContent logout={logout} navigate={navigate} t={t} />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-ink-950 text-ivory-200 flex flex-col shadow-2xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button onClick={() => setMobileNavOpen(false)} className="p-2 text-ivory-300 hover:text-ivory-50 focus-ring rounded-sm" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} logout={logout} navigate={navigate} t={t} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-ink-950/10 flex items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="md:hidden p-2 -ml-2 text-ink-800 focus-ring rounded-sm" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-ink-700">{session.role === 'distributor' ? t('clientLayout.distributorPortal') : t('clientLayout.clientPortal')}</p>
              <p className="font-medium text-ink-950 text-sm">{session.companyName ?? session.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle tone="light" />
            <button onClick={() => navigate('/')} className="text-xs text-ink-700 hover:text-gold-600 focus-ring rounded-sm px-2 py-1 shrink-0">
              {t('clientLayout.viewPublicSite')}
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
