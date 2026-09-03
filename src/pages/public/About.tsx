import { SectionHeading, Card } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { PashaGroupBadge } from '../../components/public/PashaLogo';
import { useLanguage } from '../../i18n/LanguageContext';

export function About() {
  const { t } = useLanguage();
  return (
    <div>
      <section className="bg-ink-950 text-ivory-50 py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <PashaGroupBadge className="w-20 h-20 mx-auto mb-5" />
          <p className="text-gold-400 text-sm mb-3">{t('pages.about.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{brand.legalName}</h1>
          <p className="text-ivory-300 max-w-xl mx-auto">{t('pages.about.heroDesc')} {brand.country}.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <SectionHeading title={t('pages.about.whoWeAre')} />
        <p className="text-sm text-ink-700 leading-relaxed mb-6">
          {brand.companyName} {t('pages.about.p1')}
        </p>
        <p className="text-sm text-ink-700 leading-relaxed mb-10">
          {t('pages.about.p2')} {brand.companyName} {t('pages.about.p2Suffix')}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">{t('pages.about.card1Title')}</p>
            <p className="text-xs text-ink-700">{t('pages.about.card1Desc')}</p>
          </Card>
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">{t('pages.about.card2Title')}</p>
            <p className="text-xs text-ink-700">{t('pages.about.card2Desc')}</p>
          </Card>
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">{t('pages.about.card3Title')}</p>
            <p className="text-xs text-ink-700">{t('pages.about.card3Desc')}</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
