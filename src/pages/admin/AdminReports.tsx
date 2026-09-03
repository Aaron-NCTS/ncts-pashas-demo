import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { listOrders, listProducts, listCustomers } from '../../services/api';
import { SectionHeading, Card, KpiCard } from '../../components/ui/primitives';
import { salesByMonth, topProducts, salesByCategory, statesBySales, averageDeliveryDays } from '../../utils/analytics';
import { formatCurrency } from '../../config/brand';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATEGORY_LABEL } from '../../i18n/statusLabels';
import type { Order, Product, Customer, ProductCategory } from '../../types';

const COLORS = ['#B08D3F', '#100E0C', '#D9BD79', '#5B1A1A', '#3B6EA8', '#4A3D30', '#8C6D2E', '#7A2431'];

export function AdminReports() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => { listOrders().then(setOrders); listProducts().then(setProducts); listCustomers().then(setCustomers); }, []);

  const monthly = useMemo(() => salesByMonth(orders, 8), [orders]);
  const top = useMemo(() => topProducts(orders, 6), [orders]);
  const byCategory = useMemo(() => salesByCategory(orders, products).map((c) => ({
    ...c,
    category: PRODUCT_CATEGORY_LABEL[c.category as ProductCategory]?.[lang] ?? t('common.other'),
  })), [orders, products, lang, t]);
  const byState = useMemo(() => statesBySales(orders), [orders]);
  const delivered = orders.filter((o) => o.status === 'Entregado').length;
  const avgDays = useMemo(() => averageDeliveryDays(orders), [orders]);
  const topCustomers = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => map.set(o.companyName ?? o.customerName, (map.get(o.companyName ?? o.customerName) ?? 0) + o.total));
    return Array.from(map.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [orders]);

  return (
    <div>
      <SectionHeading title={t('admin.reports.title')} description={t('admin.reports.description')} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label={t('admin.reports.deliveredOrders')} value={String(delivered)} />
        <KpiCard label={t('admin.reports.avgDeliveryTime')} value={`${avgDays} ${t('admin.reports.days')}`} />
        <KpiCard label={t('admin.reports.totalCustomers')} value={String(customers.length)} />
        <KpiCard label={t('admin.reports.distributors')} value={String(customers.filter((c) => c.isDistributor).length)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.reports.salesByMonth')}</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22201c1a" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4A3D30' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4A3D30' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Line type="monotone" dataKey="total" stroke="#B08D3F" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.reports.salesByCategory')}</p>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={byCategory} dataKey="total" nameKey="category" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.reports.topProducts')}</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={top} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#4A3D30' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#4A3D30' }} width={140} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="quantity" fill="#B08D3F" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.reports.topStates')}</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={byState}>
              <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#4A3D30' }} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11, fill: '#4A3D30' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} width={70} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="total" fill="#100E0C" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.reports.topCustomers')}</p>
        <div className="space-y-2">
          {topCustomers.map((c, i) => (
            <div key={c.name} className="flex items-center gap-3 text-sm">
              <span className="text-xs text-gold-600 w-4">{i + 1}</span>
              <span className="text-ink-800 flex-1 truncate">{c.name}</span>
              <span className="text-ink-700">{formatCurrency(c.total)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
