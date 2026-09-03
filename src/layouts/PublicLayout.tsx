import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { brand } from '../config/brand';
import { useApp } from '../store/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { PashaLogo } from '../components/public/PashaLogo';
import { LanguageToggle } from '../components/ui/LanguageToggle';

export function PublicLayout() {
  const { cartCount, session } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const NAV = [
    { to: '/', label: t('publicLayout.nav.home') },
    { to: '/productos', label: t('publicLayout.nav.products') },
    { to: '/mayoreo', label: t('publicLayout.nav.wholesale') },
    { to: '/distribuidores', label: t('publicLayout.nav.distributors') },
    { to: '/nosotros', label: t('publicLayout.nav.about') },
    { to: '/contacto', label: t('publicLayout.nav.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <header className="sticky top-0 z-40 bg-ink-950 text-ivory-100">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <PashaLogo className="h-11 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors focus-ring rounded-sm ${isActive ? 'text-gold-400' : 'text-ivory-200 hover:text-gold-300'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <LanguageToggle tone="dark" className="hidden sm:flex" />
            <button
              onClick={() => navigate(session ? (session.role === 'admin' ? '/admin' : '/portal') : '/login')}
              className="hidden md:inline text-sm text-ivory-200 hover:text-gold-300 focus-ring rounded-sm px-1"
            >
              {session ? (session.role === 'admin' ? t('publicLayout.adminPanel') : t('publicLayout.myAccount')) : t('publicLayout.login')}
            </button>
            <button onClick={() => navigate('/carrito')} className="relative p-2 focus-ring rounded-sm" aria-label={t('publicLayout.cart')}>
              <ShoppingBag className="w-5 h-5 text-ivory-100" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-ink-950 text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="lg:hidden p-2 focus-ring rounded-sm" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-ivory-100/10 px-5 py-4 flex flex-col gap-4">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="text-sm text-ivory-200">
                {item.label}
              </NavLink>
            ))}
            <NavLink to={session ? (session.role === 'admin' ? '/admin' : '/portal') : '/login'} onClick={() => setOpen(false)} className="text-sm text-gold-400">
              {session ? t('publicLayout.myAccount') : t('publicLayout.login')}
            </NavLink>
            <LanguageToggle tone="dark" className="sm:hidden w-fit" />
          </div>
        )}
        <div className="rule-gold" />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink-950 text-ivory-200 mt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <PashaLogo className="h-12 w-auto" />
            </div>
            <p className="text-sm text-ivory-300 max-w-xs">{brand.legalName} — {t('publicLayout.footer.tagline')} {brand.country}.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-500 mb-3">{t('publicLayout.footer.explore')}</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/productos" className="hover:text-gold-300">{t('publicLayout.footer.fullCatalog')}</Link></li>
              <li><Link to="/mayoreo" className="hover:text-gold-300">{t('publicLayout.footer.wholesaleProgram')}</Link></li>
              <li><Link to="/distribuidores" className="hover:text-gold-300">{t('publicLayout.footer.becomeDistributor')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-500 mb-3">{t('publicLayout.footer.contact')}</p>
            <ul className="space-y-2 text-sm text-ivory-300">
              <li>{brand.contact.phoneDisplay}</li>
              <li>{brand.contact.email}</li>
              <li>{brand.contact.city}, {brand.contact.country}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-500 mb-3">{t('publicLayout.footer.access')}</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-gold-300">{t('publicLayout.login')}</Link></li>
              <li><Link to="/portal" className="hover:text-gold-300">{t('publicLayout.footer.clientPortal')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ivory-100/10 py-5 text-center text-xs text-ivory-400">
          {t('publicLayout.footer.demoNotice')} {brand.legalName}. {t('publicLayout.footer.demoNoticeSuffix')}
        </div>
      </footer>
    </div>
  );
}
