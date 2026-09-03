import { Link } from 'react-router-dom';
import { SectionHeading, Button, Card } from '../../components/ui/primitives';
import { useLanguage } from '../../i18n/LanguageContext';

export function Wholesale() {
  const { t } = useLanguage();

  const TIERS = [
    { range: t('pages.wholesale.tier1Range'), desc: t('pages.wholesale.tier1Desc') },
    { range: t('pages.wholesale.tier2Range'), desc: t('pages.wholesale.tier2Desc') },
    { range: t('pages.wholesale.tier3Range'), desc: t('pages.wholesale.tier3Desc') },
    { range: t('pages.wholesale.tier4Range'), desc: t('pages.wholesale.tier4Desc') },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <SectionHeading
        eyebrow={t('pages.wholesale.eyebrow')}
        title={t('pages.wholesale.title')}
        description={t('pages.wholesale.description')}
      />
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-sm text-ink-700 leading-relaxed mb-6">
            {t('pages.wholesale.intro')}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {TIERS.map((tier) => (
              <Card key={tier.range} className="p-4">
                <p className="text-xs text-ink-700 mb-1">{tier.range}</p>
                <p className="font-display text-lg text-ink-950">{tier.desc}</p>
              </Card>
            ))}
          </div>
          <p className="text-xs text-ink-700/70 mb-6">{t('pages.wholesale.tiersNote')}</p>
          <div className="flex gap-3">
            <Link to="/distribuidores"><Button>{t('pages.wholesale.requestDistributor')}</Button></Link>
            <Link to="/productos"><Button variant="secondary">{t('pages.wholesale.viewCatalog')}</Button></Link>
          </div>
        </div>
        <Card className="p-8 bg-ink-950 text-ivory-100 border-none">
          <p className="font-display text-xl mb-4">{t('pages.wholesale.howItWorks')}</p>
          <ol className="space-y-4 text-sm text-ivory-300">
            <li><span className="text-gold-400 font-medium">1.</span> {t('pages.wholesale.step1')}</li>
            <li><span className="text-gold-400 font-medium">2.</span> {t('pages.wholesale.step2')}</li>
            <li><span className="text-gold-400 font-medium">3.</span> {t('pages.wholesale.step3')}</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
