import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { listOrders, listProducts, listCustomers, listDistributorApplications } from '../../services/api';
import { stockStatusOf } from '../../data/seed';
import { KpiCard, Card, SectionHeading } from '../../components/ui/primitives';
import { OrderStatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../config/brand';
import { salesByMonth, ordersByStatus, topProducts } from '../../utils/analytics';
import { useLanguage } from '../../i18n/LanguageContext';
import { ORDER_STATUS_LABEL, labelFor } from '../../i18n/statusLabels';
import type { Order, Product, Customer } from '../../types';

export function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [distApps, setDistApps] = useState<number>(0);

  useEffect(() => {
    listOrders().then(setOrders);
    listProducts().then(setProducts);
    listCustomers().then(setCustomers);
    listDistributorApplications().then((a) => setDistApps(a.length));
  }, []);

  const thisMonth = new Date().getMonth();
  const monthOrders = orders.filter((o) => new Date(o.createdAt).getMonth() === thisMonth);
  const monthSales = monthOrders.reduce((s, o) => s + o.total, 0);
  const avgTicket = monthOrders.length ? Math.round(monthSales / monthOrders.length) : 0;
  const pendingOrders = orders.filter((o) => !['Entregado', 'Incidencia'].includes(o.status)).length;
  const lowStock = products.filter((p) => stockStatusOf(p) === 'Stock bajo' || stockStatusOf(p) === 'Agotado').length;
  const distributors = customers.filter((c) => c.isDistributor).length;
  const productsSold = orders.reduce((s, o) => s + o.items.reduce((s2, it) => s2 + it.quantity, 0), 0);

  const monthlySeries = useMemo(() => salesByMonth(orders), [orders]);
  const statusSeries = useMemo(() => ordersByStatus(orders).map((s) => ({ ...s, statusLabel: labelFor(ORDER_STATUS_LABEL, s.status as Order['status'], lang) })), [orders, lang]);
  const products5 = useMemo(() => topProducts(orders, 5), [orders]);

  return (
    <div>
      <SectionHeading title={t('admin.dashboard.title')} description={t('admin.dashboard.description')} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label={t('admin.dashboard.monthSales')} value={formatCurrency(monthSales)} sub={`${monthOrders.length} ${t('admin.dashboard.orders')}`} trend="up" />
        <KpiCard label={t('admin.dashboard.totalOrders')} value={String(orders.length)} sub={`${pendingOrders} ${t('admin.dashboard.pending')}`} />
        <KpiCard label={t('admin.dashboard.customers')} value={String(customers.length)} sub={`${distributors} ${t('admin.dashboard.activeDistributors')}`} />
        <KpiCard label={t('admin.dashboard.distributorApplications')} value={String(distApps)} sub={t('admin.dashboard.toReview')} />
        <KpiCard label={t('admin.dashboard.avgTicket')} value={formatCurrency(avgTicket)} />
        <KpiCard label={t('admin.dashboard.productsSold')} value={String(productsSold)} />
        <KpiCard label={t('admin.dashboard.pendingOrders')} value={String(pendingOrders)} trend={pendingOrders > 10 ? 'down' : 'flat'} />
        <KpiCard label={t('admin.dashboard.lowStockOutOfStock')} value={String(lowStock)} trend={lowStock > 0 ? 'down' : 'flat'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.dashboard.salesLastMonths')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22201c1a" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4A3D30' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4A3D30' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Line type="monotone" dataKey="total" stroke="#B08D3F" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.dashboard.ordersByStatus')}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusSeries} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#4A3D30' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="statusLabel" tick={{ fontSize: 11, fill: '#4A3D30' }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              <Bar dataKey="count" fill="#100E0C" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-1">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.dashboard.topProducts')}</p>
          <div className="space-y-3">
            {products5.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-gold-600 w-4">{i + 1}</span>
                <span className="text-sm text-ink-800 flex-1 truncate">{p.name}</span>
                <span className="text-xs text-ink-700">{p.quantity} {t('admin.dashboard.units')}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-ink-950">{t('admin.dashboard.latestOrders')}</p>
            <Link to="/admin/pedidos" className="text-xs text-gold-600 hover:underline">{t('admin.dashboard.viewAll')}</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-700 uppercase tracking-wide border-b border-ink-950/10">
                <th className="py-2 pr-3">{t('admin.dashboard.order')}</th><th className="py-2 pr-3">{t('admin.dashboard.customer')}</th><th className="py-2 pr-3">{t('common.total')}</th><th className="py-2">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-ink-950/5 last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-ink-950">{o.id}</td>
                  <td className="py-2.5 pr-3 text-ink-700">{o.companyName ?? o.customerName}</td>
                  <td className="py-2.5 pr-3 text-ink-700">{formatCurrency(o.total)}</td>
                  <td className="py-2.5"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
