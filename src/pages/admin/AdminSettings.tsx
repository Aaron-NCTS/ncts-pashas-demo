import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { SectionHeading, Card, Button, Field, inputClass } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { resetDemoData } from '../../services/db';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export function AdminSettings() {
  const { showToast } = useApp();
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    resetDemoData();
    showToast(t('admin.settings.resetToast'), 'success');
    setConfirming(false);
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div>
      <SectionHeading title={t('admin.settings.title')} description={t('admin.settings.description')} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-ink-950 mb-4">{t('admin.settings.brandData')}</p>
          <Field label={t('admin.settings.commercialName')}><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.companyName} /></Field>
          <Field label={t('admin.settings.legalName')}><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.legalName} /></Field>
          <Field label={t('admin.settings.contactEmail')}><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.contact.email} /></Field>
          <Field label={t('admin.settings.phone')}><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.contact.phoneDisplay} /></Field>
          <p className="text-xs text-ink-700/70">{t('admin.settings.brandNote').split('src/config/brand.ts')[0]}<code className="bg-ink-950/5 px-1 rounded-sm">src/config/brand.ts</code>{t('admin.settings.brandNote').split('src/config/brand.ts')[1]}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-ink-950 mb-2">{t('admin.settings.demoData')}</p>
          <p className="text-sm text-ink-700 mb-6 leading-relaxed">
            {t('admin.settings.demoDataDesc')}
          </p>
          {!confirming ? (
            <Button variant="danger" onClick={() => setConfirming(true)}><RotateCcw className="w-4 h-4" /> {t('admin.settings.resetButton')}</Button>
          ) : (
            <div className="bg-oxblood-500/10 rounded-sm p-4">
              <p className="text-sm text-oxblood-600 mb-3">{t('admin.settings.resetConfirm')}</p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleReset}>{t('admin.settings.yesReset')}</Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>{t('admin.settings.cancel')}</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
