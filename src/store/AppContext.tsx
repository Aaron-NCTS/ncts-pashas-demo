import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Session, UserRole } from '../types';
import { read, write, KEYS } from '../services/db';

// ---------------------------------------------------------------------------
// Sesión (demo — sin autenticación real, solo selección de rol)
// ---------------------------------------------------------------------------

const DEMO_SESSIONS: Record<UserRole, Session> = {
  admin: { role: 'admin', name: 'Rodrigo Aceves', email: 'rodrigo@pasha-demo.mx' },
  client: { role: 'client', name: 'Fernanda López', companyName: 'Barbería Imperial', email: 'contacto@barberiaimperial.mx' },
  distributor: { role: 'distributor', name: 'Carlos Hernández', companyName: 'Beauty Supply MX', email: 'contacto@beautysupplymx.mx' },
};

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

export interface Toast { id: string; message: string; tone: 'success' | 'error' | 'info'; }

interface AppContextValue {
  session: Session | null;
  loginAs: (role: UserRole) => void;
  logout: () => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  toasts: Toast[];
  showToast: (message: string, tone?: Toast['tone']) => void;

  favorites: string[];
  toggleFavorite: (productId: string) => void;

  refreshKey: number;
  bump: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => read<Session | null>(KEYS.session, null));
  const [cart, setCart] = useState<CartItem[]>(() => read<CartItem[]>(KEYS.cart, []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => read<string[]>(KEYS.favorites, []));

  useEffect(() => { write(KEYS.session, session); }, [session]);
  useEffect(() => { write(KEYS.cart, cart); }, [cart]);
  useEffect(() => { write(KEYS.favorites, favorites); }, [favorites]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const loginAs = useCallback((role: UserRole) => {
    if (role === 'distributor') {
      const active = read<{ name: string; companyName: string; email: string } | null>(KEYS.activeDistributor, null);
      if (active) { setSession({ role: 'distributor', ...active }); return; }
    }
    setSession(DEMO_SESSIONS[role]);
  }, []);
  const logout = useCallback(() => setSession(null), []);

  const showToast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.productId === item.productId && c.mode === item.mode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
    showToast(`${item.name} agregado al carrito`, 'success');
  }, [showToast]);

  const updateCartQty = useCallback((productId: string, quantity: number) => {
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, quantity: Math.max(1, quantity) } : c)));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const bump = useCallback(() => setRefreshKey((k) => k + 1), []);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((s, c) => s + c.quantity * c.unitPrice, 0), [cart]);

  const value: AppContextValue = {
    session, loginAs, logout,
    cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartSubtotal,
    toasts, showToast,
    favorites, toggleFavorite,
    refreshKey, bump,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
