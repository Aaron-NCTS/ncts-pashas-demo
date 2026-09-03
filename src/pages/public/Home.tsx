import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Truck, ShieldCheck, Handshake, ArrowRight } from 'lucide-react';
import { brand } from '../../config/brand';
import { Button, SectionHeading, Card } from '../../components/ui/primitives';
import { ProductImage } from '../../components/ui/ProductImage';
import { PashaLogo } from '../../components/public/PashaLogo';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRODUCT_CATEGORY_LABEL, labelFor } from '../../i18n/statusLabels';
import { listProducts } from '../../services/api';
import type { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../config/brand';

const CATEGORIES: ProductCategory[] = [
  'Tijeras profesionales', 'Kits de barbería', 'Manicure', 'Pedicure', 'Kits de belleza', 'Accesorios profesionales',
];

export function Home() {
  const { t, lang } = useLanguage();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then((all) => setFeatured(all.filter((p) => p.active).slice(0, 4)));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-ink-950 text-ivory-50 overflow-hidden">
        <div className="absolute -right-16 -top-10 opacity-[0.10] pointer-events-none hidden md:block">
          <PashaLogo className="w-[520px] h-auto" />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs tracking-wide text-gold-400 border border-gold-500/40 rounded-sm px-3 py-1 mb-6">{t('pages.home.heroTag')}</span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.08] mb-6">
              {t('pages.home.heroTitle')}<br />{t('pages.home.heroTitleLine2')}
            </h1>
            <p className="text-ivory-300 text-base md:text-lg max-w-md mb-10 leading-relaxed">
              {t('pages.home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/productos"><Button size="lg">{t('pages.home.ctaCatalog')}</Button></Link>
              <Link to="/distribuidores"><Button size="lg" variant="secondary">{t('pages.home.ctaDistributor')}</Button></Link>
            </div>
          </div>
        </div>
        <div className="rule-gold" />
      </section>

      {/* VALUE PROPS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: Scissors, label: t('pages.home.valueProp1Label'), desc: t('pages.home.valueProp1Desc') },
          { icon: Handshake, label: t('pages.home.valueProp2Label'), desc: t('pages.home.valueProp2Desc') },
          { icon: Truck, label: t('pages.home.valueProp3Label'), desc: t('pages.home.valueProp3Desc') },
          { icon: ShieldCheck, label: t('pages.home.valueProp4Label'), desc: t('pages.home.valueProp4Desc') },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label}>
            <Icon className="w-6 h-6 text-gold-500 mb-3" strokeWidth={1.5} />
            <p className="font-medium text-ink-950 text-sm mb-1">{label}</p>
            <p className="text-xs text-ink-700 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <SectionHeading eyebrow={t('pages.home.categoriesEyebrow')} title={t('pages.home.categoriesTitle')} description={t('pages.home.categoriesDesc')} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/productos?categoria=${encodeURIComponent(cat)}`}
              className="group bg-ink-950 text-ivory-100 rounded-md p-6 h-32 flex flex-col justify-between hover:bg-ink-900 transition-colors focus-ring"
            >
              <span className="text-sm font-medium">{labelFor(PRODUCT_CATEGORY_LABEL, cat, lang)}</span>
              <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading eyebrow={t('pages.home.featuredEyebrow')} title={t('pages.home.featuredTitle')} />
          <Link to="/productos" className="text-sm text-gold-600 hover:underline hidden md:inline">{t('pages.home.viewFullCatalog')}</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <Link key={p.id} to={`/productos/${p.id}`}>
              <Card className="overflow-hidden hover:border-gold-500/50 transition-colors h-full flex flex-col">
                <ProductImage gradient={p.image} category={p.category} className="h-36 w-full" />
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs text-gold-600 mb-1">{labelFor(PRODUCT_CATEGORY_LABEL, p.category, lang)}</p>
                  <p className="text-sm font-medium text-ink-950 mb-2 leading-snug">{p.name}</p>
                  <p className="text-sm font-semibold text-ink-950 mt-auto">{formatCurrency(p.publicPrice)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* AUDIENCIAS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <Card className="bg-ink-950 text-ivory-50 border-none p-10 md:p-14 text-center">
          <p className="font-display text-2xl md:text-3xl mb-3">{t('pages.home.audienceTitle')}</p>
          <p className="text-ivory-300 max-w-xl mx-auto mb-8">{t('pages.home.audienceDesc')}</p>
          <Link to="/distribuidores"><Button size="lg">{t('pages.home.requestDistributor')}</Button></Link>
        </Card>
      </section>

      {/* DISTRIBUIDORES CTA */}
      <section className="bg-ink-950 text-ivory-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold-400 text-sm tracking-wide mb-4">{t('pages.home.distProgramEyebrow')}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">{t('pages.home.distProgramTitle')} {brand.logoText}</h2>
            <p className="text-ivory-300 max-w-md leading-relaxed">
              {t('pages.home.distProgramDesc')}
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/distribuidores"><Button size="lg">{t('pages.home.requestDistributor')}</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
