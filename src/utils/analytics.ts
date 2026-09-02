import type { Order, Product } from '../types';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function salesByMonth(orders: Order[], months = 6): { month: string; total: number }[] {
  const now = new Date();
  const buckets: { month: string; total: number; key: string }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: MONTHS[d.getMonth()], total: 0, key: `${d.getFullYear()}-${d.getMonth()}` });
  }
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.total += o.total;
  });
  return buckets.map(({ month, total }) => ({ month, total }));
}

export function ordersByStatus(orders: Order[]): { status: string; count: number }[] {
  const map = new Map<string, number>();
  orders.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1));
  return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
}

export function topProducts(orders: Order[], limit = 5): { name: string; quantity: number }[] {
  const map = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => map.set(it.name, (map.get(it.name) ?? 0) + it.quantity)));
  return Array.from(map.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export function salesByCategory(orders: Order[], products: Product[]): { category: string; total: number }[] {
  const byId = new Map(products.map((p) => [p.id, p.category]));
  const map = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((it) => {
    const cat = byId.get(it.productId) ?? 'Otros';
    map.set(cat, (map.get(cat) ?? 0) + it.quantity * it.unitPrice);
  }));
  return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
}

export function statesBySales(orders: Order[], limit = 6): { state: string; total: number }[] {
  const map = new Map<string, number>();
  orders.forEach((o) => map.set(o.state, (map.get(o.state) ?? 0) + o.total));
  return Array.from(map.entries())
    .map(([state, total]) => ({ state, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function averageDeliveryDays(orders: Order[]): number {
  const delivered = orders.filter((o) => o.status === 'Entregado');
  if (delivered.length === 0) return 0;
  const total = delivered.reduce((sum, o) => {
    const start = new Date(o.createdAt).getTime();
    const deliveredEntry = o.timeline.find((t) => t.status === 'Entregado');
    const end = deliveredEntry ? new Date(deliveredEntry.date).getTime() : start;
    return sum + Math.max(0, (end - start) / 86400000);
  }, 0);
  return Math.round((total / delivered.length) * 10) / 10;
}
