import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Boxes, Package2, Tags, Users, Handshake, FileText,
  Truck, Building2, KanbanSquare, Percent, BarChart3, UserCog, Settings, LogOut, Bell, Menu, X,
} from 'lucide-react';
import { brand } from '../config/brand';
import { useApp } from '../store/AppContext';
import { PashaGroupBadge } from '../components/public/PashaLogo';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';
import type { AppNotification } from '../types';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/admin/inventario', label: 'Inventario', icon: Boxes },
  { to: '/admin/productos', label: 'Productos', icon: Package2 },
  { to: '/admin/categorias', label: 'Categorías', icon: Tags },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/distribuidores', label: 'Distribuidores', icon: Handshake },
  { to: '/admin/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { to: '/admin/logistica', label: 'Logística', icon: Truck },
  { to: '/admin/proveedores', label: 'Proveedores', icon: Building2 },
  { to: '/admin/crm', label: 'CRM', icon: KanbanSquare },
  { to: '/admin/promociones', label: 'Promociones', icon: Percent },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/admin/usuarios', label: 'Usuarios', icon: UserCog },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace instantes';
  if (h < 24) return `Hace ${h} h`;
  return `Hace ${Math.floor(h / 24)} d`;
}

function SidebarContent({ onNavigate, logout, navigate }: { onNavigate?: () => void; logout: () => void; navigate: (p: string) => void }) {
  return (
    <>
      <Link to="/" onClick={onNavigate} className="h-16 flex items-center gap-3 px-6 border-b border-ivory-100/10 shrink-0">
        <PashaGroupBadge className="w-9 h-9" />
        <div>
          <p className="font-display text-base text-ivory-50 leading-tight">{brand.logoText}</p>
          <p className="text-[10px] tracking-wide text-gold-500/80 leading-tight">PANEL ADMINISTRATIVO</p>
        </div>
      </Link>
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors focus-ring ${
                isActive ? 'bg-gold-500/15 text-gold-400' : 'text-ivory-300 hover:bg-ivory-100/5 hover:text-ivory-50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.6} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-ivory-100/10 shrink-0 space-y-2">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-ivory-300 hover:bg-ivory-100/5 hover:text-ivory-50 focus-ring"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.6} /> Cerrar sesión
        </button>
        <p className="text-center text-[10px] tracking-wide text-ivory-400/60 pt-1">DEMO COMERCIAL — NOVACORE TECH SOLUTIONS</p>
      </div>
    </>
  );
}

export function AdminLayout() {
  const { session, logout, bump } = useApp();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { listNotifications().then(setNotifs); }, []);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!session || session.role !== 'admin') return <Navigate to="/login" replace />;

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-ivory-100">
      <aside className="w-64 shrink-0 bg-ink-950 text-ivory-200 hidden lg:flex flex-col">
        <SidebarContent logout={logout} navigate={navigate} />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-ink-950 text-ivory-200 flex flex-col shadow-2xl">
            <div className="flex items-center justify-end px-3 pt-3">
              <button onClick={() => setMobileNavOpen(false)} className="p-2 text-ivory-300 hover:text-ivory-50 focus-ring rounded-sm" aria-label="Cerrar menú">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileNavOpen(false)} logout={logout} navigate={navigate} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-ink-950/10 flex items-center justify-between px-5 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNavOpen(true)} className="lg:hidden p-2 -ml-2 text-ink-800 focus-ring rounded-sm" aria-label="Abrir menú">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-ink-700">Sesión</p>
              <p className="font-medium text-ink-950 text-sm">{session.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative p-2 rounded-sm hover:bg-ink-950/5 focus-ring"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5 text-ink-800" strokeWidth={1.6} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-oxblood-500 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2.5rem)] max-w-80 bg-white border border-ink-950/10 rounded-md shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-ink-950/10">
                    <p className="text-sm font-medium text-ink-950">Notificaciones</p>
                    <button
                      onClick={async () => { await markAllNotificationsRead(); setNotifs(await listNotifications()); }}
                      className="text-xs text-gold-600 hover:underline"
                    >
                      Marcar todas leídas
                    </button>
                  </div>
                  {notifs.length === 0 ? (
                    <p className="text-sm text-ink-700 px-4 py-6 text-center">Sin notificaciones</p>
                  ) : (
                    notifs.slice(0, 12).map((n) => (
                      <button
                        key={n.id}
                        onClick={async () => {
                          await markNotificationRead(n.id);
                          setNotifs(await listNotifications());
                          setOpen(false);
                          if (n.link) navigate(n.link);
                          bump();
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-ink-950/5 last:border-0 hover:bg-ink-950/5 ${!n.read ? 'bg-gold-500/5' : ''}`}
                      >
                        <p className="text-sm text-ink-950 font-medium">{n.title}</p>
                        <p className="text-xs text-ink-700 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-ink-700/60 mt-1">{timeAgo(n.createdAt)}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
