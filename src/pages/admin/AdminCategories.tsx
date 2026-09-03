import { useEffect, useState } from 'react';
import { listProducts } from '../../services/api';
import { SectionHeading, Card } from '../../components/ui/primitives';
import type { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../config/brand';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATEGORY_LABEL, labelFor } from '../../i18n/statusLabels';

export function AdminCategories() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { listProducts().then(setProducts); }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))) as ProductCategory[];

  return (
    <div>
      <SectionHeading title={t('admin.categories.title')} description={t('admin.categories.description')} />
      <div className="grid md:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const items = products.filter((p) => p.category === cat);
          const totalStock = items.reduce((s, p) => s + p.stock, 0);
          const avgPrice = items.length ? items.reduce((s, p) => s + p.publicPrice, 0) / items.length : 0;
          return (
            <Card key={cat} className="p-5">
              <p className="font-medium text-ink-950 mb-3">{labelFor(PRODUCT_CATEGORY_LABEL, cat, lang)}</p>
              <div className="flex justify-between text-sm text-ink-700 mb-1"><span>{t('admin.categories.products')}</span><span>{items.length}</span></div>
              <div className="flex justify-between text-sm text-ink-700 mb-1"><span>{t('admin.categories.totalStock')}</span><span>{totalStock}</span></div>
              <div className="flex justify-between text-sm text-ink-700"><span>{t('admin.categories.avgPrice')}</span><span>{formatCurrency(Math.round(avgPrice))}</span></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
